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
const has = (f) => args.includes(f);

const useFirefox = has('--firefox');
const dist = join(root, useFirefox ? 'dist-firefox' : 'dist');
const profile = join(root, '.dev-profile' + (useFirefox ? '-firefox' : ''));

if (!existsSync(join(dist, 'manifest.json'))) {
  console.error(`\n  ${dist} has no manifest.json — run \`npm run ${useFirefox ? 'build:firefox' : 'build'}\` first.\n`);
  process.exit(1);
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

const ctx = await chromium.launchPersistentContext(profile, {
  channel: 'chromium',
  headless: false,
  viewport: null,
  args: [`--disable-extensions-except=${dist}`, `--load-extension=${dist}`],
});

const page = ctx.pages()[0] || (await ctx.newPage());

if (has('--fixture')) {
  // Serve the same saved markup the tests use: every Neopets surface on one
  // page, and Jelly Neo from fixtures, so nothing needs a login or the network.
  const { buildPage } = await import('../test/page.mjs');
  const jn = (f) => readFileSync(join(root, 'test/fixtures/jellyneo', f), 'utf8');
  const PAGES = [
    [/\/trading-post-history\//, 'item-5554-trading-post-history.html'],
    [/\/item\/\d+\//, 'item-5554-faerie-paint-brush.html'],
    [/\/search\//, 'search-faerie-paint-brush.html'],
  ];
  await ctx.route('**://items.jellyneo.net/**', (route) => {
    const hit = PAGES.find(([re]) => re.test(route.request().url()));
    return route.fulfill({ contentType: 'text/html', body: hit ? jn(hit[1]) : '' });
  });
  await page.route('**://www.neopets.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: buildPage() }));
  await page.goto('https://www.neopets.com/inventory.phtml');
  console.log('\n  Fixture mode: offline test page with all five item surfaces.');
} else {
  await page.goto('https://www.neopets.com/');
  console.log('\n  Real neopets.com. Your login is saved in .dev-profile between runs.');
}

console.log(`  Extension loaded from ${dist.replace(root + '/', '')}/`);
console.log('  Run `npm run dev` in another terminal for hot reload.');
console.log('  Close the browser window to stop.\n');

await new Promise((done) => ctx.on('close', done));
process.exit(0);
