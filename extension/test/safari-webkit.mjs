// Runs the *Safari* bundles in WebKit — Safari's own engine — with a stubbed
// extension runtime. This cannot exercise Safari's extension host (permission
// prompts, the real service worker), but it does cover what the Safari build
// changes: no dynamic import, no fetched web-accessible resource, inlined CSS,
// and Vuetify rendering under JavaScriptCore/WebKit rather than V8/Blink.
import { webkit } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildPage, ITEM_COUNT } from './page.mjs';

const DIST = resolve('dist-safari');
const FIXTURE = buildPage();
const contentJs = readFileSync(resolve(DIST, 'content.js'), 'utf8');
const backgroundJs = readFileSync(resolve(DIST, 'background.js'), 'utf8');

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass });
  console.log(`${pass ? '  ok  ' : ' FAIL '} ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await webkit.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.log(`    [pageerror] ${e.message.slice(0, 160)}`));
page.on('console', (m) => { if (m.type() === 'error') console.log(`    [console] ${m.text().slice(0, 160)}`); });

// Plain http so the page can reach the http backend: in the real extension the
// fetch happens from the service worker, where mixed content does not apply.
await page.route('**://www.neopets.com/**', (route) =>
  route.fulfill({ contentType: 'text/html', body: FIXTURE }));
await page.route('**://images.neopets.com/**', (route) =>
  route.fulfill({
    contentType: 'image/gif',
    body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
  }));

// A minimal stand-in for the extension runtime, using the `browser` namespace
// Safari provides.
await page.addInitScript(({ token }) => {
  const listeners = [];
  const local = {};
  const sync = { backendUrl: 'http://127.0.0.1:8787', token, hoverOnly: true };
  const area = (store) => ({
    async get(defaults) {
      if (typeof defaults === 'string') return { [defaults]: store[defaults] };
      const out = { ...(defaults || {}) };
      for (const k of Object.keys(defaults || store)) if (k in store) out[k] = store[k];
      return out;
    },
    async set(values) { Object.assign(store, values); },
    async remove(keys) { for (const k of [].concat(keys)) delete store[k]; },
  });

  globalThis.browser = {
    runtime: {
      getURL: (p) => `safari-web-extension://stub/${p}`,
      onMessage: { addListener: (fn) => listeners.push(fn) },
      sendMessage: (msg) => new Promise((res) => {
        for (const fn of listeners) if (fn(msg, {}, res)) return;
        res(undefined);
      }),
    },
    storage: { local: area(local), sync: area(sync) },
  };
  globalThis.__nsStubReady = true;
}, { token: process.env.NEOSNIPE_TOKEN || 'dev' });

await page.goto('http://www.neopets.com/inventory.phtml');
check('extension API stub installed', await page.evaluate(() => !!globalThis.__nsStubReady));

// The service worker equivalent, then the content script — both as classic
// scripts, exactly as Safari loads them.
await page.addScriptTag({ content: backgroundJs });
check('background bundle runs under WebKit',
  await page.evaluate(() => typeof browser !== 'undefined'));

await page.addScriptTag({ content: contentJs });
await page.waitForTimeout(900);

check('content script activated',
  await page.evaluate(() => document.documentElement.dataset.neosnipe === 'active'));

const badges = page.locator('.neosnipe-badge');
check('badges injected under WebKit', await badges.count() === ITEM_COUNT + 1,
  `${await badges.count()} badges (expected ${ITEM_COUNT + 1})`);

check('no extension CSS reached the page', await page.evaluate(() => {
  return ![...document.styleSheets].some((s) => {
    try { return [...s.cssRules].some((r) => r.cssText.includes('.v-application')); }
    catch { return false; }
  });
}));

await badges.first().click();

const shadowText = await page.evaluate(async () => {
  for (let i = 0; i < 80; i++) {
    const host = document.querySelector('[data-neosnipe="popover-host"]');
    const t = host?.shadowRoot?.textContent || '';
    if (/NP|cannot reach/i.test(t)) return t;
    await new Promise((r) => setTimeout(r, 250));
  }
  const host = document.querySelector('[data-neosnipe="popover-host"]');
  return `EMPTY(host=${!!host},html=${host?.shadowRoot?.innerHTML.length ?? -1})`;
});
check('popover mounts with no dynamic import and no fetched CSS',
  /[\d,]+ NP/.test(shadowText), shadowText.replace(/\s+/g, ' ').slice(0, 80));

// The inlined stylesheet must actually be adopted, not silently missing.
const styled = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
  const card = sr?.querySelector('.v-card');
  const sheets = sr?.adoptedStyleSheets || [];
  return {
    // Two sheets: the inlined bundle, plus Vuetify's generated theme colours.
    adopted: sheets.length,
    rules: sheets.reduce((n, sh) => n + sh.cssRules.length, 0),
    cardStyled: card ? getComputedStyle(card).display !== 'inline' : false,
  };
});
check('inlined stylesheets adopted into the shadow root',
  styled.adopted >= 1 && styled.rules > 100 && styled.cardStyled, JSON.stringify(styled));

check('Vuetify theme variables resolve in the shadow root', await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const cs = getComputedStyle(sr.querySelector('.ns-root'));
  // Undefined here means Vuetify's hover opacity calc() is invalid.
  return cs.getPropertyValue('--v-theme-overlay-multiplier').trim() !== '';
}));

check('Vuetify overlay stayed inside the shadow root',
  await page.evaluate(() =>
    document.querySelectorAll('body > .v-overlay-container, body > .v-overlay').length === 0));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
