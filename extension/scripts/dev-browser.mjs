#!/usr/bin/env node
// Opens a browser with the extension already loaded, so you never have to
// install it by hand while iterating.
//
//   npm run dev:browser              real neopets.com, login persists
//   npm run dev:browser -- --fixture offline test page, no login needed
//   npm run dev:browser -- --fresh   wipe the saved profile first
//   npm run dev:browser -- --firefox use the Firefox build in Gecko
//
// Run `npm run dev` alongside it for hot reload.
import { chromium, firefox } from 'playwright';
import { existsSync, rmSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
// `npm run dev:browser --fixture` (no --) makes npm swallow the flag into
// npm_config_*, so accept both spellings rather than silently ignoring it.
const has = (f) => args.includes(f) || process.env[`npm_config_${f.replace(/^--/, '')}`] === 'true';

const useFirefox = has('--firefox');
const dist = join(root, useFirefox ? 'dist-firefox' : 'dist');
const profile = join(root, '.dev-profile' + (useFirefox ? '-firefox' : ''));

// Build on demand rather than making you remember to, so `npm run fixture`
// works from a clean checkout.
if (!existsSync(join(dist, 'manifest.json'))) {
  const script = useFirefox ? 'build:firefox' : 'build';
  console.log(`  No build in ${dist.replace(root + '/', '')}/ yet — running \`npm run ${script}\`...`);
  const { execFileSync } = await import('node:child_process');
  try {
    execFileSync('npm', ['run', script], { cwd: root, stdio: 'inherit' });
  } catch {
    console.error(`\n  \`npm run ${script}\` failed — fix the build, then try again.\n`);
    process.exit(1);
  }
}
if (has('--fresh')) rmSync(profile, { recursive: true, force: true });

if (useFirefox) {
  // Playwright's Firefox cannot side-load an extension, so drive the bundles
  // the way test/bundle.mjs does rather than pretending otherwise.
  console.error('\n  Firefox cannot side-load an extension from Playwright.'
    + '\n  Use `npm run test:firefox` for an automated check, or load'
    + '\n  dist-firefox/manifest.json via about:debugging in your own Firefox.\n');
  process.exit(1);
}

const launch = () => chromium.launchPersistentContext(profile, {
  channel: 'chromium',
  headless: false,
  viewport: null,
  args: [`--disable-extensions-except=${dist}`, `--load-extension=${dist}`],
});

/**
 * A persistent profile keeps singleton locks. Closing the window uncleanly —
 * or a previous run still holding it — leaves them behind, and every later
 * launch fails with "Opening in existing browser session".
 */
function clearStaleLocks() {
  let cleared = 0;
  for (const name of ['SingletonLock', 'SingletonSocket', 'SingletonCookie']) {
    const lock = join(profile, name);
    if (existsSync(lock)) { rmSync(lock, { force: true, recursive: true }); cleared++; }
  }
  return cleared;
}

let ctx;
try {
  ctx = await launch();
} catch (err) {
  const inUse = /already in use|existing browser session/i.test(err.message);
  if (!inUse) {
    console.error(`\n  Could not launch Chromium: ${err.message.split('\n')[0]}`);
    console.error('  If the browser is missing, run:  npx playwright install chromium\n');
    process.exit(1);
  }

  if (clearStaleLocks()) {
    console.log('  Cleared a stale profile lock from a previous run, retrying...');
    ctx = await launch().catch((again) => {
      console.error(`\n  Still could not launch: ${again.message.split('\n')[0]}`);
      console.error('  A dev browser is probably still open — close it, or run with --fresh.\n');
      process.exit(1);
    });
  } else {
    console.error('\n  A dev browser is already running with this profile.');
    console.error('  Close that window, or start a clean one:  npm run dev:browser -- --fresh\n');
    process.exit(1);
  }
}

// Prove the extension actually loaded, rather than opening a browser that
// silently has no extension in it.
const sw = ctx.serviceWorkers()[0]
  || (await ctx.waitForEvent('serviceworker', { timeout: 10000 }).catch(() => null));
if (!sw) {
  console.error('\n  The browser opened but the extension did not load.');
  console.error(`  Check that ${dist}/manifest.json is a valid build, then rebuild.\n`);
} 

const page = ctx.pages()[0] || (await ctx.newPage());

if (has('--fixture')) {
  // The same saved pages the tests use: item surfaces, the Food Club bet form
  // and the daily sets, plus Jelly Neo. Nothing needs a login or the network.
  const { installNeopetsRoutes, JELLYNEO_PAGES, jellyNeoFixture } = await import('../test/routes.mjs');
  await ctx.route('**://items.jellyneo.net/**', (route) => {
    const hit = JELLYNEO_PAGES.find(([re]) => re.test(route.request().url()));
    return route.fulfill({ contentType: 'text/html', body: hit ? jellyNeoFixture(hit[1]) : '' });
  });
  await installNeopetsRoutes(ctx);
  await page.goto('https://www.neopets.com/inventory.phtml');
  console.log('\n  Fixture mode: item surfaces, Food Club and the daily sets, all offline.');
} else {
  await page.goto('https://www.neopets.com/');
  console.log('\n  Real neopets.com. Your login is saved in .dev-profile between runs.');
}

console.log(`  Extension: ${sw ? 'loaded' : 'FAILED TO LOAD'} from ${dist.replace(root + '/', '')}/`);
if (sw) {
  // The content script runs at document_idle, so give it a moment rather than
  // reporting a false alarm.
  const active = await page
    .waitForFunction(() => document.documentElement.dataset.neosnipe === 'active', null, { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  console.log(`  Content script on this page: ${active ? 'running' : 'not running (is this a neopets.com page?)'}`);
}
console.log('  Run `npm run dev` in another terminal for hot reload.');
console.log('  Close the browser window to stop.\n');

await new Promise((done) => ctx.on('close', done));
process.exit(0);
