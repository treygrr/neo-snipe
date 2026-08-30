import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { build as esbuild } from 'esbuild';

const CSS_OUT = 'neosnipe-content.css';
const CSS_PLACEHOLDER = '/*__NEOSNIPE_CSS__*/';

/**
 * Post-build packaging, per browser.
 *
 * Shared problem: Vuetify's component modules each `import "./X.css"`, so any
 * content script touching Vuetify ends up with CSS wired into
 * manifest.content_scripts.css — which the browser injects straight into the
 * host page, restyling Neopets and defeating the shadow root. Either way we
 * strip that wiring and route the stylesheet into the shadow root instead.
 *
 * Chrome: publish the stylesheet as a web-accessible file the content script
 * fetches at mount time.
 *
 * Safari: it can neither `fetch()` a web-accessible resource nor dynamically
 * `import()` one from a content script — both fail on the
 * safari-web-extension:// URL. So the stylesheet is inlined into the bundle,
 * and CRXJS's dynamic-import loaders for the content script and service worker
 * are replaced with self-contained scripts.
 */
export default function neosnipe({ target = 'chrome', outDir = 'dist' } = {}) {
  return {
    name: 'neosnipe:package',
    enforce: 'post',
    apply: 'build',
    closeBundle: {
      sequential: true,
      async handler() {
        const dist = join(process.cwd(), outDir);
        const manifestPath = join(dist, 'manifest.json');
        if (!existsSync(manifestPath)) return;

        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

        // Whatever the browser was told to inject into the page, it no longer is.
        for (const script of manifest.content_scripts || []) delete script.css;

        // The build emits one stylesheet (cssCodeSplit is off), holding the
        // Vuetify rules plus popover.css and the components' scoped styles.
        const sheets = walk(dist)
          .filter((f) => f.endsWith('.css') && relative(dist, f) !== CSS_OUT)
          .sort();
        if (!sheets.length) {
          this.warn('no stylesheets found — the popover would render unstyled');
          return;
        }
        const css = sheets.map((f) => readFileSync(f, 'utf8')).join('\n');

        if (target === 'safari') {
          await packageForSafari.call(this, { dist, manifest, css });
        } else {
          packageForChrome.call(this, { dist, manifest, css });
        }

        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      },
    },
  };
}

function packageForChrome({ dist, manifest, css }) {
  writeFileSync(join(dist, CSS_OUT), css);

  manifest.web_accessible_resources ||= [];
  const matches = manifest.content_scripts?.[0]?.matches || ['<all_urls>'];
  const entry = manifest.web_accessible_resources.find(
    (w) => JSON.stringify(w.matches) === JSON.stringify(matches),
  );
  if (entry) { if (!entry.resources.includes(CSS_OUT)) entry.resources.push(CSS_OUT); }
  else manifest.web_accessible_resources.push({ matches, resources: [CSS_OUT], use_dynamic_url: false });

  this.info?.(`published the stylesheet as ${CSS_OUT} for the shadow root`);
}

async function packageForSafari({ dist, manifest, css }) {
  // Replace each CRXJS loader with a self-contained classic script.
  const contentLoader = manifest.content_scripts?.[0]?.js?.[0];
  if (contentLoader) {
    await flatten(dist, contentLoader, 'content.js', css);
    manifest.content_scripts[0].js = ['content.js'];
  }

  const swLoader = manifest.background?.service_worker;
  if (swLoader) {
    await flatten(dist, swLoader, 'background.js');
    // Classic script, so no module imports for Safari to choke on.
    manifest.background = { service_worker: 'background.js' };
  }

  // Nothing is loaded from the extension origin at runtime any more.
  delete manifest.web_accessible_resources;

  this.info?.('inlined the stylesheet and flattened the loaders for Safari');
}

/**
 * CRXJS emits a loader that dynamically imports the real chunk. Resolve that
 * chunk, bundle it into one classic script, and optionally inline the CSS.
 */
async function flatten(dist, loaderPath, outName, css) {
  const loader = readFileSync(join(dist, loaderPath), 'utf8');
  // The loader references the entry either as a dynamic import (content
  // scripts) or a static one (service worker).
  const ref = loader.match(/["'](?:.*?)(assets\/[^"']+\.js)["']/);
  const entry = ref ? join(dist, ref[1]) : join(dist, loaderPath);

  const result = await esbuild({
    entryPoints: [entry],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'safari16',
    write: false,
    legalComments: 'none',
  });

  let code = result.outputFiles[0].text;
  if (css) {
    const before = code;
    // Vite may have re-quoted the placeholder; handle both forms.
    for (const quote of ['"', "'"]) {
      code = code.split(`${quote}${CSS_PLACEHOLDER}${quote}`).join(JSON.stringify(css));
    }
    if (code === before) throw new Error('CSS placeholder not found in the content bundle');
  }

  writeFileSync(join(dist, outName), code);
  rmSync(join(dist, loaderPath), { force: true });
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
