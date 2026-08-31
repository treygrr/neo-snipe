import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
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
 * Safari and Firefox: neither reliably supports dynamically `import()`-ing an
 * extension resource from a content script, and Safari cannot `fetch()` one
 * either. So the stylesheet is inlined into the bundle and CRXJS's
 * dynamic-import loaders are replaced with self-contained classic scripts.
 * Firefox additionally has no MV3 service worker, so its background becomes an
 * event page (`background.scripts`).
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

        if (target === 'chrome') {
          packageForChrome.call(this, { dist, manifest, css });
        } else {
          await packageFlattened.call(this, { dist, manifest, css, target });
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

async function packageFlattened({ dist, manifest, css, target }) {
  // Replace each CRXJS loader with a self-contained classic script.
  const contentLoader = manifest.content_scripts?.[0]?.js?.[0];
  if (contentLoader) {
    await flatten(dist, contentLoader, 'content.js', css);
    manifest.content_scripts[0].js = ['content.js'];
  }

  const swLoader = manifest.background?.service_worker;
  if (swLoader) {
    await flatten(dist, swLoader, 'background.js');
    // Classic script either way, so there are no module imports to choke on.
    // Firefox has no MV3 service worker, so it gets a persistent-off event page.
    manifest.background = target === 'firefox'
      ? { scripts: ['background.js'] }
      : { service_worker: 'background.js' };
  }

  // Nothing is loaded from the extension origin at runtime any more.
  delete manifest.web_accessible_resources;

  // Flattening leaves the original CRXJS chunks behind as dead weight.
  const removed = pruneUnreachable(dist, manifest);

  this.info?.(`inlined the stylesheet and flattened the loaders for ${target}`
    + (removed ? `, pruned ${removed} unreachable file(s)` : ''));
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

/**
 * Deletes files nothing can reach. Roots are whatever the manifest names;
 * from there we follow HTML src/href and static JS imports. Anything still
 * unreferenced was superseded by the flattened bundles.
 */
function pruneUnreachable(dist, manifest) {
  const rel = (f) => relative(dist, f).split(sep).join('/');

  const roots = new Set();
  for (const script of manifest.content_scripts || []) for (const j of script.js || []) roots.add(j);
  for (const b of manifest.background?.scripts || []) roots.add(b);
  if (manifest.background?.service_worker) roots.add(manifest.background.service_worker);
  for (const icon of Object.values(manifest.icons || {})) roots.add(icon);
  if (manifest.options_ui?.page) roots.add(manifest.options_ui.page);
  for (const entry of manifest.web_accessible_resources || []) for (const r of entry.resources || []) roots.add(r);

  const resolveRef = (from, ref) => {
    if (!ref || /^(https?:|data:|chrome-extension:|#)/.test(ref)) return null;
    // Vite emits root-absolute refs like "/assets/x.js"; those are relative to
    // the extension root, not to the referring file.
    const base = ref.startsWith('/') ? [] : from.split('/').slice(0, -1);
    for (const part of ref.split('/')) {
      // Skip '' so a leading slash does not become an empty path segment.
      if (part === '..') base.pop();
      else if (part !== '.' && part !== '') base.push(part);
    }
    return base.join('/');
  };

  const reachable = new Set();
  const queue = [...roots];
  while (queue.length) {
    const file = queue.shift();
    if (!file || reachable.has(file)) continue;
    const full = join(dist, file);
    if (!existsSync(full)) continue;
    reachable.add(file);

    if (/\.(html|js|css)$/.test(file)) {
      const text = readFileSync(full, 'utf8');
      const refs = [
        ...text.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g),
        ...text.matchAll(/\bfrom\s*["']([^"']+)["']/g),
        ...text.matchAll(/\bimport\s*\(\s*["']([^"']+)["']/g),
        ...text.matchAll(/\burl\(\s*["']?([^"')]+)/g),
      ].map((m) => resolveRef(file, m[1]));
      for (const r of refs) if (r) queue.push(r);
    }
  }

  let removed = 0;
  for (const full of walk(dist)) {
    const name = rel(full);
    if (name === 'manifest.json' || reachable.has(name)) continue;
    rmSync(full, { force: true });
    removed++;
  }

  // Deleting something still referenced would break a page silently, so prove
  // every surviving reference still resolves.
  const dangling = [];
  for (const file of reachable) {
    if (!/\.(html|js|css)$/.test(file)) continue;
    const text = readFileSync(join(dist, file), 'utf8');
    for (const m of [
      ...text.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g),
      ...text.matchAll(/\bfrom\s*["']([^"']+)["']/g),
    ]) {
      // Minified bundles produce plenty of regex noise, so only verify refs
      // that actually look like an emitted asset.
      if (!/\.(js|css|html|png|svg|woff2?)$/i.test(m[1])) continue;
      const target = resolveRef(file, m[1]);
      if (target && !existsSync(join(dist, target))) dangling.push(`${file} -> ${m[1]}`);
    }
  }
  if (dangling.length) {
    throw new Error(`pruning removed files that are still referenced:\n  ${dangling.join('\n  ')}`);
  }

  return removed;
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
