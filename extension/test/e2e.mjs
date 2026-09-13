// Loads the built extension into a real Chrome, serves a fake Neopets page from
// the neopets.com origin so the content script matches, and checks the badge and
// popover behaviour end to end.
import { chromium } from 'playwright';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { buildPage, ITEM_COUNT } from './page.mjs';
import { installNeopetsRoutes } from './routes.mjs';

// NS_DIST lets the release pipeline run this against release/chrome/ rather
// than the working build.
const EXT = resolve(process.env.NS_DIST || 'dist');
const FIXTURE = buildPage();

// Jelly Neo is served from saved pages: the tests must not depend on the live
// site, and must not hammer it. Any item resolves to the Faerie Paint Brush
// pages, which is enough to exercise the whole path.
const jn = (f) => readFileSync(resolve('test/fixtures/jellyneo', f), 'utf8');
const JELLYNEO = [
  [/\/trading-post-history\//, 'item-5554-trading-post-history.html'],
  [/\/item\/\d+\//, 'item-5554-faerie-paint-brush.html'],
  [/\/search\//, 'search-faerie-paint-brush.html'],
];
let jellyNeoOffline = false;
let jellyNeoRequests = 0;

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? '  ok  ' : ' FAIL '} ${name}${detail ? ` — ${detail}` : ''}`);
};

const ctx = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), 'ns-')), {
  channel: 'chromium',
  // Playwright's headless shell does not run content scripts; --headless=new
  // uses the full browser, which does.
  headless: false,
  args: ['--headless=new', `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`],
});

// Find the extension id from its service worker.
await ctx.route('**://items.jellyneo.net/**', (route) => {
  jellyNeoRequests++;
  if (jellyNeoOffline) return route.abort('failed');
  const url = route.request().url();
  const hit = JELLYNEO.find(([re]) => re.test(url));
  return hit
    ? route.fulfill({ contentType: 'text/html', body: jn(hit[1]) })
    : route.fulfill({ status: 404, body: '' });
});

const sw = ctx.serviceWorkers()[0] || (await ctx.waitForEvent('serviceworker', { timeout: 10000 }));
const extId = new URL(sw.url()).host;
console.log(`extension id: ${extId}\n`);

// --- options page: proves the Vuetify build works in the simple case ---------
const opts = await ctx.newPage();
await opts.goto(`chrome-extension://${extId}/src/options/index.html`);
await opts.waitForSelector('.v-application', { timeout: 10000 });
const optsUi = await opts.evaluate(() => ({
  switches: document.querySelectorAll('.v-switch').length,
  buttons: [...document.querySelectorAll('.v-btn')].map((b) => b.textContent.trim()),
}));
check('options page renders Vuetify', optsUi.switches === 1 && optsUi.buttons.length === 2,
  JSON.stringify(optsUi));

// Premium gates the Super Shop Wizard; the checks below exercise it.
await opts.evaluate(() => chrome.storage.sync.set({ premium: true }));

// --- content script on a neopets.com page -----------------------------------
const page = await ctx.newPage();
page.on('console', (m) => console.log(`    [page:${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => console.log(`    [page:error] ${e.message}`));
page.on('requestfailed', (r) => console.log(`    [reqfail] ${r.url().slice(0, 130)} ${r.failure()?.errorText}`));
page.on('response', (r) => { if (r.status() >= 400) console.log(`    [resp ${r.status()}] ${r.url().slice(0, 130)}`); });
await installNeopetsRoutes(ctx);

// The Shop Wizard is rate-limited on the real site, so the tests count how
// many searches the extension actually spends.
let wizardSearches = 0;
const wizardHtml = readFileSync(resolve('test/fixtures/wizard/vo-codestone.html'), 'utf8');
await ctx.route('**/np-templates/ajax/wizard.php*', (route) => {
  wizardSearches++;
  // The real wizard returns a different slice each time. Renaming one shop per
  // search models that, so merging and de-duplication are observable.
  const body = wizardSearches === 1 ? wizardHtml
    : wizardHtml.replace(/shopper001/g, `newshop${wizardSearches}`);
  return route.fulfill({ contentType: 'text/html', body });
});

await page.goto('https://www.neopets.com/inventory.phtml');
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });
await page.waitForTimeout(900); // let the delayed inventory chunk load + be scanned

const badges = page.locator('.neosnipe-badge');
check('badges injected across all seven item surfaces',
  await badges.count() === ITEM_COUNT + 1,
  `${await badges.count()} badges (expected ${ITEM_COUNT + 1})`);

check('non-item and tiny images skipped',
  await page.locator('img[alt="np"] ~ .neosnipe-badge').count() === 0);

check('badge added to dynamically inserted item',
  await page.locator('#later .neosnipe-badge').count() === 1);

// Force extra mutation-observer passes and confirm nothing gets badged twice.
await page.evaluate(() => { document.body.appendChild(document.createElement('span')); });
await page.waitForTimeout(400);
const badgeAudit = await page.evaluate(() => ({
  badges: document.querySelectorAll('.neosnipe-badge').length,
  badgedImages: document.querySelectorAll('[data-neosnipe-badged="1"]').length,
}));
check('one badge per item image, no duplicates after re-scan',
  badgeAudit.badges === badgeAudit.badgedImages && badgeAudit.badges === ITEM_COUNT + 1,
  `${badgeAudit.badges} badges / ${badgeAudit.badgedImages} badged images`);

// The page itself must receive no extension CSS.
const leaked = await page.evaluate(() => {
  const sheets = [...document.styleSheets];
  const vuetifyInPage = sheets.some((s) => {
    try { return [...s.cssRules].some((r) => r.cssText.includes('.v-application')); }
    catch { return false; }
  });
  return {
    vuetifyInPage,
    // Only our own small scoped sheets should reach the page: the badge and
    // the launcher. Everything else belongs in the shadow root.
    ours: [...document.querySelectorAll('style[data-neosnipe]')].map((s) => s.dataset.neosnipe).sort(),
    foreign: [...document.querySelectorAll('style:not([data-neosnipe])')].length,
  };
});
check('no Vuetify CSS in the host page', leaked.vuetifyInPage === false);
check('only our two scoped stylesheets are added to the page',
  JSON.stringify(leaked.ours) === '["badge","launcher"]', JSON.stringify(leaked.ours));

// --- click a badge: lazy mount + lookup -------------------------------------
check('nothing is fetched from Jelly Neo before a click', jellyNeoRequests === 0,
  `${jellyNeoRequests} requests`);

await badges.first().click();
await page.waitForSelector('[data-neosnipe="popover-host"]', { state: 'attached', timeout: 10000 });
check('exactly one popover host exists',
  await page.locator('[data-neosnipe="popover-host"]').count() === 1);

const shadowText = await page.evaluate(async () => {
  const host = document.querySelector('[data-neosnipe="popover-host"]');
  for (let i = 0; i < 60; i++) {
    const t = host.shadowRoot?.textContent || '';
    if (t.includes('NP') || t.toLowerCase().includes('cannot') || t.toLowerCase().includes('server')) return t;
    await new Promise((r) => setTimeout(r, 250));
  }
  return host.shadowRoot?.textContent || '';
});
check('popover rendered content', shadowText.trim().length > 0, shadowText.replace(/\s+/g, ' ').slice(0, 90));
check('popover shows a price', /[\d,]+ NP/.test(shadowText), (shadowText.match(/[\d,]+ NP/) || ['none'])[0]);


// Vuetify overlays must stay inside the shadow root.
const escaped = await page.evaluate(() =>
  document.querySelectorAll('body > .v-overlay-container, body > .v-overlay, body > .v-menu').length);
check('no Vuetify overlay escaped into the page', escaped === 0, `${escaped} escaped`);

const iconsAreSvg = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const icons = sr.querySelectorAll('.v-icon');
  return icons.length === 0 || [...icons].every((i) => i.querySelector('svg'));
});
check('icons render as inline SVG (no webfont)', iconsAreSvg);

// --- tabs: price history / trading post ------------------------------------
const shadowQ = (sel, prop = 'textContent') => page.evaluate(([s, pr]) => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const el = sr.querySelector(s);
  return el ? (pr === 'count' ? 1 : el[pr]) : null;
}, [sel, prop]);

const tabLabels = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return [...sr.querySelectorAll('.ns-tab')].map((t) => t.textContent.trim());
});
check('the popover has price, trading post, wizard and shops tabs',
  tabLabels.join(',') === 'Price,TP,SW,SSW', JSON.stringify(tabLabels));

// The price tab is shown first, and its rows come from the item lookup.
const priceRows = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return sr.querySelectorAll('.ns-tab-window .ns-rows tbody tr').length;
});
check('price history rows render in the first tab', priceRows > 0, `${priceRows} rows`);

// Trading post must NOT have been fetched yet — that is the whole point of the split.
const tpRequestsBefore = Number(await page.evaluate(() => window.__tpCount || 0));
check('trading post not fetched until its tab is opened', tpRequestsBefore === 0);

// The menu scales in, so measuring too early reports the animated size.
await page.waitForTimeout(500);
const windowBox = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const w = sr.querySelector('.ns-tab-window');
  return { h: Math.round(w.getBoundingClientRect().height), overflow: getComputedStyle(w).overflowY };
});
check('tab panel is fixed height and scrolls',
  windowBox.h > 100 && windowBox.h < 260 && windowBox.overflow === 'auto', JSON.stringify(windowBox));

// Open the trading post tab.
await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  [...sr.querySelectorAll('.ns-tab')].find((t) => /TP/i.test(t.textContent)).click();
});

const tpText = await page.evaluate(async () => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  for (let i = 0; i < 120; i++) {
    const t = sr.querySelector('.ns-tab-window')?.textContent || '';
    if (/owners\/90d|No trading post|unavailable|Loading/.test(t) && !/Loading/.test(t)) return t;
    await new Promise((r) => setTimeout(r, 250));
  }
  return sr.querySelector('.ns-tab-window')?.textContent || '';
});
check('trading post history loads on demand',
  /owners\/90d|lots\/90d|low price|No trading post/.test(tpText),
  tpText.replace(/\s+/g, ' ').slice(0, 80));

// Jelly Neo does not publish lot history for low-value items, and the fixture
// items are cheap — so either lots render, or the reason is shown.
const tpOutcome = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const w = sr.querySelector('.ns-tab-window');
  return { rows: w.querySelectorAll('.ns-rows tbody tr').length, text: w.textContent.trim() };
});
check('trading post tab shows lots or explains their absence',
  tpOutcome.rows > 0 || /low price/i.test(tpOutcome.text),
  tpOutcome.rows > 0 ? `${tpOutcome.rows} lots` : tpOutcome.text.replace(/\s+/g, ' ').slice(0, 60));

// The panel height must not change between tabs.
const windowBoxAfter = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return Math.round(sr.querySelector('.ns-tab-window').getBoundingClientRect().height);
});
check('panel height is stable across tabs', windowBoxAfter === windowBox.h,
  `${windowBox.h} then ${windowBoxAfter}`);

check('tab panel is scrollable when content overflows', await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const w = sr.querySelector('.ns-tab-window');
  // Force overflow so we test the container, not this item's row count.
  const probe = document.createElement('div');
  probe.style.height = '900px';
  w.appendChild(probe);
  const scrolls = w.scrollHeight > w.clientHeight && getComputedStyle(w).overflowY === 'auto';
  probe.remove();
  return scrolls;
}));

// --- the Wiz tab: searches only when opened ---------------------------------
check('opening a popover spends no Shop Wizard search', wizardSearches === 0,
  `${wizardSearches} searches`);

await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  [...root.querySelectorAll('.ns-tab')].find((t) => t.textContent.trim() === 'SW').click();
});
await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const w = root.querySelector('.ns-tab-window');
  return w && !/Asking the Shop Wizard/.test(w.textContent);
}, null, { timeout: 15000 }).catch(() => {});

const wiz = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const rows = [...root.querySelectorAll('.ns-tab-window .ns-rows tbody tr')];
  return {
    rows: rows.length,
    stats: root.querySelector('.ns-tab-window .ns-tp-stats')?.textContent.replace(/\s+/g, ' ').trim(),
    freshness: root.querySelector('.ns-tab-window .ns-research')?.title,
    // One line, not three. Children are centred and differ in height, so
    // their tops differ even unwrapped; what marks a single line is that the
    // whole row is no taller than its tallest child.
    statsWrapped: (() => {
      const el = root.querySelector('.ns-tab-window .ns-tp-stats');
      if (!el) return true;
      const boxes = [...el.children].map((c) => c.getBoundingClientRect());
      if (!boxes.length) return true;
      const span = Math.max(...boxes.map((b) => b.bottom)) - Math.min(...boxes.map((b) => b.top));
      return span > Math.max(...boxes.map((b) => b.height)) + 1;
    })(),
    statsOverflows: (() => {
      const el = root.querySelector('.ns-tab-window .ns-tp-stats');
      return el ? el.scrollWidth > el.clientWidth + 1 : false;
    })(),
    first: rows[0] && {
      owner: rows[0].querySelector('.ns-shop-owner')?.textContent.trim(),
      price: rows[0].querySelectorAll('td')[1]?.textContent.trim(),
      stock: rows[0].querySelectorAll('td')[2]?.textContent.trim(),
      href: rows[0].querySelector('a')?.href,
    },
  };
});
check('clicking the Wiz tab runs exactly one search', wizardSearches === 1,
  `${wizardSearches} searches`);
check('the wizard results render cheapest first',
  wiz.rows === 20 && wiz.first?.price === '3,900 NP' && wiz.first?.stock === 'x9',
  JSON.stringify(wiz.first));
check('wizard rows link into the shop',
  /browseshop\.phtml\?owner=.+buy_obj_info_id=/.test(wiz.first?.href || ''), wiz.first?.href);
check('it says how fresh the result is', /Searched just now|Searched \d+m ago/.test(wiz.freshness || ''),
  wiz.freshness);
check('the wizard stats stay on one line',
  !wiz.statsWrapped && !wiz.statsOverflows,
  `wrapped=${wiz.statsWrapped} overflow=${wiz.statsOverflows} — ${wiz.stats}`);

// Switching away and back must not spend another search.
await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  [...root.querySelectorAll('.ns-tab')].find((t) => t.textContent.trim() === 'Price').click();
});
await page.waitForTimeout(300);
await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  [...root.querySelectorAll('.ns-tab')].find((t) => t.textContent.trim() === 'SW').click();
});
await page.waitForTimeout(800);
check('returning to the tab reuses the result rather than searching again',
  wizardSearches === 1, `${wizardSearches} searches`);

// Searching again adds shops rather than replacing them, and never lists the
// same shop twice.
const owners = () => page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return [...root.querySelectorAll('.ns-tab-window .ns-rows tbody tr')]
    .map((r) => r.querySelector('.ns-shop-owner')?.textContent.trim());
});
const ownersBefore = await owners();

await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  root.querySelector('.ns-tab-window .ns-research').click();
});
await page.waitForFunction((n) => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return root.querySelectorAll('.ns-tab-window .ns-rows tbody tr').length > n;
}, ownersBefore.length, { timeout: 15000 }).catch(() => {});

const ownersAfter = await owners();
check('the re-search button runs another search', wizardSearches === 2,
  `${wizardSearches} searches`);
check('a second search adds shops to the list',
  ownersAfter.length === ownersBefore.length + 1,
  `${ownersBefore.length} -> ${ownersAfter.length}`);
check('no shop is listed twice',
  new Set(ownersAfter).size === ownersAfter.length,
  `${ownersAfter.length} rows, ${new Set(ownersAfter).size} unique`);
check('the list says how many searches it came from',
  /from 2 searches/.test(await page.evaluate(() => {
    const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
    return root.querySelector('.ns-tab-window .ns-tp-stats')?.textContent || '';
  })));

// --- the Shops tab: live Super Shop Wizard listings -------------------------
await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  [...root.querySelectorAll('.ns-tab')].find((t) => t.textContent.trim() === 'SSW').click();
});
await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const w = root.querySelector('.ns-tab-window');
  return w && !/Asking the Super/.test(w.textContent);
}, null, { timeout: 15000 }).catch(() => {});

const shops = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const rows = [...root.querySelectorAll('.ns-tab-window .ns-rows tbody tr')];
  return {
    stats: root.querySelector('.ns-tab-window .ns-tp-stats')?.textContent.replace(/\s+/g, ' ').trim(),
    count: rows.length,
    first: rows[0] ? {
      owner: rows[0].querySelector('.ns-shop-owner')?.textContent.trim(),
      href: rows[0].querySelector('.ns-shop-owner a')?.href,
      price: rows[0].querySelectorAll('td')[1]?.textContent.trim(),
      stock: rows[0].querySelectorAll('td')[2]?.textContent.trim(),
    } : null,
    error: root.querySelector('.ns-tp-error')?.textContent.trim() || null,
  };
});
check('the Shops tab lists cheapest-first shop prices',
  shops.count > 0 && shops.first?.price === '6,750 NP' && shops.first?.stock === 'x74',
  JSON.stringify(shops.first));
check('it shows how many shops stock it',
  /130 shops/.test(shops.stats || '') && /cheapest 6,750 NP/.test(shops.stats || ''), shops.stats);
check('each shop links straight into that shop with the item selected',
  /^https:\/\/www\.neopets\.com\/browseshop\.phtml\?owner=.+buy_obj_info_id=\d+/.test(shops.first?.href || ''),
  shops.first?.href);
check('the list is capped rather than showing all 130', shops.count <= 25, `${shops.count} rows`);

// --- theme variables must resolve inside the shadow root -------------------
// Vuetify puts defaults in `:root`, which matches nothing inside a shadow root.
// Without rewriting those to `:host`, --v-theme-overlay-multiplier is undefined,
// Vuetify's opacity calc() is invalid, and every hover is a solid black wash.
const themeVars = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const cs = getComputedStyle(sr.querySelector('.ns-root'));
  return {
    multiplier: cs.getPropertyValue('--v-theme-overlay-multiplier').trim(),
    hoverOpacity: cs.getPropertyValue('--v-hover-opacity').trim(),
  };
});
check('Vuetify theme variables resolve in the shadow root',
  themeVars.multiplier !== '' && themeVars.hoverOpacity !== '', JSON.stringify(themeVars));

// Playwright's own hover dispatches the full event sequence and pierces the
// shadow root; raw mouse.move at computed coordinates did not set :hover here.
await page.bringToFront();
await page.locator('.ns-tab').first().hover();
await page.waitForTimeout(400);

const hoverOverlay = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const tab = sr.querySelector('.ns-tab');
  const ov = tab?.querySelector('.v-btn__overlay');
  return {
    opacity: ov ? Number(getComputedStyle(ov).opacity) : null,
    hovered: tab?.matches(':hover') ?? null,
    tabCount: sr.querySelectorAll('.ns-tab').length,
    popoverOpen: !!sr.querySelector('.v-overlay__content'),
    tabText: tab?.textContent.trim(),
    // Three tabs once overflowed the card, turning the strip into a scrolling
    // slide-group whose arrow sat on top of the first tab.
    tabsFit: (() => {
      const strip = sr.querySelector('.ns-tabs');
      const total = [...sr.querySelectorAll('.ns-tab')]
        .reduce((n, t) => n + t.getBoundingClientRect().width, 0);
      return strip ? total <= strip.getBoundingClientRect().width : null;
    })(),
  };
});
check('all three tabs fit without scroll arrows', hoverOverlay.tabsFit === true,
  JSON.stringify(hoverOverlay));
check('hover overlay is subtle, not a solid black wash',
  hoverOverlay.opacity !== null && hoverOverlay.opacity > 0 && hoverOverlay.opacity < 0.5,
  JSON.stringify(hoverOverlay));
await page.mouse.move(0, 0);

// --- the bottom-right bar, favourites and dailies ---------------------------
/**
 * Opens the panel if it is not already open. Toggling blindly makes each
 * section depend on what the last one left behind, which has bitten twice.
 */
const reopenPanel = async () => {
  // Opening is what reloads favourites from storage, so a test that writes
  // storage directly has to close the panel first for the change to show.
  const open = await page.evaluate(() => !!document.querySelector('[data-neosnipe="popover-host"]')
    ?.shadowRoot?.querySelector('.ns-panel'));
  if (open) { await page.locator('.neosnipe-launcher-main').click(); await page.waitForTimeout(300); }
  await ensurePanelOpen();
};

const ensurePanelOpen = async () => {
  await page.keyboard.press('Escape'); // any popover covering the bar
  await page.waitForTimeout(300);
  const open = await page.evaluate(() => !!document.querySelector('[data-neosnipe="popover-host"]')
    ?.shadowRoot?.querySelector('.ns-panel'));
  if (!open) await page.locator('.neosnipe-launcher-main').click();
  await page.waitForSelector('.ns-panel', { timeout: 5000 });
  await page.waitForTimeout(300);
};

const sr = (sel, fn = 'textContent') => page.evaluate(([s, f]) => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const el = root.querySelector(s);
  return el ? el[f] : null;
}, [sel, fn]);

check('launcher bar is present in the page', await page.locator('.neosnipe-launcher').count() === 1);

// Favourite the item currently in the popover.
// The heart lives beside the title in the card header now.
const heartBox = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const btn = root.querySelector('.ns-card .ns-name-row .ns-fav-btn');
  if (!btn) return null;
  const r = btn.getBoundingClientRect();
  const name = root.querySelector('.ns-name').getBoundingClientRect();
  return {
    w: Math.round(r.width), h: Math.round(r.height),
    radius: getComputedStyle(btn).borderRadius,
    // Right of the title, and level with it rather than down in the actions.
    rightOfTitle: r.left >= name.right - 2,
    nearTitleTop: Math.abs(r.top - name.top) < 20,
  };
});
// It was a pill before, because Vuetify gives .v-card-actions .v-btn a min-width.
check('the favourite button is a circle, not an oval',
  heartBox && heartBox.w === heartBox.h && heartBox.w > 0, JSON.stringify(heartBox));
check('the heart sits at the top of the card, right of the title',
  heartBox?.rightOfTitle && heartBox?.nearTitleTop, JSON.stringify(heartBox));

const titleLink = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const a = root.querySelector('.ns-name--link');
  return a ? { tag: a.tagName, href: a.href, target: a.target, text: a.textContent.trim() } : null;
});
check('the title itself links to Jelly Neo',
  titleLink?.tag === 'A' && /^https:\/\/items\.jellyneo\.net\/item\/\d+\//.test(titleLink.href)
  && titleLink.target === '_blank', JSON.stringify(titleLink));
// --- where-to-buy icons, under the item information ------------------------
const whereRow = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const links = [...root.querySelectorAll('.ns-where-btn')];
  const meta = root.querySelector('.ns-meta')?.getBoundingClientRect();
  const row = root.querySelector('.ns-where')?.getBoundingClientRect();
  const price = root.querySelector('.ns-price')?.getBoundingClientRect();
  return {
    count: links.length,
    hrefs: links.map((a) => a.href),
    targets: links.map((a) => a.target),
    labels: links.map((a) => a.getAttribute('aria-label')),
    hasIcons: links.every((a) => !!a.querySelector('svg')),
    // Under the item information, above the meta line.
    belowPrice: row && price ? row.top >= price.top : null,
    aboveMeta: row && meta ? row.bottom <= meta.bottom : null,
  };
});
check('two icon links remain: trading post and auctions',
  whereRow.count === 2 && whereRow.hasIcons, JSON.stringify(whereRow.count));
check('they are icons, labelled for screen readers',
  whereRow.labels.every((l) => l && l.length > 8), JSON.stringify(whereRow.labels));
check('they point at the trading post and auction house',
  whereRow.hrefs[0].includes('/island/tradingpost.phtml?type=browse')
  && whereRow.hrefs[1].includes('/genie.phtml?type=process_genie'),
  JSON.stringify(whereRow.hrefs.map((h) => h.split('?')[0].replace('https://www.neopets.com', ''))));
check('they carry the resolved item name',
  whereRow.hrefs.every((h) => h.includes('Faerie+Paint+Brush')));
check('they open in a new tab', whereRow.targets.every((t) => t === '_blank'));
check('they sit under the item information',
  whereRow.belowPrice === true && whereRow.aboveMeta === true, JSON.stringify(whereRow));
check('the shop wizard buttons are gone from the card', await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return !root.querySelector('.ns-search-btn') && !root.querySelector('.ns-search-btn--ssw');
}));

check('the old Jelly Neo action button is gone', await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return ![...root.querySelectorAll('.ns-actions .v-btn')].some((b) => /jelly neo/i.test(b.textContent));
}));

await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  root.querySelector('.ns-card .ns-name-row .ns-fav-btn').click();
});
await page.waitForTimeout(300);
const stored = await opts.evaluate(() => chrome.storage.local.get('favorites'));
check('the heart saves a favourite', (stored.favorites || []).length === 1,
  JSON.stringify((stored.favorites || []).map((f) => f.name)));

// Open the panel from the launcher.
await page.locator('.neosnipe-launcher-main').click();
await page.waitForTimeout(500);
// Not just "the element exists": it rendered off-screen once, and an
// existence check happily passed while nothing was visible.
const panelBox = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const el = root.querySelector('.ns-panel');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
    onScreen: r.width > 100 && r.height > 100
      && r.top >= 0 && r.left >= 0
      && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1,
    // Bottom-right, where it is supposed to be.
    bottomRight: r.right > innerWidth * 0.6 && r.bottom > innerHeight * 0.5,
  };
});
check('launcher opens the panel, visible on screen',
  panelBox?.onScreen === true, JSON.stringify(panelBox));
check('panel is anchored bottom-right', panelBox?.bottomRight === true);
check('launcher shows it is open',
  await page.locator('.neosnipe-launcher[data-open="1"]').count() === 1);

// The favourite records the Neopets item you clicked, not the Jelly Neo name
// it resolved to — that is what a re-lookup searches for.
const favRow = (await sr('.ns-fav-name'))?.trim();
check('the favourite is listed in the panel',
  favRow === stored.favorites[0].name, `panel="${favRow}" stored="${stored.favorites[0].name}"`);

// Dailies tab: the links must be real neopets.com URLs.
await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  [...root.querySelectorAll('.ns-panel-tab')].find((t) => /dailies/i.test(t.textContent)).click();
});
await page.waitForTimeout(400);
const dailies = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const links = [...root.querySelectorAll('.ns-daily')];
  return {
    groups: root.querySelectorAll('.ns-group').length,
    shown: links.length,
    allNeopets: links.every((a) => a.href.startsWith('https://www.neopets.com/')),
    hasFoodClub: links.some((a) => /foodclub/.test(a.href)),
    hasBargainStocks: links.some((a) => /stockmarket.*bargain/.test(a.href)),
    wheels: links.filter((a) => /wheel|monotony|mediocrity|extravagance|knowledge/i.test(a.textContent)).length,
  };
});
check('dailies are grouped', dailies.groups >= 5, `${dailies.groups} groups`);

// --- chevrons reflect open/closed, and dailies can be favourited -----------
const inShadow = (fn, arg) => page.evaluate(([f, a]) => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  // eslint-disable-next-line no-new-func
  return new Function('root', 'arg', `return (${f})(root, arg)`)(root, a);
}, [fn.toString(), arg]);

const chevronState = await inShadow((root) => {
  const heads = [...root.querySelectorAll('.ns-group-head')];
  return heads.slice(0, 4).map((h) => ({
    title: h.querySelector('.ns-group-title').textContent.trim(),
    expanded: h.getAttribute('aria-expanded'),
    rotated: getComputedStyle(h.querySelector('.ns-chevron')).transform !== 'none',
    bodyVisible: h.parentElement.querySelector('.ns-group-body').offsetParent !== null,
  }));
});
check('every group head has a chevron', chevronState.every((g) => g.rotated !== undefined));
check('open groups rotate their chevron and show their body',
  chevronState.every((g) => (g.expanded === 'true') === g.bodyVisible)
  && chevronState.some((g) => g.expanded === 'true' && g.rotated)
  && chevronState.some((g) => g.expanded === 'false' && !g.rotated),
  JSON.stringify(chevronState.map((g) => `${g.title}:${g.expanded}/${g.rotated ? 'rot' : 'flat'}`)));

// Collapsing a group must flip both the attribute and the chevron.
const beforeToggle = chevronState.find((g) => g.expanded === 'true').title;
await inShadow((root, title) => {
  [...root.querySelectorAll('.ns-group-head')]
    .find((h) => h.querySelector('.ns-group-title').textContent.trim() === title).click();
}, beforeToggle);
await page.waitForTimeout(350);
const afterToggle = await inShadow((root, title) => {
  const h = [...root.querySelectorAll('.ns-group-head')]
    .find((x) => x.querySelector('.ns-group-title').textContent.trim() === title);
  return {
    expanded: h.getAttribute('aria-expanded'),
    rotated: getComputedStyle(h.querySelector('.ns-chevron')).transform !== 'none',
    bodyVisible: h.parentElement.querySelector('.ns-group-body').offsetParent !== null,
  };
}, beforeToggle);
check('collapsing a group updates chevron and hides the body',
  afterToggle.expanded === 'false' && !afterToggle.rotated && !afterToggle.bodyVisible,
  JSON.stringify(afterToggle));

// Every label starts at one indent, ticked or not. An untracked daily (no
// reset timer, like the Soup Kitchen) once sat 18px further right. Its group
// may be collapsed here, and a hidden row has no layout to measure, so open
// that group for the check and put it back afterwards.
const openedForIndent = await inShadow((root) => {
  const group = root.querySelector('.ns-daily-tick--placeholder')?.closest('.ns-group');
  const body = group?.querySelector('.ns-group-body');
  if (!body || body.getBoundingClientRect().height > 0) return false;
  group.querySelector('.ns-group-head').click();
  return true;
});
await page.waitForTimeout(300);
const dailyIndents = await inShadow((root) => {
  const rows = [...root.querySelectorAll('.ns-daily-row:not(.ns-daily-row--pinned)')]
    .filter((row) => row.getBoundingClientRect().height > 0);
  const start = (row) => {
    const link = row.querySelector('.ns-daily');
    return Math.round(link.getBoundingClientRect().left + parseFloat(getComputedStyle(link).paddingLeft));
  };
  const tracked = rows.filter((r) => r.querySelector('.ns-daily-tick:not(.ns-daily-tick--placeholder)'));
  const untracked = rows.filter((r) => r.querySelector('.ns-daily-tick--placeholder'));
  return {
    tracked: tracked.length,
    untracked: untracked.length,
    starts: [...new Set(rows.map(start))],
  };
});
check('ticked and untracked dailies start their labels at the same indent',
  dailyIndents.tracked > 0 && dailyIndents.untracked > 0 && dailyIndents.starts.length === 1,
  JSON.stringify(dailyIndents));
if (openedForIndent) {
  await inShadow((root) => root.querySelector('.ns-daily-tick--placeholder')
    ?.closest('.ns-group')?.querySelector('.ns-group-head')?.click());
  await page.waitForTimeout(300);
}

// Favourite a daily.
const favedDaily = await inShadow((root) => {
  const row = root.querySelector('.ns-daily-row');
  const label = row.querySelector('.ns-daily').textContent.trim();
  row.querySelector('.ns-daily-fav').click();
  return label;
});
await page.waitForTimeout(400);
const dailyStore = await opts.evaluate(() => chrome.storage.local.get('dailyFavorites'));
check('a daily can be favourited', (dailyStore.dailyFavorites || []).length === 1,
  JSON.stringify((dailyStore.dailyFavorites || []).map((d) => d.label)));

const pinned = await inShadow((root) => {
  const first = root.querySelector('.ns-group');
  return {
    title: first.querySelector('.ns-group-title').textContent.trim(),
    pinnedClass: first.classList.contains('ns-group--pinned'),
    firstItem: first.querySelector('.ns-daily')?.textContent.trim(),
    total: root.querySelectorAll('.ns-group').length,
  };
});
check('favourited dailies appear in a pinned group at the top',
  pinned.title === 'Favourites' && pinned.pinnedClass && pinned.firstItem === favedDaily,
  JSON.stringify(pinned));
check('the daily also stays in its original group', pinned.total === dailies.groups + 1,
  `${pinned.total} groups`);

// Unfavouriting removes the pinned group again.
await inShadow((root) => {
  root.querySelector('.ns-group--pinned .ns-daily-fav').click();
});
await page.waitForTimeout(400);
check('unfavouriting removes the pinned group',
  await inShadow((root) => root.querySelector('.ns-group .ns-group-title').textContent.trim()) !== 'Favourites');

// Pinned dailies reorder by dragging, like item favourites.
await opts.evaluate(() => chrome.storage.local.set({
  dailyFavorites: [
    { label: 'First Daily', url: 'https://www.neopets.com/wishing.phtml' },
    { label: 'Second Daily', url: 'https://www.neopets.com/neolodge.phtml' },
  ],
}));
await reopenPanel();
await inShadow((root) => {
  [...root.querySelectorAll('.ns-panel-tab')].find((t) => /dailies/i.test(t.textContent)).click();
});
await page.waitForTimeout(400);

const pinnedBefore = await inShadow((root) =>
  [...root.querySelectorAll('.ns-group--pinned .ns-daily')].map((a) => a.textContent.trim()));
check('two pinned dailies are listed in order',
  pinnedBefore.join(',') === 'First Daily,Second Daily', JSON.stringify(pinnedBefore));

check('only pinned dailies are draggable', await inShadow((root) => {
  const pinned = root.querySelector('.ns-group--pinned .ns-daily-row');
  const other = [...root.querySelectorAll('.ns-daily-row')]
    .find((r) => !r.closest('.ns-group--pinned'));
  return pinned.getAttribute('draggable') === 'true' && other.getAttribute('draggable') === 'false';
}));

await page.locator('.ns-group--pinned .ns-daily-row').first()
  .dragTo(page.locator('.ns-group--pinned .ns-daily-row').nth(1));
await page.waitForTimeout(600);

const pinnedAfter = await inShadow((root) =>
  [...root.querySelectorAll('.ns-group--pinned .ns-daily')].map((a) => a.textContent.trim()));
check('dragging reorders the pinned dailies',
  pinnedAfter.join(',') === 'Second Daily,First Daily', JSON.stringify(pinnedAfter));

const storedDailies = await opts.evaluate(() => chrome.storage.local.get('dailyFavorites'));
check('the pinned order is persisted',
  (storedDailies.dailyFavorites || []).map((d) => d.label).join(',') === 'Second Daily,First Daily',
  JSON.stringify((storedDailies.dailyFavorites || []).map((d) => d.label)));

// Reset for the checks below.
await opts.evaluate(() => chrome.storage.local.remove('dailyFavorites'));

check('every daily link points at neopets.com', dailies.allNeopets);
check('food club and bargain stocks are there',
  dailies.hasFoodClub && dailies.hasBargainStocks);
check('all the wheels are there', dailies.wheels >= 7, `${dailies.wheels} wheels`);

const labs = await inShadow((root) => {
  const links = [...root.querySelectorAll('.ns-daily')];
  return {
    group: [...root.querySelectorAll('.ns-group-title')].map((t) => t.textContent.trim()).includes('Labs'),
    lab: links.find((a) => /^lab ray$/i.test(a.textContent.trim()))?.href,
    petpet: links.find((a) => /petpet lab/i.test(a.textContent.trim()))?.href,
  };
});
check('the list grew with the second guide',
  dailies.shown > 90 && dailies.groups >= 9, `${dailies.shown} links in ${dailies.groups} groups`);

const newer = await inShadow((root) => {
  const links = [...root.querySelectorAll('.ns-daily')];
  const by = (name) => links.find((a) => a.textContent.trim() === name)?.href;
  return {
    snowager: by('Snowager'),
    turmaculus: by('Turmaculus'),
    coincidence: by('The Coincidence'),
    training: [...root.querySelectorAll('.ns-group-title')].map((t) => t.textContent.trim()),
  };
});
check('dailies from the second guide are present',
  newer.snowager === 'https://www.neopets.com/winter/snowager.phtml'
  && newer.turmaculus === 'https://www.neopets.com/medieval/turmaculus.phtml'
  && newer.coincidence === 'https://www.neopets.com/magma/portal/ship.phtml',
  JSON.stringify(newer.snowager));
check('the new Training and Contests groups exist',
  newer.training.includes('Training') && newer.training.includes('Contests'),
  JSON.stringify(newer.training));

check('both labs are listed',
  labs.group && labs.lab === 'https://www.neopets.com/lab.phtml'
  && labs.petpet === 'https://www.neopets.com/petpetlab.phtml', JSON.stringify(labs));

// Opening a favourite must re-fetch, not serve the cached price.
await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  [...root.querySelectorAll('.ns-panel-tab')].find((t) => /favourites/i.test(t.textContent)).click();
});
await page.waitForTimeout(300);
const requestsBeforeRefresh = jellyNeoRequests;
await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  root.querySelector('.ns-fav').click();
});
await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return /NP/.test(root.querySelector('.ns-card')?.textContent || '');
}, null, { timeout: 15000 }).catch(() => {});
check('opening a favourite refetches instead of using the cache',
  jellyNeoRequests > requestsBeforeRefresh,
  `${jellyNeoRequests - requestsBeforeRefresh} requests`);
// The menu takes min-width from its activator unless told otherwise, so a
// favourite row in the wide panel would stretch the popover.
const popoverWidth = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const el = root.querySelector('.v-overlay__content');
  return el ? Math.round(el.getBoundingClientRect().width) : null;
});
check('the popover keeps its own width when opened from the panel',
  popoverWidth !== null && popoverWidth <= 345, `${popoverWidth}px`);

check('the refetched result is not marked cached',
  !/cached/i.test(await sr('.ns-meta') || ''), await sr('.ns-meta'));

await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  root.querySelector('.ns-panel-head .ns-close').click();
});
await page.waitForTimeout(300);
check('closing the panel un-highlights the launcher',
  await page.locator('.neosnipe-launcher[data-open="1"]').count() === 0);

// --- reordering favourites by dragging --------------------------------------
// Add a second favourite so there is an order to change.
await opts.evaluate(() => chrome.storage.local.set({
  favorites: [
    { name: 'Alpha Item', imageHash: 'alpha', imageUrl: null, addedAt: 2 },
    { name: 'Beta Item', imageHash: 'beta', imageUrl: null, addedAt: 1 },
  ],
}));
await ensurePanelOpen(); // opening reloads favourites from storage
await inShadow((root) => {
  [...root.querySelectorAll('.ns-panel-tab')].find((t) => /favourites/i.test(t.textContent)).click();
});
await page.waitForTimeout(300);

const orderBefore = await inShadow((root) =>
  [...root.querySelectorAll('.ns-fav-name')].map((e) => e.textContent.trim()));
check('two favourites are listed in order',
  orderBefore.join(',') === 'Alpha Item,Beta Item', JSON.stringify(orderBefore));

check('favourites have a drag handle and are draggable', await inShadow((root) => {
  const row = root.querySelector('.ns-fav');
  return row.getAttribute('draggable') === 'true' && !!row.querySelector('.ns-fav-grip');
}));

// Playwright's CSS selectors pierce open shadow roots, so this is a real drag.
await page.locator('.ns-fav').first().dragTo(page.locator('.ns-fav').nth(1));
await page.waitForTimeout(600);

const orderAfter = await inShadow((root) =>
  [...root.querySelectorAll('.ns-fav-name')].map((e) => e.textContent.trim()));
check('dragging reorders the list',
  orderAfter.join(',') === 'Beta Item,Alpha Item', JSON.stringify(orderAfter));

const storedOrder = await opts.evaluate(() => chrome.storage.local.get('favorites'));
check('the new order is persisted',
  (storedOrder.favorites || []).map((f) => f.name).join(',') === 'Beta Item,Alpha Item',
  JSON.stringify((storedOrder.favorites || []).map((f) => f.name)));

// --- the shop margin: what this shop asks vs what Jelly Neo says it is worth
// The shop fixture asks 387 NP; every Jelly Neo lookup here returns the Faerie
// Paint Brush at 1,300,000 NP, so the spread clears any sane threshold.
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await page.locator('.shop-item .neosnipe-badge').first().click();
await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
  return !!root?.querySelector('.ns-card');
}, null, { timeout: 15000 }).catch(() => {});

const shopMarginRow = await inShadow((root) => {
  const el = root.querySelector('.ns-margin');
  return el && { text: el.textContent.replace(/\s+/g, ' ').trim(), good: el.classList.contains('ns-margin--good') };
});
check('a shop item shows what it is asking against what it is worth',
  /387 NP here/.test(shopMarginRow?.text || ''), JSON.stringify(shopMarginRow?.text));
check('a spread over the threshold is marked as clearing it',
  shopMarginRow?.good === true && /clears/.test(shopMarginRow?.text || ''),
  JSON.stringify(shopMarginRow?.text));

// An inventory item has no asking price, so there is nothing to compare.
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await page.locator('.grid-item .neosnipe-badge').first().click();
await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
  return !!root?.querySelector('.ns-card');
}, null, { timeout: 15000 }).catch(() => {});
check('an item with no asking price shows no margin at all',
  await inShadow((root) => !root.querySelector('.ns-margin')));

// --- Food Club: read the round, pick a risk level, place a bet --------------
await ensurePanelOpen();
await inShadow((root) => {
  [...root.querySelectorAll('.ns-panel-tab')].find((t) => /food club/i.test(t.textContent)).click();
});
await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  return root.querySelector('.ns-bet') || root.querySelector('.ns-fc-error');
}, null, { timeout: 15000 }).catch(() => {});

const fcState = await inShadow((root) => ({
  error: root.querySelector('.ns-fc-error')?.textContent?.trim() || null,
  maxBet: root.querySelector('.ns-fc-max')?.textContent?.trim(),
  amount: root.querySelector('.ns-fc-input')?.value,
  levels: [...root.querySelectorAll('.ns-fc-level')].map((b) => b.textContent.trim()),
  bets: root.querySelectorAll('.ns-bet').length,
  firstBetOdds: root.querySelector('.ns-bet-odds')?.textContent?.trim(),
}));
check('Food Club reads your max bet from the bet page',
  fcState.maxBet === 'of 10,540 max' && fcState.amount === '10540', JSON.stringify(fcState.maxBet));
check('all four risk levels are offered',
  fcState.levels.length === 4 && fcState.levels.includes('Beginner') && fcState.levels.includes('Adventurous'),
  JSON.stringify(fcState.levels));
check('bets render with real odds and a payout',
  fcState.bets > 0 && /\d+:1 · wins [\d,]+ NP/.test(fcState.firstBetOdds || ''),
  `${fcState.bets} bets, first: ${fcState.firstBetOdds}`);

// Switching level changes the set.
const beginnerCount = await inShadow((root) => {
  [...root.querySelectorAll('.ns-fc-level')].find((b) => /beginner/i.test(b.textContent)).click();
  return root.querySelectorAll('.ns-bet').length;
});
await page.waitForTimeout(300);
check('switching risk level re-renders the set', beginnerCount > 0, `${beginnerCount} bets`);

const betButtons = await inShadow((root) => {
  const foot = root.querySelector('.ns-bet .ns-bet-foot');
  return {
    buttons: [...foot.querySelectorAll('.v-btn')].map((b) => b.textContent.trim()),
    hasDoneToggle: !!foot.querySelector('.ns-done input[type=checkbox]'),
  };
});
check('each bet offers Place',
  betButtons.buttons.includes('Place') && !betButtons.buttons.includes('Fill'),
  JSON.stringify(betButtons.buttons));
check('each bet has a done toggle you can set yourself', betButtons.hasDoneToggle);

// Ticking it marks the bet done, and unticking clears it.
await inShadow((root) => root.querySelector('.ns-bet .ns-done input').click());
await page.waitForTimeout(400);
const afterTick = await inShadow((root) => ({
  marked: root.querySelector('.ns-bet').classList.contains('ns-bet--done'),
  checked: root.querySelector('.ns-bet .ns-done input').checked,
}));
check('ticking done marks the bet', afterTick.marked && afterTick.checked, JSON.stringify(afterTick));

const storedDone = await opts.evaluate(() => chrome.storage.local.get('fcDone'));
check('done marks are stored against the round',
  storedDone.fcDone?.round === '9978' && storedDone.fcDone.ids.length === 1,
  JSON.stringify(storedDone.fcDone));

await inShadow((root) => root.querySelector('.ns-bet .ns-done input').click());
await page.waitForTimeout(400);
check('unticking clears it again',
  await inShadow((root) => !root.querySelector('.ns-bet').classList.contains('ns-bet--done')));

// Place: sent from the page itself, with a toast rather than a tab.
const oddsShown = await inShadow((root) =>
  root.querySelector('.ns-bet .ns-bet-odds')?.textContent.trim() || '');

// Watch what the page requests, since nothing navigates now.
const placeRequests = [];
page.on('request', (r) => {
  if (r.url().includes('process_foodclub.phtml')) placeRequests.push(r.url());
});

// Success is a 302 to the current-bets page. Playwright cannot fulfil a
// redirect that a `fetch` will follow — it fails the request outright — and the
// panel's fetch runs in the content script's isolated world, out of reach of a
// stub. So the success branch is covered by unit tests over wasPlaced(), and
// what is checked here is the request itself and the refusal path.
await page.route('**://www.neopets.com/pirates/process_foodclub.phtml*', (route) => route.fulfill({
  contentType: 'text/html',
  body: readFileSync(resolve('test/fixtures/foodclub', 'refused.html'), 'utf8'),
}));

const tabsBefore = ctx.pages().length;
await inShadow((root) => root.querySelector('.ns-bet .ns-btn-place').click());
await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
  return !!root?.querySelector('.ns-toast');
}, null, { timeout: 15000 }).catch(() => {});

check('Place opens no tab', ctx.pages().length === tabsBefore,
  `${tabsBefore} -> ${ctx.pages().length}`);
check('Place requests the bet handler itself', placeRequests.length === 1, `${placeRequests.length} requests`);

const placeParams = new URL(placeRequests[0] || 'https://x/?').searchParams;
check('the place URL names a winner per arena bet on, and matches them',
  [...placeParams.keys()].filter((k) => /^winner\d$/.test(k)).length
    === placeParams.getAll('matches[]').length
  && placeParams.getAll('matches[]').length > 0,
  placeRequests[0]?.split('?')[1]);
check('the place URL carries the stake, the odds and the winnings',
  placeParams.get('bet_amount') === '10540'
  && Number(placeParams.get('total_odds')) > 0
  && placeParams.get('type') === 'bet',
  `amount=${placeParams.get('bet_amount')} odds=${placeParams.get('total_odds')} winnings=${placeParams.get('winnings')}`);
check('the winnings sent are the stake at those odds, capped at 1M',
  Number(placeParams.get('winnings')) > 0
  && Number(placeParams.get('winnings'))
    === Math.min(Number(placeParams.get('total_odds')) * 10540, 1_000_000),
  `${placeParams.get('winnings')} for ${oddsShown}`);
check('the odds sent are the odds shown on the bet',
  oddsShown.startsWith(`${placeParams.get('total_odds')}:1`),
  `${oddsShown} vs ${placeParams.get('total_odds')}`);

const toast = await inShadow((root) => {
  const t = root.querySelector('.ns-toast');
  return t && {
    text: t.textContent.replace(/\s+/g, ' ').trim(),
    bad: t.classList.contains('ns-toast--bad'),
  };
});
check('a bet Neopets refuses is reported in its own words',
  toast?.bad === true && /cannot place the same bet more than once/.test(toast?.text || ''),
  JSON.stringify(toast?.text));
check('a bet that was not placed is not marked done',
  await inShadow((root) => !root.querySelector('.ns-bet').classList.contains('ns-bet--done')));

const fcLinks = await inShadow((root) => {
  const links = [...root.querySelectorAll('.ns-fc-links a')];
  const levels = root.querySelector('.ns-fc-levels');
  return {
    hrefs: links.map((a) => a.getAttribute('href')),
    colours: links.map((a) => [...a.classList].filter((c) => /^(text|bg)-/.test(c)).join(' ')),
    // 4 === DOCUMENT_POSITION_FOLLOWING: the levels come after the links.
    aboveLevels: !!levels && (links[0].compareDocumentPosition(levels) & 4) === 4,
  };
});
check('the tab links to your bets and to collecting winnings',
  fcLinks.hrefs.some((h) => /current_bets/.test(h)) && fcLinks.hrefs.some((h) => /type=collect/.test(h)),
  JSON.stringify(fcLinks.hrefs));
check('those links sit above the risk levels', fcLinks.aboveLevels === true);

// The two fixtures come from the same round, so some of the day's set bets are
// already on — which is the whole point of reading the current-bets page.
const placedRows = await inShadow((root) => {
  const rows = [...root.querySelectorAll('.ns-bet')];
  return {
    total: rows.length,
    placed: rows.filter((r) => r.querySelector('.ns-placed')).length,
    // A bet Neopets already has on offers no Place button and no checkbox.
    placedOfferPlace: rows.filter((r) => r.querySelector('.ns-placed') && r.querySelector('.ns-btn-place')).length,
    placedOfferTick: rows.filter((r) => r.querySelector('.ns-placed') && r.querySelector('.ns-done input')).length,
    placedAreDone: rows.filter((r) => r.querySelector('.ns-placed'))
      .every((r) => r.classList.contains('ns-bet--done')),
  };
});
check('bets already on with Neopets are shown as placed',
  placedRows.placed > 0 && placedRows.placed < placedRows.total,
  `${placedRows.placed} of ${placedRows.total}`);
check('a placed bet cannot be placed again', placedRows.placedOfferPlace === 0);
check('a placed bet is not offered as a tick to undo', placedRows.placedOfferTick === 0);
check('a placed bet reads as done', placedRows.placedAreDone === true);
check('each link is coloured, and differently from the other',
  fcLinks.colours.every(Boolean) && fcLinks.colours[0] !== fcLinks.colours[1],
  JSON.stringify(fcLinks.colours));

await inShadow((root) => root.querySelector('.ns-toast-x').click());
await page.waitForTimeout(300);
check('the toast can be dismissed',
  await inShadow((root) => !root.querySelector('.ns-toast')));

// A refused bet must not be marked done, and must say why. The delay also
// gives the button's loading state something to be observed during.
// A refusal answers with a page rather than redirecting. The delay also gives
// the button's loading state something to be observed during.
await page.unroute('**://www.neopets.com/pirates/process_foodclub.phtml*');
await page.route('**://www.neopets.com/pirates/process_foodclub.phtml*', async (route) => {
  await new Promise((r) => setTimeout(r, 1200));
  // A different refusal, in Neopets' error block, to show the reason shown is
  // whatever the page says rather than a phrase of ours.
  return route.fulfill({
    contentType: 'text/html',
    body: '<div class="errorMessage"><b>Error: </b>You do not have enough Neopoints!</div>',
  });
});

await inShadow((root) => root.querySelectorAll('.ns-bet')[1].querySelector('.ns-btn-place').click());
await page.waitForTimeout(500);

check('the button shows a loading state while the bet is in flight',
  await inShadow((root) => {
    const btn = root.querySelectorAll('.ns-bet')[1].querySelector('.ns-btn-place');
    return btn.classList.contains('v-btn--loading') || !!btn.querySelector('.v-progress-circular');
  }));
check('the other Place buttons are disabled while one is in flight',
  await inShadow((root) => root.querySelector('.ns-bet .ns-btn-place').disabled === true));

await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
  return !!root?.querySelector('.ns-toast--bad');
}, null, { timeout: 15000 }).catch(() => {});

const refusalToast = await inShadow((root) => root.querySelector('.ns-toast')?.textContent || '');
check('a refused bet says why', /do not have enough Neopoints/i.test(refusalToast),
  JSON.stringify(refusalToast));
check('a refused bet is not marked done',
  await inShadow((root) => !root.querySelectorAll('.ns-bet')[1].classList.contains('ns-bet--done')));
check('the buttons come back after a refusal',
  await inShadow((root) => root.querySelectorAll('.ns-bet')[1]
    .querySelector('.ns-btn-place').disabled === false));
await page.unroute('**://www.neopets.com/pirates/process_foodclub.phtml*');

// --- settings: the cog, the premium toggle, export and import --------------
await ensurePanelOpen();
await inShadow((root) => root.querySelector('.ns-cog').click());
await page.waitForTimeout(400);

// Clicking `.ns-set-row input` by index broke the moment a toggle was added
// above it, so these are addressed by their label instead.
const clickToggle = (label) => inShadow((root, l) => {
  const row = [...root.querySelectorAll('.ns-set-row')]
    .find((r) => r.querySelector('strong')?.textContent.includes(l));
  row.querySelector('input').click();
}, label);
const toggleState = (label) => inShadow((root, l) => {
  const row = [...root.querySelectorAll('.ns-set-row')]
    .find((r) => r.querySelector('strong')?.textContent.includes(l));
  return { checked: row?.querySelector('input')?.checked, disabled: row?.querySelector('input')?.disabled };
}, label);

const settingsView = await inShadow((root) => ({
  shown: !!root.querySelector('.ns-settings'),
  tabsHidden: !root.querySelector('.ns-panel-tabs'),
  toggles: [...root.querySelectorAll('.ns-set-row strong')].map((e) => e.textContent.trim()),
  premiumOn: root.querySelector('.ns-set-row input')?.checked,
}));
check('the cog opens a settings view', settingsView.shown && settingsView.tabsHidden,
  JSON.stringify(settingsView));
check('it offers detection, premium, hover, dailies, the margin, the caches and the layout switches',
  settingsView.toggles.length === 11 && /Detect/.test(settingsView.toggles[0])
  && /dailies/i.test(settingsView.toggles[3]) && /margin/i.test(settingsView.toggles[4])
  && /^Shop Wizard cache/.test(settingsView.toggles[5])
  && /^Super Shop Wizard cache/.test(settingsView.toggles[6])
  && settingsView.toggles.slice(7).every((t) => /^(Move|Drag|Reopen) /.test(t)),
  JSON.stringify(settingsView.toggles));

// Detection is on by default, so the manual toggle is shown but not editable.
const autoState = await toggleState('Detect Neopets Premium');
const manualState = await toggleState('I have Neopets Premium');
check('detection is on by default', autoState.checked === true);
check('the manual toggle is locked while detection is on', manualState.disabled === true,
  JSON.stringify(manualState));

// Turning detection off hands control back.
await clickToggle('Detect Neopets Premium');
await page.waitForTimeout(400);
check('turning detection off unlocks the manual toggle',
  (await toggleState('I have Neopets Premium')).disabled === false);

await inShadow((root) => [...root.querySelectorAll('.ns-set-actions .v-btn')]
  .find((b) => b.textContent.trim() === 'Export').click());
await page.waitForTimeout(700);

const exported = await inShadow((root) => root.querySelector('.ns-set-box')?.value || '');
let parsed = null;
try { parsed = JSON.parse(exported); } catch { /* stays null */ }
check('export produces valid JSON naming the app and version',
  parsed?.app === 'neo-snipe' && Number.isInteger(parsed.version),
  parsed ? `v${parsed.version}` : `not JSON: ${exported.slice(0, 40)}`);
check('the export carries settings and both lists',
  parsed?.settings?.premium === true && Array.isArray(parsed.favourites)
  && Array.isArray(parsed.dailyFavourites), JSON.stringify(parsed?.settings));
check('cached prices are left out of the export',
  !JSON.stringify(parsed || {}).includes('p2:'));

const edited = JSON.stringify({
  ...parsed,
  settings: { ...parsed.settings, hoverOnly: false },
  favourites: [{ name: 'Imported Item', imageHash: 'imported', imageUrl: null, addedAt: 1 }],
  dailyFavourites: [{ label: 'Wishing Well', url: 'https://www.neopets.com/wishing.phtml' }],
});
const typeIntoBox = (text) => page.evaluate((t) => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const box = root.querySelector('.ns-set-box');
  Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(box, t);
  box.dispatchEvent(new Event('input', { bubbles: true }));
}, text);
const pressImport = () => inShadow((root) => [...root.querySelectorAll('.ns-set-actions .v-btn')]
  .find((b) => b.textContent.trim() === 'Import').click());

await typeIntoBox(edited);
await page.waitForTimeout(200);
await pressImport();
await page.waitForTimeout(800);

const afterImport = await opts.evaluate(async () => ({
  local: await chrome.storage.local.get(['favorites', 'dailyFavorites']),
  sync: await chrome.storage.sync.get(['hoverOnly', 'premium']),
}));
check('import replaces the favourites',
  (afterImport.local.favorites || []).map((f) => f.name).join(',') === 'Imported Item',
  JSON.stringify((afterImport.local.favorites || []).map((f) => f.name)));
check('import replaces the favourited dailies',
  (afterImport.local.dailyFavorites || []).map((d) => d.label).join(',') === 'Wishing Well');
check('import applies the settings', afterImport.sync.hoverOnly === false,
  JSON.stringify(afterImport.sync));

// A file from a newer build is refused rather than half-applied.
await typeIntoBox(JSON.stringify({ app: 'neo-snipe', version: 99, settings: { premium: false } }));
await page.waitForTimeout(200);
await pressImport();
await page.waitForTimeout(600);
const refusal = await inShadow((root) => ({
  message: root.querySelector('.ns-set-msg')?.textContent.trim(),
  bad: !!root.querySelector('.ns-set-msg--bad'),
  stillPremium: [...root.querySelectorAll('.ns-set-row')]
    .find((r) => r.querySelector('strong')?.textContent.includes('I have Neopets Premium'))
    ?.querySelector('input')?.checked,
}));
check('a newer export is refused, leaving settings untouched',
  refusal.bad && /newer version/i.test(refusal.message || '') && refusal.stillPremium === true,
  JSON.stringify(refusal.message));

// Turning Premium off hides the Super Shop Wizard.
await clickToggle('I have Neopets Premium');
await page.waitForTimeout(600);
check('turning Premium off hides the SSW tab',
  await inShadow((root) => {
    const tabs = [...root.querySelectorAll('.ns-tab')].map((t) => t.textContent.trim());
    return !tabs.includes('SSW');
  }));

// Premium-only dailies go too — a link to a page you cannot use is noise.
await inShadow((root) => root.querySelector('.ns-cog').click());
await page.waitForTimeout(300);
await inShadow((root) => {
  [...root.querySelectorAll('.ns-panel-tab')].find((t) => /dailies/i.test(t.textContent)).click();
});
await page.waitForTimeout(400);
const withoutPremium = await inShadow((root) => {
  const links = [...root.querySelectorAll('.ns-daily')];
  return { count: links.length, premiumLinks: links.filter((a) => /\/premium\//.test(a.href)).length };
});
check('premium-only dailies are hidden without Premium',
  withoutPremium.premiumLinks === 0 && withoutPremium.count > 90,
  JSON.stringify(withoutPremium));

// Turn it back on: the premium daily returns.
await inShadow((root) => root.querySelector('.ns-cog').click());
await page.waitForTimeout(300);
await clickToggle('I have Neopets Premium');
await page.waitForTimeout(400);
await inShadow((root) => root.querySelector('.ns-cog').click());
await page.waitForTimeout(300);
await inShadow((root) => {
  [...root.querySelectorAll('.ns-panel-tab')].find((t) => /dailies/i.test(t.textContent)).click();
});
await page.waitForTimeout(400);
const withPremium = await inShadow((root) => {
  const links = [...root.querySelectorAll('.ns-daily')];
  return {
    count: links.length,
    starlight: links.some((a) => a.href === 'https://www.neopets.com/premium/wheel.phtml'),
  };
});
check('turning Premium on brings the premium dailies back',
  withPremium.starlight && withPremium.count === withoutPremium.count + 1,
  JSON.stringify(withPremium));

// A premium daily favourited while Premium was on must not linger in the
// pinned group after it is turned off.
await inShadow((root) => {
  const row = [...root.querySelectorAll('.ns-daily-row')]
    .find((r) => r.querySelector('.ns-daily')?.href === 'https://www.neopets.com/premium/wheel.phtml');
  row.querySelector('.ns-daily-fav').click();
});
await page.waitForTimeout(400);
check('the premium daily can be favourited while Premium is on',
  await inShadow((root) => [...root.querySelectorAll('.ns-group--pinned .ns-daily')]
    .some((a) => a.href === 'https://www.neopets.com/premium/wheel.phtml')));

await inShadow((root) => root.querySelector('.ns-cog').click());
await page.waitForTimeout(300);
await clickToggle('I have Neopets Premium');   // Premium off
await page.waitForTimeout(300);
await inShadow((root) => root.querySelector('.ns-cog').click());
await page.waitForTimeout(400);
check('and disappears from the pinned group when Premium goes off',
  await inShadow((root) => ![...root.querySelectorAll('.ns-daily')]
    .some((a) => /\/premium\//.test(a.href))));

// Restore: Premium on, and unfavourite it again.
await inShadow((root) => root.querySelector('.ns-cog').click());
await page.waitForTimeout(300);
await clickToggle('I have Neopets Premium');
await page.waitForTimeout(300);
await inShadow((root) => root.querySelector('.ns-cog').click());
await page.waitForTimeout(400);
await inShadow((root) => {
  const row = [...root.querySelectorAll('.ns-group--pinned .ns-daily-row')]
    .find((r) => /\/premium\//.test(r.querySelector('.ns-daily')?.href || ''));
  row?.querySelector('.ns-daily-fav')?.click();
});
await page.waitForTimeout(300);

// Premium is back on and the panel is on its tabs already.

// --- the toolbar button ------------------------------------------------------
// It must do nothing away from Neopets. Rather than take the "tabs" permission
// to read every tab's URL, the button starts disabled and each content script
// enables it for its own tab — so tabs are identified here by who answers.
const elsewhere = await ctx.newPage();
await elsewhere.route('**/*', (r) => r.fulfill({ contentType: 'text/html', body: '<h1>not neopets</h1>' }));
await elsewhere.goto('https://example.com/');
await elsewhere.waitForTimeout(500);

const buttonState = await sw.evaluate(async () => {
  const out = [];
  for (const t of await chrome.tabs.query({})) {
    let hasContentScript = false;
    try { await chrome.tabs.sendMessage(t.id, { type: 'neosnipe:hello' }); hasContentScript = true; }
    catch { /* no content script here */ }
    out.push({ id: t.id, hasContentScript, enabled: await chrome.action.isEnabled(t.id) });
  }
  return out;
});
check('the toolbar button is enabled on Neopets',
  buttonState.some((t) => t.hasContentScript && t.enabled));
check('the toolbar button is disabled everywhere else',
  buttonState.filter((t) => !t.hasContentScript).every((t) => !t.enabled),
  JSON.stringify(buttonState.map((t) => `${t.hasContentScript ? 'neo' : 'other'}:${t.enabled}`)));
await elsewhere.close();

// Clicking it opens the panel under the button, at the top right.
await sw.evaluate(async (tabId) => {
  await chrome.tabs.sendMessage(tabId, { type: 'neosnipe:open-panel', from: 'toolbar' });
}, buttonState.find((t) => t.hasContentScript).id);
await page.waitForTimeout(1200);

const fromToolbar = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const el = root.querySelector('.ns-panel');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    anchored: [...el.classList].find((c) => c.startsWith('ns-panel--')),
    top: Math.round(r.top),
    fromRight: Math.round(innerWidth - r.right),
    onScreen: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0,
  };
});
check('the toolbar opens the panel under the button, top right',
  fromToolbar?.anchored === 'ns-panel--top' && fromToolbar.top < 40
  && fromToolbar.fromRight < 40 && fromToolbar.onScreen, JSON.stringify(fromToolbar));

// The in-page bar still opens it above itself.
await page.locator('.neosnipe-launcher-main').click();
await page.waitForTimeout(600);
check('the in-page bar still anchors the panel above itself',
  await page.evaluate(() => {
    const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
    return root.querySelector('.ns-panel')?.classList.contains('ns-panel--bottom');
  }));

check('the launcher shows the app icon', await page.evaluate(() => {
  const icon = document.querySelector('.neosnipe-launcher-icon');
  return !!icon && getComputedStyle(icon).backgroundImage.startsWith('url("data:image/svg+xml');
}));

// --- the Shop Wizard / Super Shop Wizard search panels ----------------------
const panelState = () => inShadow((root) => ({
  open: !!root.querySelector('.ns-panel'),
  panels: root.querySelectorAll('.ns-panel').length,
  title: root.querySelector('.ns-panel-title')?.textContent.trim(),
  hasSearch: !!root.querySelector('.ns-wiz-input'),
  hasTabs: !!root.querySelector('.ns-panel-tabs'),
  items: [...root.querySelectorAll('.ns-wiz-item')].map((b) => ({
    name: b.querySelector('.ns-wiz-item-name')?.textContent.trim(),
    thumb: b.querySelector('.ns-wiz-thumb')?.getAttribute('src') || null,
  })),
  rows: [...root.querySelectorAll('.ns-wiz-rows:not(.ns-wiz-other) tbody tr')].map((tr) => ({
    owner: tr.querySelector('.ns-shop-owner')?.textContent.trim(),
    price: tr.querySelectorAll('td')[1]?.textContent.trim(),
  })),
  otherHead: root.querySelector('.ns-wiz-other-head')?.textContent.replace(/\s+/g, ' ').trim() || null,
  otherRows: root.querySelectorAll('.ns-wiz-other tbody tr').length,
  sorts: [...root.querySelectorAll('.ns-wiz-sort')].map((b) => b.textContent.trim()),
  activeSort: root.querySelector('.ns-wiz-sort--on')?.textContent.trim(),
  freshness: root.querySelector('.ns-wiz-again')?.textContent.trim(),
}));

// Both buttons carry Neopets' own artwork, at the same size as the rest.
const barButtons = await page.evaluate(() => {
  const bar = document.querySelector('.neosnipe-launcher');
const box = (el) => {
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };
  const glyph = (sel) => {
    const el = bar.querySelector(sel + ' .neosnipe-launcher-glyph');
    if (!el) return null;
    return { image: getComputedStyle(el).backgroundImage, ...box(el) };
  };
  const appIcon = box(bar.querySelector('.neosnipe-launcher-icon'));
  return {
    order: [...bar.children].map((c) => c.className.replace('neosnipe-launcher-', '')),
    sw: glyph('.neosnipe-launcher-sw'),
    ssw: glyph('.neosnipe-launcher-ssw'),
    appSize: appIcon,
    sswShown: getComputedStyle(bar.querySelector('.neosnipe-launcher-ssw')).display !== 'none',
  };
});
check('the bar carries the grip and the wizard buttons, in order',
  barButtons.order.join(',') === 'grip,main,sw,ssw,inv', JSON.stringify(barButtons.order));
// Carried in the bundle, not fetched: hot-linked artwork would leave the
// buttons blank the day Neopets moves those paths.
check('the Shop Wizard button carries its icon inline',
  barButtons.sw?.image.startsWith('url("data:image/png;base64,'),
  (barButtons.sw?.image || '').slice(0, 40));
check('the SSW button carries its icon inline',
  barButtons.ssw?.image.startsWith('url("data:image/png;base64,'),
  (barButtons.ssw?.image || '').slice(0, 40));
check('neither is fetched from images.neopets.com',
  !/images.neopets.com/.test(barButtons.sw.image + barButtons.ssw.image));
// Measured, not declared: a glyph left inline reports its declared 20px while
// painting into a zero-height box, which is exactly how these first shipped.
check('both wizard icons are actually drawn, at the app icon size',
  barButtons.sw.w === barButtons.appSize.w && barButtons.sw.h === barButtons.appSize.h
  && barButtons.ssw.w === barButtons.appSize.w && barButtons.ssw.h === barButtons.appSize.h
  && barButtons.appSize.h > 0,
  JSON.stringify({ sw: barButtons.sw, ssw: barButtons.ssw, app: barButtons.appSize }));
check('the SSW button is shown while Premium is on', barButtons.sswShown === true);

// Opening one shows a search panel rather than the favourites tabs.
const closePanel = async () => {
  await page.evaluate(() => {
    const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
    root.querySelector('.ns-panel-head .ns-close')?.click();
  });
  await page.waitForTimeout(300);
};

await closePanel();
await page.locator('.neosnipe-launcher-sw').click();
await page.waitForTimeout(600);

const wizPanel = await panelState();
check('the Shop Wizard button opens its own panel',
  wizPanel.open && wizPanel.title === 'Shop Wizard' && wizPanel.hasSearch,
  JSON.stringify({ title: wizPanel.title, search: wizPanel.hasSearch }));
check('the search panel replaces the favourites tabs', wizPanel.hasTabs === false);

// The page's items wait behind the search box rather than filling the panel.
check('page items are not listed until the search box is clicked',
  wizPanel.items.length === 0, JSON.stringify(wizPanel.items.slice(0, 2)));

const searchButton = await inShadow((root) => {
  const go = root.querySelector('.ns-wiz-go');
  const field = root.querySelector('.ns-wiz-input .v-field');
  const g = go?.getBoundingClientRect();
  const f = field?.getBoundingClientRect();
  return {
    outerAppend: !!go?.closest('.ns-wiz-input .v-input__append'),
    insideField: !!go?.closest('.v-field'),
    // Level with the field, to its right.
    beside: !!(g && f) && g.left >= f.right && Math.abs((g.top + g.bottom) / 2 - (f.top + f.bottom) / 2) <= 2,
  };
});
check('the search button sits in the outer append, beside the box',
  searchButton.outerAppend && !searchButton.insideField && searchButton.beside,
  JSON.stringify(searchButton));

const openSuggestions = async () => {
  await page.locator('.ns-wiz-input input').click();
  await page.waitForTimeout(500);
  return panelState();
};

const withMenu = await openSuggestions();
check('clicking the search box lists the items detected on the page',
  withMenu.items.length > 0 && withMenu.items.some((i) => i.name === 'Water Mote'),
  JSON.stringify(withMenu.items.slice(0, 3)));
check('each suggestion shows its art inline',
  withMenu.items.every((i) => i.thumb && i.thumb.includes('images.neopets.com')),
  JSON.stringify(withMenu.items[0]));
// A menu teleported to document.body would land unstyled among Neopets' CSS.
check('the suggestion list stays inside the extension shadow root',
  await page.evaluate(() => !document.querySelector('.ns-wiz-menu'))
  && await inShadow((root) => !!root.querySelector('.ns-wiz-menu')));

const firstItem = withMenu.items[0].name;

// Picking one searches it, without the name being typed.
await page.locator('.ns-wiz-item').first().click();
await page.waitForTimeout(1500);
const searched = await panelState();
check('clicking an item runs a search and lists the shops',
  searched.rows.length > 0, JSON.stringify(searched.rows.slice(0, 2)));
check('the results offer the four sorts',
  searched.sorts.length === 4, JSON.stringify(searched.sorts));
check('price ascending is the default sort', searched.activeSort === searched.sorts[0],
  searched.activeSort);

const prices = (rows) => rows.map((r) => Number(String(r.price).replace(/[^0-9]/g, '')));
const rowOwners = (rows) => rows.map((r) => r.owner);
check('rows arrive cheapest first',
  prices(searched.rows).every((n, i, a) => i === 0 || a[i - 1] <= n),
  JSON.stringify(prices(searched.rows)));
check('the cheapest shop is picked out',
  await inShadow((root) => !!root.querySelector('.ns-wiz-rows:not(.ns-wiz-other) tbody tr')
    ?.classList.contains('ns-wiz-best')));

// The layout is budgeted to the panel's fixed body: one scrolling table, not a
// scrolling table inside a scrolling panel.
const scrollers = await inShadow((root) => {
  const body = root.querySelector('.ns-panel-body');
  const sorts = root.querySelector('.ns-wiz-sorts');
  return {
    bodyScrolls: body.scrollHeight > body.clientHeight + 1,
    sortsHeight: Math.round(sorts.getBoundingClientRect().height),
    // A visible scrollbar is what went wrong, so that is what is checked. A raw
    // scrollWidth comparison cannot tell: Vuetify's focus ring overhangs every
    // button by a few pixels, so it reads as overflow when nothing is wrong.
    sortsScrollbar: getComputedStyle(sorts).overflowX !== 'hidden' && sorts.scrollWidth > sorts.clientWidth,
    labelsClipped: [...sorts.querySelectorAll('.v-btn__content')]
      .some((c) => c.scrollWidth > c.clientWidth + 1),
  };
});
check('a result fits the panel without a second scrollbar',
  scrollers.bodyScrolls === false, JSON.stringify(scrollers));
check('the sort buttons are drawn whole: full height, no scrollbar, no clipped labels',
  scrollers.sortsHeight >= 24 && !scrollers.sortsScrollbar && !scrollers.labelsClipped,
  JSON.stringify(scrollers));

const sortBy = async (index) => {
  await page.evaluate((i) => {
    const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
    root.querySelectorAll('.ns-wiz-sort')[i]?.click();
  }, index);
  await page.waitForTimeout(300);
  return (await panelState()).rows;
};

const desc = await sortBy(1);
check('sorting by price descending reverses them',
  prices(desc).every((n, i, a) => i === 0 || a[i - 1] >= n), JSON.stringify(prices(desc)));

const az = await sortBy(2);
check('sorting A-Z orders by shop owner',
  rowOwners(az).every((o, i, a) => i === 0 || a[i - 1].localeCompare(o) <= 0), JSON.stringify(rowOwners(az)));

const za = await sortBy(3);
check('sorting Z-A reverses that',
  rowOwners(za).join(',') === [...rowOwners(az)].reverse().join(','), JSON.stringify(rowOwners(za)));

await sortBy(0);

// The two panels are independent, and only ever one is open.
await page.locator('.neosnipe-launcher-ssw').click();
await page.waitForTimeout(600);
const sswPanel = await panelState();
check('the SSW button swaps to its own panel, not a second one',
  sswPanel.title === 'Super Shop Wizard' && sswPanel.hasSearch && sswPanel.panels === 1,
  JSON.stringify({ title: sswPanel.title, panels: sswPanel.panels }));
check('the SSW panel does not inherit the other panel results',
  sswPanel.rows.length === 0, JSON.stringify(sswPanel.rows));

// Searching the same item here must also surface what the Shop Wizard found.
await openSuggestions();
await page.locator('.ns-wiz-item').first().click();
await page.waitForTimeout(1500);
const sswSearched = await panelState();
check('the SSW panel searches its own wizard',
  sswSearched.rows.length > 0, JSON.stringify(sswSearched.rows.slice(0, 2)));
check('it also offers what the Shop Wizard already cached for that item',
  /Already found by the Shop Wizard/.test(sswSearched.otherHead || ''),
  JSON.stringify({ head: sswSearched.otherHead }));
// Folded, so the second opinion never pushes this panel's own result away.
check('that second opinion starts folded to one line',
  sswSearched.otherRows === 0, String(sswSearched.otherRows));

const unfoldOther = async () => {
  await page.locator('.ns-wiz-other-head').click();
  await page.waitForTimeout(300);
  return panelState();
};
check('unfolding it lists the Shop Wizard shops', (await unfoldOther()).otherRows > 0);

// And the same in reverse, from the wizard panel.
await page.locator('.neosnipe-launcher-sw').click();
await page.waitForTimeout(600);
const backToWiz = await panelState();
check('switching back keeps each panel own search',
  backToWiz.title === 'Shop Wizard' && backToWiz.rows.length > 0,
  JSON.stringify({ title: backToWiz.title, rows: backToWiz.rows.length }));
check('the wizard panel offers the SSW cache for the same item',
  /Already found by the Super Shop Wizard/.test(backToWiz.otherHead || ''),
  JSON.stringify({ head: backToWiz.otherHead }));
check('and unfolds to list those shops', (await unfoldOther()).otherRows > 0);

// Switching panels shows what each already held; searching the same name
// again is what exercises the cache, and it must say that is what happened.
await page.locator('.ns-wiz-input input').fill(firstItem);
await page.locator('.ns-wiz-input input').press('Enter');
await page.waitForTimeout(900);
const repeated = await panelState();
check('searching the same name again with Enter is served from the cache and says so',
  /cached/.test(repeated.freshness || ''), repeated.freshness);
check('the cached view still lists every shop',
  repeated.rows.length === backToWiz.rows.length,
  repeated.rows.length + ' vs ' + backToWiz.rows.length);

// The x inside the box clears the text and the result with it.
const clearButton = await inShadow((root) => ({
  inField: !!root.querySelector('.ns-wiz-input .v-field .v-field__clearable'),
}));
check('a clear button sits inside the box while it has text', clearButton.inField === true,
  JSON.stringify(clearButton));

await page.locator('.ns-wiz-input .v-field__clearable .v-icon').click();
await page.waitForTimeout(400);
const cleared = await inShadow((root) => ({
  query: root.querySelector('.ns-wiz-input input')?.value,
  rows: root.querySelectorAll('.ns-wiz-rows tbody tr').length,
  idle: !!root.querySelector('.ns-wiz-empty'),
  menuOpen: !!root.querySelector('.ns-wiz-menu .ns-wiz-item'),
}));
check('clearing empties the box, drops the result and returns to the start',
  cleared.query === '' && cleared.rows === 0 && cleared.idle && !cleared.menuOpen,
  JSON.stringify(cleared));

// The outer button searches whatever is typed — and the cache survived the clear.
await page.locator('.ns-wiz-input input').fill(firstItem);
await page.locator('.ns-wiz-go').click();
await page.waitForTimeout(900);
const viaButton = await panelState();
check('the search button beside the box runs the search',
  viaButton.rows.length > 0, String(viaButton.rows.length));
check('clearing kept the cache, so that search was instant',
  /cached/.test(viaButton.freshness || ''), viaButton.freshness);
check('searching leaves the suggestion list shut',
  await inShadow((root) => !root.querySelector('.ns-wiz-menu .ns-wiz-item')));

// Clicking the same button again closes the panel.
await page.locator('.neosnipe-launcher-sw').click();
await page.waitForTimeout(400);
check('the same wizard button again closes the panel',
  (await panelState()).open === false);

// --- dragging the bar by its handle ----------------------------------------
const barBox = () => page.evaluate(() => {
  const r = document.querySelector('.neosnipe-launcher').getBoundingClientRect();
  return { x: Math.round(r.left), y: Math.round(r.top) };
});
const gripState = () => page.evaluate(() => {
  const g = document.querySelector('.neosnipe-launcher-grip');
  const r = g.getBoundingClientRect();
  // Left of every button, which is the claim — not flush with the bar's own
  // border box, which its padding puts a few pixels further out.
  const others = [...document.querySelectorAll('.neosnipe-launcher > :not(.neosnipe-launcher-grip)')]
    .map((el) => el.getBoundingClientRect().left);
  return {
    shown: getComputedStyle(g).display !== 'none',
    hasIcon: !!g.querySelector('svg path[d]'),
    leftOfButtons: others.length > 0 && Math.round(r.right) <= Math.round(Math.min(...others)) + 1,
    cursor: getComputedStyle(g).cursor,
  };
});

const grip0 = await gripState();
check('the bar has a drag handle left of every button, with a grab cursor',
  grip0.shown && grip0.hasIcon && grip0.leftOfButtons && grip0.cursor === 'grab',
  JSON.stringify(grip0));

const barBefore = await barBox();
const gripBox = await page.locator('.neosnipe-launcher-grip').boundingBox();
await page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
await page.mouse.down();
await page.mouse.move(gripBox.x + gripBox.width / 2 - 180, gripBox.y + gripBox.height / 2 - 120, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(400);

const barAfter = await barBox();
check('dragging the handle moves the whole bar by that much',
  Math.abs((barAfter.x - barBefore.x) + 180) <= 3 && Math.abs((barAfter.y - barBefore.y) + 120) <= 3,
  JSON.stringify({ dx: barAfter.x - barBefore.x, dy: barAfter.y - barBefore.y }));

// The drag must not have opened anything on the way past.
check('dragging the bar opens no panel',
  await page.locator('.neosnipe-launcher[data-open="1"]').count() === 0);

// Buttons still work after a drag, since the capture was on the grip.
await page.locator('.neosnipe-launcher-main').click();
await page.waitForTimeout(500);
check('the buttons still work once the bar has been moved',
  await page.locator('.neosnipe-launcher[data-open="1"]').count() === 1);
await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  root.querySelector('.ns-panel-head .ns-close')?.click();
});
await page.waitForTimeout(300);

// Turning dragging off takes the handle away rather than leaving it inert.
await opts.evaluate(() => chrome.storage.sync.set({ movableLauncher: false }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });
check('with dragging off the handle is gone',
  (await gripState()).shown === false);

await opts.evaluate(() => chrome.storage.sync.set({ movableLauncher: true }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });
check('and comes back with it on', (await gripState()).shown === true);

// The reloads above left the page with no UI mounted, and the host only comes
// into being on first use; the sections below expect it there.
await page.locator('.neosnipe-launcher-main').click();
await page.waitForSelector('[data-neosnipe="popover-host"]', { timeout: 10000 });
await page.waitForTimeout(400);
await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  root.querySelector('.ns-panel-head .ns-close')?.click();
});
await page.waitForTimeout(300);

// --- the inventory button on the launcher bar ------------------------------
const invLink = await page.evaluate(() => {
  const a = document.querySelector('.neosnipe-launcher-inv');
  const bar = document.querySelector('.neosnipe-launcher');
  const main = document.querySelector('.neosnipe-launcher-main');
  if (!a) return null;
  return {
    href: a.getAttribute('href'),
    tag: a.tagName,
    title: a.title,
    hasIcon: !!a.querySelector('svg path[d]'),
    insideBar: bar.contains(a) && bar.contains(main),
    // Both sit on one row, the inventory link to the right of the main button.
    rightOfMain: a.getBoundingClientRect().left >= main.getBoundingClientRect().right - 1,
  };
});
check('the launcher carries an inventory link beside the main button',
  invLink?.insideBar === true && invLink.rightOfMain === true, JSON.stringify(invLink));
check('it points at the inventory and is a real link',
  invLink?.href === 'https://www.neopets.com/inventory.phtml' && invLink.tag === 'A',
  JSON.stringify(invLink));
check('it shows an icon', invLink?.hasIcon === true);

// Clicking it must not also open the panel. The navigation itself is left to
// the href checked above — letting it actually happen here would reset the
// page state the rest of the run builds on.
await page.evaluate(() => {
  // The host only exists once the UI has been used; a reload leaves none.
  const root = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
  root?.querySelector('.ns-panel-head .ns-close')?.click();
  // Lift the href for the click: the destination is asserted above, and
  // actually going there would reset the page the rest of the run builds on.
  document.querySelector('.neosnipe-launcher-inv').removeAttribute('href');
});
await page.waitForTimeout(300);
await page.locator('.neosnipe-launcher-inv').click();
await page.waitForTimeout(400);
// The fixture itself is served at /inventory.phtml, so the URL says nothing
// here; the href asserted above is what proves the destination.
check('clicking the inventory link does not open the panel',
  await page.locator('.neosnipe-launcher[data-open="1"]').count() === 0);
await page.evaluate((url) => {
  document.querySelector('.neosnipe-launcher-inv').setAttribute('href', url);
}, 'https://www.neopets.com/inventory.phtml');

// --- the NP counter points at the inventory too ----------------------------
const npBefore = await page.evaluate(() => {
  const el = document.getElementById('npanchor');
  return { exists: !!el, href: el?.getAttribute('href') };
});
check('the page has an NP counter to rewrite', npBefore.exists === true, JSON.stringify(npBefore));
check('the NP counter is repointed at the inventory',
  npBefore.href === 'https://www.neopets.com/inventory.phtml', JSON.stringify(npBefore));

// It has to survive the header being re-rendered, as some pages do.
await page.evaluate(() => {
  document.querySelector('.nav').innerHTML = '<a id="npanchor" href="/bank.phtml">7 NP</a>';
});
await page.waitForTimeout(500);
const npAfter = await page.evaluate(() => document.getElementById('npanchor')?.getAttribute('href'));
check('a re-rendered NP counter is repointed again',
  npAfter === 'https://www.neopets.com/inventory.phtml', String(npAfter));

// It stays an ordinary link, so ctrl-click and middle-click still open a tab.
check('the NP counter is still a plain link, not a click handler',
  await page.evaluate(() => document.getElementById('npanchor').tagName) === 'A');

await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  root.querySelector('.ns-panel-head .ns-close')?.click();
});
await page.waitForTimeout(300);

// --- hover-only badges -------------------------------------------------------
// Set it here rather than inheriting it: the import section above turns
// hoverOnly off in storage, and this used to pass only because the body
// attribute from the original page load was still sitting there.
await opts.evaluate(() => chrome.storage.sync.set({ hoverOnly: true }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });
// Park the mouse away from the badges first, or the one we just clicked is
// still in :hover and reads as fully opaque.
await page.mouse.move(0, 0);
await page.waitForTimeout(300); // let the opacity transition finish
const hover = await page.evaluate(() => {
  const idle = [...document.querySelectorAll('.neosnipe-badge')].find((b) => !b.dataset.state);
  return {
    enabled: document.body.hasAttribute('data-neosnipe-hover-only'),
    hidden: getComputedStyle(idle).opacity === '0',
  };
});
check('hover-only mode hides idle badges', hover.enabled && hover.hidden, JSON.stringify(hover));

// --- clicking a badge must not trigger the page's own item link --------------
const before = page.url();
await page.locator('.ah2_listing_item_image .neosnipe-badge').first().click();
await page.waitForTimeout(400);
check('badge click does not follow the item link', page.url() === before, page.url());

// --- the popover opens on whichever tab is first in the order ---------------
// Default order opens Price (checked above). Drag TP to the front and the next
// badge click must open on TP, and must have fetched it — not sat empty.
await opts.evaluate(() => chrome.storage.sync.set({ popoverTabOrder: ['tp', 'price', 'wiz', 'shops'] }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });
await page.locator('.neosnipe-badge').first().click();

const reordered = await page.evaluate(async () => {
  for (let i = 0; i < 60; i++) {
    const sr = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
    const tabs = [...(sr?.querySelectorAll('.ns-tab') || [])];
    const selected = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    const win = sr?.querySelector('.ns-tab-window');
    // Wait for the lot table, which only exists once the TP fetch has landed.
    if (selected && win?.querySelector('.ns-rows tbody tr')) {
      return {
        first: tabs[0]?.textContent.trim(),
        selected: selected.textContent.trim(),
        stats: !!win.querySelector('.ns-tp-stats'),
        rows: win.querySelectorAll('.ns-rows tbody tr').length,
      };
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return { timedOut: true };
});

check('the reordered tab leads the strip', reordered.first === 'TP', JSON.stringify(reordered));
check('the popover opens on the first tab, not price', reordered.selected === 'TP',
  JSON.stringify(reordered));
check('that tab is fetched on open rather than left empty',
  reordered.stats === true && reordered.rows > 0, JSON.stringify(reordered));

// Put the shipped order back before the error-path checks reuse the popover.
await opts.evaluate(() => chrome.storage.sync.set({ popoverTabOrder: ['price', 'tp', 'wiz', 'shops'] }));

// --- remembering the last tab ----------------------------------------------
// Off by default: every item opens on the first tab whatever you last looked at.
const popoverState = () => inShadow((root) => {
  const card = root.querySelector('.ns-popover');
  const tab = [...root.querySelectorAll('.ns-tab')].find((t) => t.getAttribute('aria-selected') === 'true');
  const r = card?.getBoundingClientRect();
  return card
    ? { tab: tab?.textContent.trim(), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }
    : null;
});

// Waits for the lookup to land, so the card is at its full height.
const openBadge = async (nth) => {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.locator('.neosnipe-badge').nth(nth).click();
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
    return !!root?.querySelector('.ns-tab');
  }, null, { timeout: 15000 });
  await page.waitForTimeout(350);
  return popoverState();
};

await opts.evaluate(() => chrome.storage.sync.set({ rememberPopoverTab: false }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });

await openBadge(0);
await page.locator('.ns-tab', { hasText: 'TP' }).first().click();
await page.waitForTimeout(400);
check('selecting a tab switches to it', (await popoverState()).tab === 'TP');

const forgotten = await openBadge(1);
check('without the setting, the next item opens on the first tab again',
  forgotten.tab === 'Price', JSON.stringify(forgotten));

await opts.evaluate(() => chrome.storage.sync.set({ rememberPopoverTab: true }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });

await openBadge(0);
await page.locator('.ns-tab', { hasText: 'TP' }).first().click();
await page.waitForTimeout(400);
const remembered = await openBadge(1);
check('with the setting on, the next item reopens on that tab',
  remembered.tab === 'TP', JSON.stringify(remembered));

// A remembered tab that no longer exists must not strand the popover on it.
await opts.evaluate(() => chrome.storage.local.set({ lastPopoverTab: 'shops' }));
await opts.evaluate(() => chrome.storage.sync.set({ premiumAuto: false, premium: false }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });
const hidden = await openBadge(0);
check('a remembered tab that is now hidden falls back to the first',
  hidden.tab === 'Price', JSON.stringify(hidden));

await opts.evaluate(() => chrome.storage.sync.set({ premium: true, rememberPopoverTab: false }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });

// --- the Shop Wizard cache window -------------------------------------------
// The cache only comes into it across opens: within one open, `state.wiz.data`
// already short-circuits the search, which is what the earlier tab-switching
// checks cover. Every badge here resolves to the same item, so a second open is
// the same cache key.
const clickTab = async (label) => {
  await page.evaluate((l) => {
    const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
    [...root.querySelectorAll('.ns-tab')].find((t) => t.textContent.trim() === l)?.click();
  }, label);
  await page.waitForTimeout(900);
};

const searchesFor = async (minutes) => {
  await opts.evaluate((m) => chrome.storage.sync.set({ wizCacheMinutes: m }), minutes);
  await page.reload();
  await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });

  await openBadge(0);
  await clickTab('SW');
  const first = wizardSearches;

  await openBadge(1);
  await clickTab('SW');
  return { spentOnFirst: first, spentOnSecond: wizardSearches - first };
};

const kept = await searchesFor(15);
check('a second open of the same item reuses the cached wizard result',
  kept.spentOnFirst > 0 && kept.spentOnSecond === 0, JSON.stringify(kept));

const expired = await searchesFor(0);
check('a zero-minute cache searches again on the next open',
  expired.spentOnSecond === 1, JSON.stringify(expired));

await opts.evaluate(() => chrome.storage.sync.set({ wizCacheMinutes: 15 }));
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });

// --- dragging the popover ---------------------------------------------------
const beforeDrag = await openBadge(0);
const grip = await page.locator('.ns-grip').first().boundingBox();
check('the popover has a drag handle', !!grip, JSON.stringify(grip));

await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
await page.mouse.down();
await page.mouse.move(grip.x + grip.width / 2 + 120, grip.y + grip.height / 2 - 60, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(300);

const afterDrag = await popoverState();
const moved = { dx: afterDrag.x - beforeDrag.x, dy: afterDrag.y - beforeDrag.y };
check('dragging the handle moves the popover by exactly that much',
  Math.abs(moved.dx - 120) <= 3 && Math.abs(moved.dy + 60) <= 3, JSON.stringify(moved));

// Dragging is per-item: the next badge re-anchors rather than inheriting it.
const reopened = await openBadge(1);
check('the next item re-anchors to its own badge',
  reopened.x !== afterDrag.x || reopened.y !== afterDrag.y,
  JSON.stringify({ afterDrag, reopened }));

// It must not be draggable off-screen either.
const grip2 = await page.locator('.ns-grip').first().boundingBox();
await page.mouse.move(grip2.x + grip2.width / 2, grip2.y + grip2.height / 2);
await page.mouse.down();
await page.mouse.move(-600, -600, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(300);
const dragged = await popoverState();
const room = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
check('a popover cannot be dragged out of the window',
  dragged.x >= 0 && dragged.y >= 0
  && dragged.x + dragged.w <= room.w && dragged.y + dragged.h <= room.h,
  JSON.stringify({ dragged, room }));

// --- a popover near the foot of a window too short to hold it ---------------
// The bug this guards: the card opens while it is still a spinner, fits below
// the badge, then grows past the bottom of the window once the price and the
// tabs render. In a window with no room either side of the badge there is
// nowhere for Vuetify to flip it to, so the overflow is ours to contain — and
// the host is fixed, so no amount of page scrolling would reach it.
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
await page.setViewportSize({ width: 1280, height: 420 });
await page.waitForTimeout(300);
await page.evaluate(() => {
  const box = document.createElement('div');
  box.id = 'ns-bottom-item';
  box.style.cssText = 'position:fixed;left:20px;bottom:4px;z-index:10';
  box.innerHTML = '<div class="grid-item"><div class="lazy item-img"'
    + ' style="width:80px;height:80px;display:inline-block"'
    + ' data-src="https://images.neopets.com/items/food_apple.gif"'
    + ' data-itemname="Green Apple" alt="A crunchy green apple."></div></div>';
  document.body.appendChild(box);
});
await page.waitForSelector('#ns-bottom-item .neosnipe-badge', { timeout: 10000 });
await page.locator('#ns-bottom-item .neosnipe-badge').click();
await page.waitForFunction(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
  return !!root?.querySelector('.ns-tab');
}, null, { timeout: 15000 });
await page.waitForTimeout(500);

const atFoot = await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const r = root.querySelector('.ns-popover').getBoundingClientRect();
  const host = document.querySelector('[data-neosnipe="popover-host"]');
  return {
    top: Math.round(r.top),
    bottom: Math.round(r.bottom),
    viewport: window.innerHeight,
    // The host is fixed, so it never scrolls with the page: anything past the
    // bottom of the window is unreachable no matter how long the page is.
    hostFixed: getComputedStyle(host).position === 'fixed',
  };
});
check('the popover host is fixed, so overflow cannot be scrolled to',
  atFoot.hostFixed === true, JSON.stringify(atFoot));
check('a popover opened at the foot of the page stays inside the window',
  atFoot.top >= 0 && atFoot.bottom <= atFoot.viewport + 1, JSON.stringify(atFoot));

check('and scrolls its own overflow rather than spilling',
  atFoot.bottom - atFoot.top <= atFoot.viewport, JSON.stringify(atFoot));

// The window shrinking under an open popover is the same problem arriving by
// another route, and the one case where the card is provably left overflowing
// unless something pulls it back.
await page.setViewportSize({ width: 1280, height: 900 });
await page.waitForTimeout(400);
await page.evaluate(() => document.getElementById('ns-bottom-item')?.remove());
await page.keyboard.press('Escape');
await page.waitForTimeout(250);

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(250);
const lowBadge = await page.evaluate(() => {
  const list = [...document.querySelectorAll('.neosnipe-badge')]
    .map((b, i) => ({ i, top: b.getBoundingClientRect().top }))
    .filter((b) => b.top > 0 && b.top < window.innerHeight);
  return list.sort((a, b) => b.top - a.top)[0]?.i ?? 0;
});
await page.locator('.neosnipe-badge').nth(lowBadge).click();
await page.waitForFunction(() => {
  const r = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
  return !!r?.querySelector('.ns-tab');
}, null, { timeout: 15000 });
await page.waitForTimeout(600);

const cardBox = () => page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const r = root.querySelector('.ns-popover').getBoundingClientRect();
  return {
    top: Math.round(r.top), bottom: Math.round(r.bottom),
    left: Math.round(r.left), right: Math.round(r.right),
    vh: window.innerHeight, vw: window.innerWidth,
  };
});

const beforeShrink = await cardBox();
check('the popover opens on screen to begin with',
  beforeShrink.top >= 0 && beforeShrink.bottom <= beforeShrink.vh, JSON.stringify(beforeShrink));

// Short enough that where it was opened is now past the bottom edge.
await page.setViewportSize({ width: 1280, height: 420 });
await page.waitForTimeout(700);
const afterShrink = await cardBox();
check('a popover left off screen by a shrinking window is pulled back',
  afterShrink.top >= 0 && afterShrink.bottom <= afterShrink.vh + 1
  && afterShrink.left >= 0 && afterShrink.right <= afterShrink.vw + 1,
  JSON.stringify(afterShrink));

await page.setViewportSize({ width: 1280, height: 720 });
await page.waitForTimeout(300);
await page.keyboard.press('Escape');
await page.waitForTimeout(250);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(250);

await page.waitForTimeout(50);

// --- error path: Jelly Neo unreachable -------------------------------------
jellyNeoOffline = true;
await opts.evaluate(() => chrome.storage.local.clear()); // drop cached prices
await page.reload();
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });
await page.locator('.neosnipe-badge').nth(1).click();

const errText = await page.evaluate(async () => {
  for (let i = 0; i < 60; i++) {
    // Re-query each pass: the host is recreated after the reload.
    const host = document.querySelector('[data-neosnipe="popover-host"]');
    const t = host?.shadowRoot?.textContent || '';
    if (/could not reach|jelly neo/i.test(t)) return t;
    await new Promise((r) => setTimeout(r, 250));
  }
  const host = document.querySelector('[data-neosnipe="popover-host"]');
  return `UNMATCHED: ${(host?.shadowRoot?.textContent || '(no host)').replace(/\s+/g, ' ').slice(0, 120)}`;
});
check('unreachable Jelly Neo shows a useful message', /could not reach/i.test(errText),
  errText.replace(/\s+/g, ' ').slice(0, 70));
check('badge shows the error state',
  await page.locator('.neosnipe-badge[data-state="error"]').count() >= 1);
check('a Retry action is offered', /retry/i.test(errText));

await ctx.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
