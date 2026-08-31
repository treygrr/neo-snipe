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

// --- content script on a neopets.com page -----------------------------------
const page = await ctx.newPage();
page.on('console', (m) => console.log(`    [page:${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => console.log(`    [page:error] ${e.message}`));
page.on('requestfailed', (r) => console.log(`    [reqfail] ${r.url().slice(0, 130)} ${r.failure()?.errorText}`));
page.on('response', (r) => { if (r.status() >= 400) console.log(`    [resp ${r.status()}] ${r.url().slice(0, 130)}`); });
await installNeopetsRoutes(page);

await page.goto('https://www.neopets.com/inventory.phtml');
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });
await page.waitForTimeout(900); // let the delayed inventory chunk load + be scanned

const badges = page.locator('.neosnipe-badge');
check('badges injected across all five item surfaces',
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
check('both history tabs are present', tabLabels.length === 2, JSON.stringify(tabLabels));

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

const tabBox = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const r = sr.querySelector('.ns-tab').getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await page.mouse.move(tabBox.x, tabBox.y);
await page.waitForTimeout(400);
const hoverOverlay = await page.evaluate(() => {
  const sr = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  const ov = sr.querySelector('.ns-tab .v-btn__overlay');
  return ov ? Number(getComputedStyle(ov).opacity) : null;
});
check('hover overlay is subtle, not a solid black wash',
  hoverOverlay !== null && hoverOverlay > 0 && hoverOverlay < 0.5, `opacity ${hoverOverlay}`);
await page.mouse.move(0, 0);

// --- the bottom-right bar, favourites and dailies ---------------------------
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
await page.locator('.neosnipe-launcher').click();
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
check('every daily link points at neopets.com', dailies.allNeopets);
check('food club and bargain stocks are there',
  dailies.hasFoodClub && dailies.hasBargainStocks);
check('all the wheels are there', dailies.wheels >= 7, `${dailies.wheels} wheels`);

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
  root.querySelector('.ns-panel-head .v-btn').click();
});
await page.waitForTimeout(300);
check('closing the panel un-highlights the launcher',
  await page.locator('.neosnipe-launcher[data-open="1"]').count() === 0);

// --- Food Club: read the round, pick a risk level, fill a bet ---------------
// The favourite's popover is still open over the launcher; dismiss it the way
// a person would before reaching for the bar again.
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

await page.locator('.neosnipe-launcher').click();
await page.waitForTimeout(300);
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

// Fill: stores the bet, navigates to the bet page, fills the real form.
await inShadow((root) => root.querySelector('.ns-bet .v-btn').click());
await page.waitForURL(/foodclub\.phtml/, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2500);

const filled = await page.evaluate(() => {
  const form = document.querySelector('form[name="bet_form"]');
  if (!form) return { noForm: true };
  return {
    url: location.href,
    selects: [1, 2, 3, 4, 5].map((n) => form.querySelector(`select[name="winner${n}"]`).value),
    checked: [...form.querySelectorAll('input[name="matches[]"]')].map((c) => c.checked),
    amount: form.querySelector('input[name="bet_amount"]').value,
    calcRan: (window.calls || []).some(([f]) => f === 'calc_odds'),
    notice: !!document.querySelector('[data-neosnipe="fc-notice"]'),
  };
});
check('Fill sends you to the bet page and fills the form',
  /foodclub\.phtml/.test(filled.url || '') && filled.checked?.some(Boolean)
  && filled.selects?.some((v) => v !== ''), JSON.stringify(filled?.selects));
check('the filled amount matches the stake', filled.amount === '10540', filled.amount);
check("the page's own odds calculation was triggered", filled.calcRan === true);
check('it tells you to press Place Bet yourself', filled.notice === true);

// Nothing was submitted: still on the bet form, not the processor.
check('the bet was not submitted', !/process_foodclub/.test(filled.url || ''), filled.url);

const cleared = await opts.evaluate(() => chrome.storage.local.get('pendingBet'));
check('the pending bet is cleared after filling', cleared.pendingBet === undefined);

await page.goto('https://www.neopets.com/inventory.phtml');
await page.waitForSelector('.neosnipe-badge', { timeout: 10000 });

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
await page.locator('.neosnipe-launcher').click();
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

await page.evaluate(() => {
  const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
  root.querySelector('.ns-panel-head .v-btn')?.click();
});
await page.waitForTimeout(300);

// --- hover-only badges -------------------------------------------------------
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
