import { reactive } from 'vue';
import { LOOKUP, TP_LOOKUP, ERROR_TEXT } from '../lib/messages.js';
import { sendMessage, api } from '../lib/ext-api.js';
import {
  BET_URL, SETS_URL, CURRENT_BETS_URL, COLLECT_URL,
  RISK_LEVELS, parseBetPage, parseSets, parseRound, parseCurrentBets, resolveBet, payout,
  placeBetUrl, placementRefusal, wasPlaced, betNameKey,
  betId, FoodClubError, COLLECT_POST_URL, collectBody, parseCollectPage,
} from '../lib/foodclub.js';
import { sswQueryUrl, parseSswResponse, SswError } from '../lib/ssw.js';
import {
  WIZARD_URL, WIZARD_REFERRER, wizardBody, parseWizardResponse, mergeListings, WizardError,
} from '../lib/wizard.js';
import { collectSettings, toJson, parseExport, applyImport, ImportError } from '../lib/settings-io.js';
import { getSettings } from '../lib/messages.js';
import { detectPremium } from '../lib/premium.js';
import { writeSettings } from '../lib/ext-api.js';
import {
  listFavourites, toggleFavourite, favouriteId, saveFavourites,
  listDailyFavourites, toggleDailyFavourite, saveDailyFavourites,
  listDoneBets, setDoneBets,
} from '../lib/favorites.js';
import {
  listVisits, toggleVisited, clearVisits, markVisited, expiryOf,
  nstDay, formatCountdown, resetRuleFor, isTracked, describeRule,
} from '../lib/daily-visits.js';
import {
  PANEL, LAUNCHER, readPosition, writePosition, clearPosition, clamp,
} from '../lib/positions.js';
import {
  POPOVER_TABS, LAUNCHER_BUTTONS, fullOrder, visibleOrder, moveInOrder,
} from '../lib/tab-order.js';
import {
  RETRIEVE_URL, CLAIM_URL, FISHING_URL, WHEEL_RESULT_URL, QUESTLOG_URL,
  readRefCk, retrieveBody, claimBody, fishingBody, wheelBody,
  parseQuestList, parseClaim, parseFishing, parseWheel, QuestLogError,
  NC_POPULAR_URL, QUEST_READY_KEY, readyCount, claimBonusBody,
} from '../lib/questlog.js';
import { readAccountName } from '../lib/magma.js';
import {
  RELIST_KEY, ADD_AUCTION_URL, cleanRelist, cleanRelists, withRelist, withoutRelist, relistKey,
  auctionBody, parseAuctionReply,
} from '../lib/fast-relist.js';
import {
  SDB_AUCTION_URL, SDB_AJAX_HEADERS, SDB_PIN_KEY,
  sdbAuctionBody, parseSdbAuctionReply, cleanPin, sdbDrops,
} from '../lib/sdb.js';
import {
  USES, INVENTORY_URL, inventoryItemsUrl, INVENTORY_AJAX_HEADERS, USE_OBJECT_URL, itemInfoUrl,
  parseInventoryReply, candidatesFor, readActivePet, readItemActions, actionFor, useBody, parseUse, ItemUseError,
} from '../lib/item-use.js';
import { SHOPPING_KEY, shopUrl, findShopWithStock, purchasesLeft } from '../lib/shops.js';
import {
  CUSTOMISE_API_URL, CUSTOMISE_URL, editorBody, saveBody, readEditor, readEquipped, wearableCandidates,
  pickRandom, withItem, parseSave, CustomiseError,
} from '../lib/customise.js';

// One popover, one piece of state — badges write into this rather than each
// owning a Vue instance.
export const state = reactive({
  open: false,
  anchor: null,
  item: null,     // what we asked about: { name, imageHash, itemId }
  data: null,     // the Jelly Neo card
  error: null,    // { code, text }
  loading: false,
  tab: 'price',
  // Trading post history is loaded on demand, the first time its tab is opened.
  tp: { loading: false, data: null, error: null },
  // Super Shop Wizard, same: only asked for when its tab is opened, and kept
  // for a while afterwards like the regular wizard.
  ssw: { loading: false, data: null, error: null, at: null },
  // How many times the regular wizard has been searched for this item.
  // The regular Shop Wizard. Searches are rate-limited, so this is only ever
  // filled by clicking its tab, and reused for a while afterwards.
  wiz: { loading: false, data: null, error: null, at: null, searches: 0 },

  // Food Club.
  fc: {
    loading: false,
    error: null,
    maxBet: null,
    arenas: [],
    sets: {},
    level: 'standard',
    amount: null,
    loadedAt: null,
    round: null,
    done: [],
    // betId of the bet currently being placed, so only its button spins.
    placing: null,
    // Name keys of the bets Neopets already has on for this round.
    placed: [],
    // NP waiting on the collect page: null until it has been read (or when it
    // could not be), 0 when there is nothing to collect.
    winnings: null,
    collecting: false,
  },

  // A short-lived message over the panel. `action` is an optional link.
  toast: null,

  // The panel. `panelAnchor` is 'bottom' when opened from the in-page bar and
  // 'top' when opened from the toolbar button, so it appears under the button.
  panelOpen: false,
  panelAnchor: 'bottom',
  // Which view the panel shows. Each has its own bar button:
  // favourites, dailies, foodclub, settings, wiz, ssw, quests, magma.
  panelView: 'favourites',
  // Everything the content script found on this page, offered as starting
  // points in the search panels. Replaced on every scan.
  pageItems: [],
  // One independent search per wizard: only one panel is ever open, but each
  // keeps its query and results so switching between them loses nothing.
  search: {
    wiz: blankSearch(),
    ssw: blankSearch(),
  },
  settings: {
    hoverOnly: true, premium: false, premiumAuto: true, minMargin: 1000,
    trackDailyVisits: true, movableLauncher: true, verticalLauncher: false,
    popoverTabOrder: POPOVER_TABS, launcherOrder: LAUNCHER_BUTTONS,
  },
  // What the nav said, or null if no page has told us yet.
  premiumDetected: null,
  io: { status: null, message: '', text: '' },
  // Where the panel was dragged to, in viewport pixels, or null for the
  // anchored default. Kept out of `settings` because it is device state.
  panelPos: null,
  // Where a dragged popover has been put, as the [x, y] point v-menu targets.
  // Cleared on every open: a popover belongs to the badge that opened it.
  popoverPos: null,
  panelDragging: false,
  favourites: [],
  dailyFavourites: [],
  // `{ dailyUrl: visitedAt }` for everything still counting as done. Each
  // entry expires on its own daily's schedule rather than all at midnight.
  visits: {},
  nstDay: nstDay(),
  // Recomputed on the same tick as the visits, so the panel can re-render.
  now: Date.now(),
  // True while a favourite is being re-fetched, so the popover can say so.
  refreshing: false,
  // Today's Quest Log, read when its view opens. `busy` is the id of the quest
  // being claimed or run, so only its button spins and the rest wait.
  quests: { loading: false, error: null, list: null, bonus: null, expiresAt: null, loadedAt: null, busy: null },
  // The Fast Relist view: the inventory item whose refresh badge opened it
  // (`{ name, objId, imageUrl, listed }`), its saved values, the edited copy of
  // them the form shows (`draft`), and the last reply.
  // `pin` is what is saved, `pinError` the box's complaint about it. Both only
  // matter when the item came from the Safety Deposit Box.
  relist: { item: null, entry: null, draft: null, busy: false, result: null, pin: '', pinError: null },
});

function blankSearch() {
  return {
    query: '', name: null, listings: null, loading: false, error: null,
    at: null, searches: 0, fromCache: false, sort: 'price-asc',
  };
}

let requestId = 0;

// The tab last selected in a popover, kept whether or not it is being used, so
// that turning the setting on has something to act on straight away. Device
// state, like the positions, so it lives in storage.local.
const LAST_TAB_KEY = 'lastPopoverTab';
let lastTab = null;

function rememberTab(tab) {
  lastTab = tab;
  api.storage.local.set({ [LAST_TAB_KEY]: tab }).catch(() => { /* not worth surfacing */ });
}

/**
 * Which tab a fresh popover lands on: the one you left last if you asked for
 * that, otherwise whichever sits first in your order. A remembered tab that is
 * no longer available — SSW once Premium goes off — falls back to the first.
 */
function openingTab() {
  const available = popoverTabs();
  if (state.settings.rememberPopoverTab && available.includes(lastTab)) return lastTab;
  return available[0] || 'price';
}

/**
 * @param {object} [opts]
 * @param {boolean} [opts.refresh] Skip the cache — used when opening a
 *   favourite, where the whole point is to see the current price.
 */
export async function openFor(anchor, item, { refresh = false } = {}) {
  // Clicking the same badge again toggles the popover shut.
  if (!refresh && state.open && state.anchor === anchor) {
    state.open = false;
    return;
  }

  const id = ++requestId;
  const tab = openingTab();
  Object.assign(state, { open: true, anchor, item, data: null, error: null, loading: true, tab });
  // A different badge, so any dragged position is about the wrong item.
  state.popoverPos = null;
  state.tp = { loading: false, data: null, error: null };
  state.ssw = { loading: false, data: null, error: null, at: null };
  // A different item now, so any open shops popover is about the wrong thing.
  state.wiz = { loading: false, data: null, error: null, at: null, searches: 0 };
  state.refreshing = refresh;

  const res = await ask({ type: LOOKUP, item, refresh });

  // A newer click has taken over; drop this response.
  if (id !== requestId) return;

  state.loading = false;
  state.refreshing = false;
  if (res?.ok) state.data = res.data;
  else state.error = asError(res);

  // Every tab but price needs the name or item id this lookup just supplied,
  // so its fetch has to wait for it — and a failed lookup has nothing to feed.
  if (res?.ok) loadTab(state.tab);
}

/**
 * The service worker can be torn down while a lookup is in flight — Chrome
 * kills an idle MV3 worker and a slow fetch does not count as activity — and
 * `sendMessage` then rejects with "message port closed before a response was
 * received". Left unhandled that rejection escapes mid-function and the tab
 * spins forever, so turn it into an ordinary error response the popover can
 * show with a Retry button.
 */
async function ask(message) {
  try {
    return (await sendMessage(message)) ?? { ok: false, error: 'disconnected' };
  } catch {
    return { ok: false, error: 'disconnected' };
  }
}

const asError = (res) => {
  const code = res?.error || 'internal';
  return { code, text: ERROR_TEXT[code] || 'Something went wrong.', detail: res?.detail };
};

/** Fetched lazily: the upstream page is slow, so we only ask when asked. */
export async function loadTradingPost() {
  if (state.tp.loading || state.tp.data) return;

  const itemId = state.data?.itemId;
  if (!itemId) {
    state.tp.error = asError({ error: 'no_item_id' });
    return;
  }

  const id = requestId;
  state.tp = { loading: true, data: null, error: null };

  const res = await ask({ type: TP_LOOKUP, itemId });
  if (id !== requestId) return; // a different item has been opened since

  state.tp.loading = false;
  if (res?.ok) state.tp.data = res.data;
  else state.tp.error = asError(res);
}

/**
 * Live shop listings from the Super Shop Wizard. Fetched from the content
 * script because it is same-origin with your Neopets session; the service
 * worker has no business holding that.
 */
// Neopets limits how often you may use either wizard, so results are kept and
// reused rather than searched again for the same item. How long for is yours
// to set, per wizard; zero means never reuse, so every open searches again.
const MINUTE_MS = 60 * 1000;
const cacheMs = (key) => Math.max(0, Number(state.settings[key]) || 0) * MINUTE_MS;

const sswCache = new Map();

/** The Super Shop Wizard call itself, shared by the tab and the search panel. */
async function askSsw(name) {
  const res = await fetch(sswQueryUrl(name), { credentials: 'include' });
  if (!res.ok) throw new SswError(`Neopets returned ${res.status}.`);
  return parseSswResponse(await res.json());
}

const SSW_UNREACHABLE = 'Could not reach the Super Shop Wizard. Are you logged in to Neopets?';

export async function loadShops({ force = false } = {}) {
  if (state.ssw.loading) return;

  const name = state.data?.name;
  if (!name) return;

  if (!force) {
    if (state.ssw.data) return;
    const cached = sswCache.get(name);
    if (cached && Date.now() - cached.at < cacheMs('sswCacheMinutes')) {
      state.ssw = { loading: false, data: cached.data, error: null, at: cached.at };
      return;
    }
  }

  const id = requestId;
  state.ssw = { loading: true, data: null, error: null, at: null };
  try {
    const parsed = await askSsw(name);
    if (id !== requestId) return;
    const at = Date.now();
    sswCache.set(name, { data: parsed, at });
    state.ssw = { loading: false, data: parsed, error: null, at };
  } catch (err) {
    if (id !== requestId) return;
    state.ssw.error = err instanceof SswError ? err.message : SSW_UNREACHABLE;
  } finally {
    if (id === requestId) state.ssw.loading = false;
  }
}

export const retryShops = () => loadShops({ force: true });

const wizCache = new Map();

/**
 * The regular Shop Wizard call. Neopets rejects this endpoint unless the
 * request came from the wizard page — "you have been directed to this page
 * from the wrong place". Referer is a forbidden header for fetch, but
 * `referrer` is not, and a same-origin URL satisfies the check.
 */
async function askWizard(name) {
  const res = await fetch(WIZARD_URL, {
    method: 'POST',
    credentials: 'include',
    referrer: WIZARD_REFERRER,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: wizardBody(name).toString(),
  });
  if (!res.ok) throw new WizardError(`Neopets returned ${res.status}.`);
  return parseWizardResponse(new DOMParser().parseFromString(await res.text(), 'text/html'));
}

const WIZ_UNREACHABLE = 'Could not reach the Shop Wizard. Are you logged in to Neopets?';

export async function loadWizard({ force = false } = {}) {
  if (state.wiz.loading) return;

  const name = state.data?.name;
  if (!name) return;

  if (!force) {
    if (state.wiz.data) return;
    const cached = wizCache.get(name);
    if (cached && Date.now() - cached.at < cacheMs('wizCacheMinutes')) {
      state.wiz = { loading: false, data: cached.data, error: null, at: cached.at, searches: cached.searches };
      return;
    }
  }

  const id = requestId;
  // Keep what we already know: a forced search adds to it.
  const known = wizCache.get(name);
  state.wiz = { loading: true, data: state.wiz.data, error: null, at: null, searches: known?.searches ?? 0 };
  try {
    const parsed = await askWizard(name);
    if (id !== requestId) return;

    // Each search returns a different slice, so they accumulate; one row per
    // shop, newest price winning.
    const merged = {
      ...parsed,
      listings: mergeListings(known?.data?.listings ?? [], parsed.listings),
    };
    const at = Date.now();
    const searches = (known?.searches ?? 0) + 1;
    wizCache.set(name, { data: merged, at, searches });
    state.wiz = { loading: false, data: merged, error: null, at, searches };
  } catch (err) {
    if (id !== requestId) return;
    state.wiz = {
      loading: false,
      data: null,
      at: null,
      searches: known?.searches ?? 0,
      error: err instanceof WizardError
        ? err.message
        : WIZ_UNREACHABLE,
    };
  }
}

export const retryWizard = () => loadWizard({ force: true });

/** The fetch a tab needs the first time it is shown. Price needs nothing. */
function loadTab(tab) {
  if (tab === 'tp') loadTradingPost();
  if (tab === 'shops') loadShops();
  if (tab === 'wiz') loadWizard();
}

export function selectTab(tab) {
  state.tab = tab;
  rememberTab(tab);
  loadTab(tab);
}

/** Where a dragged popover has been put; null puts it back on its badge. */
export function setPopoverPos(pos) {
  state.popoverPos = pos;
}

export function retryTradingPost() {
  state.tp = { loading: false, data: null, error: null };
  loadTradingPost();
}

export function retry() {
  if (state.item && state.anchor) {
    const { anchor, item } = state;
    state.anchor = null; // force openFor to treat this as a fresh open
    openFor(anchor, item);
  }
}

export function close() {
  state.open = false;
}

/**
 * The spread between what this shop is asking and what Jelly Neo says the item
 * is worth — only where the page showed a price, which is main shops and user
 * shops rather than your own inventory.
 *
 * `worth` is Jelly Neo's estimate, so `clears` means the spread beats your
 * threshold, not that anyone will pay it.
 */
export function shopMargin() {
  const ask = state.item?.price;
  const worth = state.data?.estimatedPrice;
  if (!ask || !worth) return null;

  const profit = worth - ask;
  return { ask, worth, profit, clears: profit >= (state.settings.minMargin || 0) };
}

// --- favourites and the panel ---------------------------------------------

export async function loadSettings() {
  Object.assign(state.settings, await getSettings());
  try {
    const stored = await api.storage.local.get(['premiumDetected', LAST_TAB_KEY]);
    if (typeof stored.premiumDetected === 'boolean') state.premiumDetected = stored.premiumDetected;
    if (typeof stored[LAST_TAB_KEY] === 'string') lastTab = stored[LAST_TAB_KEY];
  } catch { /* leave it unknown */ }
}

/**
 * Reads the page's nav and remembers the answer. A page without the nav tells
 * us nothing, so the previous answer stands rather than being overwritten.
 */
export async function detectPremiumFromPage(doc = document) {
  const found = detectPremium(doc);
  if (found === null) return;
  state.premiumDetected = found;
  try { await api.storage.local.set({ premiumDetected: found }); } catch { /* not fatal */ }
}

/** Auto-detection when it is on and has an answer; the manual toggle otherwise. */
export function isPremium() {
  if (state.settings.premiumAuto && state.premiumDetected !== null) return state.premiumDetected;
  return state.settings.premium === true;
}

export async function setSetting(key, value) {
  state.settings[key] = value;
  await writeSettings({ [key]: value });
  // Hiding the SSW tab must not leave it selected.
  if ((key === 'premium' || key === 'premiumAuto') && !isPremium() && state.tab === 'shops') {
    state.tab = 'price';
  }

  // Each of these three has a visible effect the moment it is toggled, rather
  // than at the next page load.
  if (key === 'trackDailyVisits') await loadVisitedDailies();
  if (key === 'movableLauncher') onLauncherDrag?.(value);
  if (key === 'verticalLauncher') onLauncherVertical?.(value);
  if (key === 'launcherOrder') onLauncherOrder?.(value);
  if (key === 'launcherIconStep' || key === 'verticalIconStep') {
    onLauncherIconSize?.({
      horizontal: state.settings.launcherIconStep,
      vertical: state.settings.verticalIconStep,
    });
  }
  if (key === 'badgeIconStep') onBadgeSize?.(value);
}

/** Fills the box with everything worth keeping, ready to copy or save. */
export async function exportSettings() {
  state.io = { status: 'ok', message: 'Copy this, or save it to a file.', text: toJson(await collectSettings()) };
  return state.io.text;
}

export async function importSettings(text) {
  try {
    const parsed = parseExport(text);
    const counts = await applyImport(parsed);
    await loadSettings();
    await loadFavourites();
    state.io = {
      status: 'ok',
      message: `Imported ${counts.favourites} favourites, ${counts.dailyFavourites} dailies`
        + ` and ${counts.settings} settings`
        + (counts.cache ? `, plus ${counts.cache} cached prices.` : '.'),
      text,
    };
  } catch (err) {
    state.io = {
      status: 'error',
      message: err instanceof ImportError ? err.message : 'Could not import that file.',
      text,
    };
  }
}

export async function loadFavourites() {
  const [items, dailies] = await Promise.all([listFavourites(), listDailyFavourites()]);
  state.favourites = items;
  state.dailyFavourites = dailies;
}

export function isDailyFavourite(url) {
  return state.dailyFavourites.some((d) => d.url === url);
}

// --- visited dailies -------------------------------------------------------

export async function loadVisitedDailies() {
  state.visits = state.settings.trackDailyVisits ? await listVisits() : {};
  state.nstDay = nstDay();
  state.now = Date.now();
}

/** Whether a daily is worth ticking at all — the stock market is not. */
export const isDailyTracked = (url) => isTracked(resetRuleFor(url));

export const isDailyVisited = (url) => Boolean(state.visits[url]);

/** When this one comes back, as text, or null if it is not ticked. */
export function readyIn(url) {
  const at = state.visits[url];
  if (!at) return null;
  const until = expiryOf(url, at);
  return until === null ? null : formatCountdown(until - state.now);
}

/** "every 13 hours", "once per window", for the tooltip. */
export const dailySchedule = (url) => describeRule(resetRuleFor(url));

/**
 * The soonest anything ticked will come back, for the summary line. With every
 * daily on its own clock there is no single reset time to show, so the next
 * one to free up is the useful number.
 */
export function nextReadyIn() {
  let soonest = null;
  for (const [url, at] of Object.entries(state.visits)) {
    const until = expiryOf(url, at);
    if (until !== null && (soonest === null || until < soonest)) soonest = until;
  }
  return soonest === null ? null : formatCountdown(soonest - state.now);
}

export async function toggleDailyVisited(url) {
  if (!state.settings.trackDailyVisits || !isDailyTracked(url)) return;
  state.visits = { ...await toggleVisited(url) };
}

export async function clearVisitedDailies() {
  state.visits = { ...await clearVisits() };
}

/**
 * Following a link from the panel counts as a visit straight away, so the tick
 * appears without waiting for the new tab's content script to load — and it
 * still works for the handful of dailies that open somewhere we do not run.
 */
export async function visitDaily(url) {
  if (!state.settings.trackDailyVisits) return;
  await markVisited(url);
  await loadVisitedDailies();
}

/**
 * Ticks expire at all hours now, not just midnight, so the list has to be
 * re-read on a timer rather than only when the day string changes. A minute is
 * fine: the shortest cooldown tracked is fifteen.
 */
let dayTimer = null;

function watchDayRollover() {
  clearInterval(dayTimer);
  dayTimer = setInterval(() => { loadVisitedDailies(); }, 60_000);
}

function stopWatchingDayRollover() {
  clearInterval(dayTimer);
  dayTimer = null;
}

// --- the panel's remembered position ---------------------------------------

const panelSize = (el) => {
  const rect = el.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
};

export async function loadPanelPosition() {
  state.panelPos = await readPosition(PANEL);
}

export function setPanelPos(pos, el) {
  state.panelPos = el ? clamp(pos, panelSize(el)) : pos;
}

export async function savePanelPos(pos, el) {
  setPanelPos(pos, el);
  await writePosition(PANEL, state.panelPos);
}

/** Forgets it, which is what puts the panel back in its corner. */
export async function resetPanelPosition() {
  state.panelPos = null;
  await clearPosition(PANEL);
}

export async function resetLauncherPosition() {
  await clearPosition(LAUNCHER);
  onLauncherReset?.();
}

// --- tab order -------------------------------------------------------------

/** The SSW tab only exists with Premium, so the available set is narrower. */
export function popoverTabs() {
  const available = POPOVER_TABS.filter((id) => id !== 'shops' || isPremium());
  return visibleOrder(fullOrder(state.settings.popoverTabOrder, POPOVER_TABS), available);
}

async function moveTab(key, known, available, from, to) {
  const next = moveInOrder(fullOrder(state.settings[key], known), available, from, to);
  if (!next) return;
  await setSetting(key, next);
}

export const movePopoverTab = (from, to) => moveTab(
  'popoverTabOrder', POPOVER_TABS,
  POPOVER_TABS.filter((id) => id !== 'shops' || isPremium()),
  from, to,
);

/** Back to the order the popover's tabs ship in. */
export async function resetPopoverTabOrder() {
  await setSetting('popoverTabOrder', [...POPOVER_TABS]);
}

/** Back to the order the bar's buttons ship in, on the bar straight away. */
export async function resetLauncherOrder() {
  await setSetting('launcherOrder', [...LAUNCHER_BUTTONS]);
}

// The launcher is plain DOM outside Vue, so the settings view cannot move it
// directly — run.js hands us the way to.
let onLauncherReset = null;
let onLauncherDrag = null;
let onLauncherVertical = null;
let onLauncherOrder = null;
let onLauncherIconSize = null;
// The badges are plain DOM too, sized by the same kind of hook.
let onBadgeSize = null;
export function watchLauncher({ reset, drag, vertical, order, iconSize, badgeSize } = {}) {
  onBadgeSize = badgeSize ?? onBadgeSize;
  onLauncherReset = reset ?? onLauncherReset;
  onLauncherDrag = drag ?? onLauncherDrag;
  onLauncherVertical = vertical ?? onLauncherVertical;
  onLauncherOrder = order ?? onLauncherOrder;
  onLauncherIconSize = iconSize ?? onLauncherIconSize;
}

export async function toggleDaily(daily) {
  state.dailyFavourites = await toggleDailyFavourite(daily);
}

export function isFavourite(item) {
  if (!item) return false;
  const id = favouriteId(item);
  return state.favourites.some((f) => favouriteId(f) === id);
}

/** Toggles the item currently shown in the popover. */
export async function toggleCurrentFavourite() {
  if (!state.item) return;
  state.favourites = await toggleFavourite({
    name: state.item.name,
    imageHash: state.item.imageHash,
    imageUrl: state.data?.imageUrl ?? null,
  });
}

export async function removeFavouriteAt(item) {
  state.favourites = await toggleFavourite(item);
}

/**
 * Opening a favourite always re-fetches: a saved item is one you are watching,
 * so a day-old cached price is the wrong answer.
 */
export function openFavourite(anchor, favourite) {
  return openFor(anchor, { name: favourite.name, imageHash: favourite.imageHash }, { refresh: true });
}

// The launcher lives in the page's DOM, outside Vue, so it needs telling when
// the panel opens, closes or changes view: `fn(open, view)`.
let onPanelChange = null;
export function watchPanel(fn) { onPanelChange = fn; }

export function togglePanel({ anchor = 'bottom' } = {}) {
  // Re-clicking a different opener moves the panel rather than closing it.
  if (state.panelOpen && state.panelAnchor !== anchor) {
    state.panelAnchor = anchor;
    return;
  }
  state.panelAnchor = anchor;
  state.panelOpen = !state.panelOpen;
  if (state.panelOpen) {
    loadFavourites();
    loadVisitedDailies();
    loadPanelPosition();
    watchDayRollover();
  } else {
    stopWatchingDayRollover();
  }
  onPanelChange?.(state.panelOpen, state.panelView);
}

/** Replaced wholesale on each scan: the page is the source of truth. */
export function setPageItems(items) {
  state.pageItems = Array.isArray(items) ? items : [];
}

// What showing a view needs beyond rendering it. Settings starts with a clean
// import box and re-reads storage, which another tab may have changed. Food
// Club fetches the round; its own 60-second guard keeps a quick back-and-forth
// from refetching.
function enterPanelView(view) {
  if (view === 'settings') {
    state.io = { status: null, message: '', text: '' };
    loadSettings();
  } else if (view === 'foodclub') {
    loadFoodClub();
  }
}

/**
 * The launcher's buttons all land here. Opening the panel on the view it is
 * already showing closes it, which is what makes each button a toggle.
 */
export function openPanelView(view = 'favourites', { anchor = 'bottom' } = {}) {
  // Asking for a view the panel is not showing always shows it, rather than
  // closing the panel on you.
  if (state.panelOpen && state.panelView !== view) {
    state.panelView = view;
    state.panelAnchor = anchor;
    enterPanelView(view);
    onPanelChange?.(true, view);
    return;
  }

  // Otherwise it is the same button again, so `togglePanel` decides: close it,
  // or move it when the click came from a different opener. Only a real open
  // enters the view; a move leaves the settings import box as it was.
  const wasOpen = state.panelOpen;
  state.panelView = view;
  togglePanel({ anchor });
  if (state.panelOpen && !wasOpen) enterPanelView(view);
}

const CACHES = { wiz: () => wizCache, ssw: () => sswCache };
const CACHE_SETTING = { wiz: 'wizCacheMinutes', ssw: 'sswCacheMinutes' };

export function setSearchQuery(kind, query) {
  state.search[kind].query = query;
}

export function setSearchSort(kind, sort) {
  state.search[kind].sort = sort;
}

/**
 * Shops with no price sort last whichever way the list is turned, since "no
 * price" is not cheaper than anything.
 */
function sortRows(listings, sort) {
  const rows = [...(listings || [])];
  const dir = sort.endsWith('-desc') ? -1 : 1;

  if (sort.startsWith('price')) {
    return rows.sort((a, b) => {
      if (a.price == null) return 1;
      if (b.price == null) return -1;
      return (a.price - b.price) * dir;
    });
  }
  return rows.sort((a, b) => String(a.owner || '').localeCompare(String(b.owner || '')) * dir);
}

/** Rows as this panel should list them. */
export function sortedListings(kind) {
  return sortRows(state.search[kind].listings, state.search[kind].sort);
}

const OTHER_KIND = { wiz: 'ssw', ssw: 'wiz' };

/**
 * What the *other* wizard already knows about the same item. The two search
 * the same shops by different means, so a result one of them fetched is worth
 * showing in either panel rather than spending a second search to rediscover
 * it. Age is shown and no window applies: this is offered, never substituted
 * for a search, so a stale list is still worth seeing as long as it says so.
 */
export function crossCached(kind) {
  const name = state.search[kind].name;
  if (!name) return null;

  const other = OTHER_KIND[kind];
  const hit = CACHES[other]().get(name);
  if (!hit?.data?.listings?.length) return null;

  return {
    kind: other,
    label: other === 'wiz' ? 'Shop Wizard' : 'Super Shop Wizard',
    at: hit.at,
    listings: sortRows(hit.data.listings, state.search[kind].sort),
  };
}

/**
 * Runs a search, or shows what is already known. A cached result inside its
 * window is displayed as-is and marked as cached rather than searched again —
 * the whole point of the cache, and the reason the panel says how old it is.
 */
export async function runSearch(kind, { force = false } = {}) {
  const slot = state.search[kind];
  const name = slot.query.trim();
  if (!name || slot.loading) return;

  const cache = CACHES[kind]();
  const known = cache.get(name);

  if (!force && known && Date.now() - known.at < cacheMs(CACHE_SETTING[kind])) {
    Object.assign(slot, {
      name, listings: known.data.listings || [], error: null,
      at: known.at, searches: known.searches ?? 0, fromCache: true,
    });
    return;
  }

  // A different item: the rows on screen belong to the last one, and would sit
  // under this item's name until the search came back.
  if (slot.name !== name) slot.listings = null;
  Object.assign(slot, { name, loading: true, error: null, fromCache: false });
  try {
    const parsed = kind === 'wiz' ? await askWizard(name) : await askSsw(name);
    const at = Date.now();

    // The regular wizard returns a different slice each time, so searches add
    // up; the SSW returns the lot in one go and simply replaces.
    const listings = kind === 'wiz'
      ? mergeListings(known?.data?.listings ?? [], parsed.listings)
      : parsed.listings;
    const searches = kind === 'wiz' ? (known?.searches ?? 0) + 1 : 1;

    cache.set(name, { data: { ...parsed, listings }, at, searches });
    Object.assign(slot, { listings, at, searches, error: null });
  } catch (err) {
    const expected = err instanceof WizardError || err instanceof SswError;
    slot.error = expected ? err.message : (kind === 'wiz' ? WIZ_UNREACHABLE : SSW_UNREACHABLE);
    slot.listings = null;
  } finally {
    slot.loading = false;
  }
}

/** Search an item straight from the page list, without typing its name. */
export function searchPageItem(kind, item) {
  state.search[kind].query = item?.name || '';
  return runSearch(kind);
}

/**
 * Back to an empty search, keeping the chosen sort. A fresh object rather than
 * a reset in place: a search still in flight writes to the slot it started
 * with, so its answer lands somewhere nothing displays instead of undoing the
 * clear. The caches are left alone.
 */
export function clearSearch(kind) {
  state.search[kind] = { ...blankSearch(), sort: state.search[kind].sort };
}

export function closePanel() {
  state.panelOpen = false;
  stopWatchingDayRollover();
  onPanelChange?.(false, state.panelView);
}

// --- Quest Log -------------------------------------------------------------
// Same-origin like Food Club: the panel lives in the Neopets page, so these
// requests carry your session, and the token Neopets checks comes off the page.

const QUEST_UNREACHABLE = 'Could not read the Quest Log. Are you logged in to Neopets?';
const parseHtml = (html) => new DOMParser().parseFromString(html, 'text/html');

/**
 * `ajax` marks it the way the page's own scripts do; the fishing form is a
 * plain form post, so it goes without. `form` sends URL-encoded fields rather
 * than FormData, which is how the fishing form and the wheel's jQuery post.
 */
async function questPost(url, body, { referrer = QUESTLOG_URL, form = false, ajax = true } = {}) {
  const headers = {};
  if (ajax) headers['X-Requested-With'] = 'XMLHttpRequest';
  if (form) headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    referrer,
    headers,
    body: form ? body.toString() : body,
  });
  if (!res.ok) throw new QuestLogError(`Neopets returned ${res.status}.`);
  return res;
}

function pageToken() {
  const ck = readRefCk(document);
  if (!ck) throw new QuestLogError('Log in to Neopets to use the Quest Log.');
  return ck;
}

// The header's NP counter, so a reward shows without a reload.
function setNpCounter(value) {
  const n = Number(String(value ?? '').replace(/[^\d]/g, ''));
  const el = document.getElementById('npanchor');
  if (el && n) el.textContent = n.toLocaleString('en-US');
}

export async function loadQuests() {
  if (state.quests.loading) return;
  state.quests.loading = true;
  state.quests.error = null;
  try {
    const res = await questPost(RETRIEVE_URL, retrieveBody(pageToken()));
    const { quests, bonus, expiresInMs } = parseQuestList(await res.json(), parseHtml);
    state.quests.list = quests;
    state.quests.bonus = bonus;
    state.quests.expiresAt = expiresInMs == null ? null : Date.now() + expiresInMs;
    state.quests.loadedAt = Date.now();
    // The bar's count, for this tab and every other one.
    api.storage.local.set({ [QUEST_READY_KEY]: { count: readyCount(quests), at: Date.now() } }).catch(() => {});
  } catch (err) {
    state.quests.error = err instanceof QuestLogError ? err.message : QUEST_UNREACHABLE;
  } finally {
    state.quests.loading = false;
  }
}

export const isQuestBusy = (quest) => state.quests.busy === quest?.id;

/**
 * One quest at a time. Whatever happened, the list is read again afterwards:
 * what Neopets now says beats a guess — a claim removes the quest, and a run
 * may or may not have counted.
 */
async function withQuest(quest, work) {
  if (state.quests.busy) return;
  state.quests.busy = quest.id;
  try {
    await work();
  } catch (err) {
    showToast(err instanceof QuestLogError || err instanceof ItemUseError || err instanceof CustomiseError
      ? err.message
      : `Could not finish "${quest.title}". Are you logged in to Neopets?`, { tone: 'bad' });
  } finally {
    state.quests.busy = null;
  }
  await loadQuests();
}

export function claimQuest(quest) {
  return withQuest(quest, async () => {
    const res = await questPost(CLAIM_URL, claimBody(pageToken(), quest.id));
    const got = parseClaim(await res.json());
    setNpCounter(got.newNp);
    const what = got.reward === 'np' && got.np
      ? `${got.np.toLocaleString('en-US')} NP`
      : (got.itemName || quest.reward.label);
    showToast(`Claimed ${what} for "${quest.title}".`);
  });
}

/** The daily bonus, once every quest is done and its Claim carries an id. */
export function claimBonus() {
  const id = state.quests.bonus?.claimId;
  if (!id) return undefined;
  return withQuest({ id: 'bonus', title: 'the daily bonus' }, async () => {
    const res = await questPost(CLAIM_URL, claimBonusBody(pageToken(), id));
    const got = parseClaim(await res.json());
    setNpCounter(got.newNp);
    const what = got.reward === 'item' ? (got.itemName || state.quests.bonus.reward) : (got.np ? `${got.np.toLocaleString('en-US')} NP` : state.quests.bonus.reward);
    showToast(`Claimed the daily bonus: ${what}.`);
  });
}

/**
 * Feed, Groom, Play With or Read to: the least valuable suitable item in your
 * inventory, used on your active pet. Each candidate's own action list is read
 * first, so nothing is ever used on another pet or in a way Neopets does not
 * offer for that item.
 */
async function useItemFor(quest) {
  const use = USES[quest.kind];
  // The inventory page arrives empty and fills itself in with this call, so
  // this is what is asked — the way the page asks it, or Neopets refuses. The
  // quest's own tab is asked for, and Neopets decides what belongs in it.
  const invRes = await fetch(inventoryItemsUrl(use.tab), {
    method: 'POST', credentials: 'include', referrer: INVENTORY_URL, headers: INVENTORY_AJAX_HEADERS,
  });
  if (!invRes.ok) throw new QuestLogError(`Neopets returned ${invRes.status}.`);
  const items = parseInventoryReply(await invRes.text(), parseHtml);

  // The header names the active pet. A page without one asks the inventory page.
  let pet = readActivePet(document);
  if (!pet) {
    const page = await fetch(INVENTORY_URL, { credentials: 'include' });
    if (page.ok) pet = readActivePet(parseHtml(await page.text()));
  }
  if (!pet) throw new QuestLogError('Could not tell which pet is active. Are you logged in to Neopets?');

  const candidates = candidatesFor(quest.kind, items);
  if (!candidates.length) {
    throw new QuestLogError(`No ${use.noun} in your inventory to ${use.label.toLowerCase()} with — get one, then try again.`);
  }

  // A few at most: each is a popup read, and the first usually does.
  for (const item of candidates.slice(0, 5)) {
    const info = await questPost(itemInfoUrl(item.objId), new URLSearchParams(), { referrer: INVENTORY_URL, form: true });
    const action = actionFor(quest.kind, readItemActions(parseHtml(await info.text())), pet);
    if (!action) continue;
    const res = await questPost(USE_OBJECT_URL, useBody(item.objId, action), { referrer: INVENTORY_URL, form: true });
    const got = parseUse(parseHtml(await res.text()));
    showToast(`Used ${item.name} on ${pet}. ${got.message}`);
    return;
  }
  throw new QuestLogError(`None of your ${use.noun} items can be used to ${use.label.toLowerCase()} ${pet}.`);
}

/** Does the quest's task itself, then re-reads the list. */
export function runQuest(quest) {
  if (!quest?.runner) return undefined;
  return withQuest(quest, async () => {
    if (quest.runner === 'use') {
      await useItemFor(quest);
      return;
    }
    if (quest.runner === 'visit') {
      // Another subdomain, so the reply cannot be read from here — but the
      // visit is the request itself, sent with your session like a link click.
      // The list read afterwards is what says whether it counted.
      await fetch(NC_POPULAR_URL, { mode: 'no-cors', credentials: 'include' });
      showToast("Visited the NC Mall's popular items.");
      return;
    }
    if (quest.runner === 'shop') {
      // Opened before anything is awaited, while the click still counts as
      // yours — a window opened after the shop search would be blocked.
      const tab = window.open('about:blank', '_blank');
      try {
        const plan = await findShopWithStock(async (url) => {
          const res = await fetch(url, { credentials: 'include' });
          if (!res.ok) throw new QuestLogError(`Neopets returned ${res.status}.`);
          return parseHtml(await res.text());
        });
        if (!plan) {
          throw new QuestLogError('Every shop tried just now was sold out. Shops restock every few minutes — try again shortly.');
        }
        const total = purchasesLeft(quest);
        // The shop and haggle pages read this; the buying is still your click.
        await api.storage.local.set({
          [SHOPPING_KEY]: { questId: quest.id, total, remaining: total, ...plan, at: Date.now() },
        });
        if (tab) tab.location.href = shopUrl(plan.shopId);
        else window.open(shopUrl(plan.shopId), '_blank');
        showToast(`${plan.item.name} for ${plan.item.price.toLocaleString('en-US')} NP is the cheapest at ${plan.shopName} — opened it for you to buy.`);
      } catch (err) {
        tab?.close();
        throw err;
      }
      return;
    }
    if (quest.runner === 'customise') {
      // The pet in your header, and the account it belongs to.
      const petname = readActivePet(document);
      const username = readAccountName(document);
      if (!petname || !username) throw new QuestLogError('Could not tell who is logged in or which pet is active.');

      const post = async (body) => {
        const res = await fetch(CUSTOMISE_API_URL, { method: 'POST', credentials: 'include', referrer: CUSTOMISE_URL, body });
        if (!res.ok) throw new QuestLogError(`Neopets returned ${res.status}.`);
        return res.text();
      };
      let loaded = null;
      try { loaded = JSON.parse((await post(editorBody(username, petname))).trim()); } catch { loaded = null; }
      const editor = readEditor(loaded);

      // A save is the whole outfit, so both saves start from what is worn now.
      const original = readEquipped(editor);
      const item = pickRandom(wearableCandidates(editor, petname));
      if (!item) {
        throw new QuestLogError(`Nothing in your closet can be added to ${petname} without changing what they wear.`);
      }
      parseSave(await post(saveBody(username, petname, withItem(original, item))));
      try {
        parseSave(await post(saveBody(username, petname, original)));
      } catch {
        throw new QuestLogError(`${petname} is still wearing ${item.name} — take it off on the Customise page.`);
      }
      showToast(`Customised ${petname}: tried on ${item.name}, then put their outfit back as it was.`);
      return;
    }
    if (quest.runner === 'fishing') {
      const res = await questPost(FISHING_URL, fishingBody(), { referrer: FISHING_URL, form: true, ajax: false });
      const got = parseFishing(parseHtml(await res.text()));
      const skill = got.skill ? ` Fishing skill is now ${got.skill}.` : '';
      showToast(`You reeled in ${got.caught || 'something'}!${skill}`);
      return;
    }
    // The wheel page is where this is normally posted from.
    const { wheel } = quest;
    const res = await questPost(WHEEL_RESULT_URL, wheelBody(wheel.type), { referrer: wheel.url, form: true });
    const got = parseWheel(await res.json());
    setNpCounter(got.neopoints);
    showToast(`Wheel of ${wheel.name}: ${got.prize || got.message || 'spun'}.`);
  });
}

// --- Food Club -------------------------------------------------------------
// Both pages are on neopets.com, so the content script fetches them
// same-origin with your session; the service worker could not.

async function fetchDoc(url) {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new FoodClubError(`Neopets returned ${res.status} for ${url}`);
  return new DOMParser().parseFromString(await res.text(), 'text/html');
}

export async function loadFoodClub({ force = false } = {}) {
  // Odds change every round, so this is never cached for long.
  if (state.fc.loading) return;
  if (!force && state.fc.loadedAt && Date.now() - state.fc.loadedAt < 60_000) return;

  state.fc.loading = true;
  state.fc.error = null;
  try {
    const [betDoc, setsDoc, placedDoc, collectDoc] = await Promise.all([
      fetchDoc(BET_URL),
      fetchDoc(SETS_URL),
      // A bet placed in an earlier session, or on the site itself, is still
      // placed — so the marks start from what Neopets says you have on.
      fetchDoc(CURRENT_BETS_URL).catch(() => null),
      // What is waiting to be collected, for the Collect button to show.
      fetchDoc(COLLECT_URL).catch(() => null),
    ]);
    const { maxBet, arenas } = parseBetPage(betDoc);
    const sets = parseSets(setsDoc);
    const round = parseRound(setsDoc);

    state.fc.round = round;
    state.fc.done = await listDoneBets(round);
    state.fc.placed = placedDoc
      ? parseCurrentBets(placedDoc).filter((b) => b.round === round).map(betNameKey)
      : [];
    // Unread stays null, so the button falls back to a plain link.
    state.fc.winnings = collectDoc ? parseCollectPage(collectDoc).total : null;
    state.fc.maxBet = maxBet;
    state.fc.arenas = arenas;
    state.fc.sets = sets;
    state.fc.amount = state.fc.amount ?? maxBet;
    state.fc.loadedAt = Date.now();
    if (!sets[state.fc.level]) state.fc.level = Object.keys(sets)[0];
  } catch (err) {
    state.fc.error = err instanceof FoodClubError
      ? err.message
      : 'Could not read Food Club. Are you logged in to Neopets?';
  } finally {
    state.fc.loading = false;
  }
}

/**
 * Collects what the collect page says is waiting, then reads that page and your
 * bets again. Neopets' reply to the collect form has not been captured, so
 * success is judged by the collect page afterwards: winnings gone means
 * collected, and anything still there is reported rather than assumed away.
 */
export async function collectWinnings() {
  const waiting = state.fc.winnings;
  if (!waiting || state.fc.collecting) return;

  state.fc.collecting = true;
  try {
    const res = await fetch(COLLECT_POST_URL, {
      method: 'POST',
      credentials: 'include',
      referrer: COLLECT_URL,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: collectBody().toString(),
    });
    if (!res.ok) throw new Error(`Neopets returned ${res.status}`);

    const [collectDoc, placedDoc] = await Promise.all([
      fetchDoc(COLLECT_URL),
      fetchDoc(CURRENT_BETS_URL).catch(() => null),
    ]);
    const left = parseCollectPage(collectDoc).total;
    state.fc.winnings = left;
    if (placedDoc) {
      state.fc.placed = parseCurrentBets(placedDoc).filter((b) => b.round === state.fc.round).map(betNameKey);
    }

    if (left >= waiting) {
      showToast('Neopets did not collect those winnings.', {
        tone: 'bad', action: { label: 'Collect page', href: COLLECT_URL },
      });
      return;
    }
    showToast(`Collected ${(waiting - left).toLocaleString('en-US')} NP.`);
  } catch (err) {
    showToast(`Could not collect winnings: ${err.message}`, {
      tone: 'bad', action: { label: 'Collect page', href: COLLECT_URL },
    });
  } finally {
    state.fc.collecting = false;
  }
}

export function setFoodClubLevel(level) {
  state.fc.level = level;
}

export function setFoodClubAmount(value) {
  const n = Number(String(value).replace(/[^\d]/g, ''));
  state.fc.amount = Number.isFinite(n) ? Math.max(0, Math.min(n, state.fc.maxBet || n)) : 0;
}

/** The bets for the selected level, resolved against this round's odds. */
export function currentBets() {
  const bets = state.fc.sets[state.fc.level] || [];
  return bets.map((bet) => {
    const r = resolveBet(bet, state.fc.arenas);
    return { ...r, payout: payout(r.totalOdds, state.fc.amount) };
  });
}

/**
 * Done covers both a mark you made and a bet Neopets already has on for this
 * round. The two are kept apart so unticking a mark cannot claim you have not
 * placed a bet that you have — see isBetPlaced.
 */
export function isBetDone(bet) {
  return state.fc.done.includes(betId(bet)) || isBetPlaced(bet);
}

/** Already on with Neopets this round, by the names on the current-bets page. */
export function isBetPlaced(bet) {
  return state.fc.placed.includes(betNameKey(bet));
}

/** Marking is manual as well as automatic, so a mistake can be undone. */
export async function toggleBetDone(bet, force) {
  const id = betId(bet);
  const done = force ?? !state.fc.done.includes(id);
  state.fc.done = done
    ? [...new Set([...state.fc.done, id])]
    : state.fc.done.filter((x) => x !== id);
  await setDoneBets(state.fc.round, state.fc.done);
}

let toastTimer = null;

export function showToast(text, { tone = 'ok', action = null, ms = 6000 } = {}) {
  state.toast = { text, tone, action, at: Date.now() };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { state.toast = null; }, ms);
}

export function dismissToast() {
  clearTimeout(toastTimer);
  state.toast = null;
}

// --- Fast Relist -------------------------------------------------------------

/**
 * Shows the Fast Relist view for an inventory item. A second badge while the
 * view is up swaps the item rather than closing the panel.
 */
export async function openRelist(item) {
  const got = await api.storage.local.get([RELIST_KEY, SDB_PIN_KEY]).catch(() => ({}));
  const entry = cleanRelists(got[RELIST_KEY])[relistKey(item.name)] ?? null;
  state.relist = {
    item,
    entry,
    // Prefilled with what was saved; edits stay here until saved or auctioned.
    draft: entry ? { ...entry } : null,
    busy: false,
    result: null,
    pin: cleanPin(got[SDB_PIN_KEY]) ?? '',
    pinError: null,
  };
  if (state.panelOpen && state.panelView === 'relist') return;
  openPanelView('relist');
}

/** The form's values, checked the same way a saved relist is. */
function relistDraft() {
  const { entry, draft } = state.relist;
  return entry && draft ? cleanRelist({ ...entry, ...draft, name: entry.name }) : null;
}

/** Whether the form differs from what is saved. */
export function relistEdited() {
  const draft = relistDraft();
  const { entry } = state.relist;
  if (!draft || !entry) return false;
  return ['startPrice', 'minIncrement', 'duration', 'neofriendsOnly', 'guildMembersOnly']
    .some((key) => draft[key] !== entry[key]);
}

/** Saves the form's values as the item's Fast Relist. */
export async function saveRelistEdits() {
  const draft = relistDraft();
  if (!draft || state.relist.busy) return;
  const next = { ...draft, savedAt: Date.now() };
  const got = await api.storage.local.get(RELIST_KEY).catch(() => ({}));
  await api.storage.local.set({ [RELIST_KEY]: withRelist(got[RELIST_KEY], next) });
  state.relist.entry = next;
  state.relist.draft = { ...next };
  showToast(`Saved the Fast Relist for ${next.name}.`);
}

/** Whether the item on the Fast Relist view is one the box holds. */
export const relistFromSdb = () => state.relist.item?.source === 'sdb';

/** The saved settings this relist cannot carry through the box. */
export function relistDropped() {
  return relistFromSdb() ? sdbDrops(relistDraft()) : [];
}

/** Keeps the PIN for next time. Four digits or nothing; anything else is not kept. */
export async function saveRelistPin(value) {
  const pin = cleanPin(value);
  state.relist.pin = pin ?? '';
  state.relist.pinError = null;
  await api.storage.local.set({ [SDB_PIN_KEY]: pin ?? '' }).catch(() => {});
}

/**
 * The inventory's own Auction Item call: a form post, answered with a page.
 * The item must be in the inventory, so it is named by its object id.
 */
async function auctionFromInventory(item, entry) {
  const res = await fetch(ADD_AUCTION_URL, {
    method: 'POST',
    credentials: 'include',
    headers: INVENTORY_AJAX_HEADERS,
    body: auctionBody(item.objId, entry),
  });
  if (!res.ok) throw new Error(`Neopets answered ${res.status}.`);
  return parseAuctionReply(new DOMParser().parseFromString(await res.text(), 'text/html'));
}

/**
 * The box's own call: JSON in, JSON back, and the item named by kind rather
 * than by copy. It wants the page's `_ref_ck`, and the account's PIN when one
 * is set — which is why this only runs from a neopets.com page.
 */
async function auctionFromSdb(item, entry, pin) {
  const refCk = readRefCk(document);
  if (!refCk) throw new Error('This page did not carry the token Neopets checks. Reload it and try again.');

  const res = await fetch(SDB_AUCTION_URL, {
    method: 'POST',
    credentials: 'include',
    headers: SDB_AJAX_HEADERS,
    body: JSON.stringify(sdbAuctionBody(item.objInfoId, entry, { pin, refCk })),
  });
  if (!res.ok) throw new Error(`Neopets answered ${res.status}.`);
  return parseSdbAuctionReply(await res.json().catch(() => null));
}

/**
 * Puts the item up for auction with its saved values, the way the page it came
 * from would. Only ever from your click on Make auction.
 */
export async function makeRelistAuction() {
  const { item, busy, pin } = state.relist;
  // What the form says now, edited or not.
  const entry = relistDraft();
  const fromSdb = relistFromSdb();
  const haveItem = fromSdb ? Boolean(item?.objInfoId) : Boolean(item?.objId);
  if (busy || !haveItem || !entry || !entry.startPrice || item.listed) return;

  state.relist.busy = true;
  state.relist.result = null;
  state.relist.pinError = null;
  try {
    const reply = fromSdb
      ? await auctionFromSdb(item, entry, pin)
      : await auctionFromInventory(item, entry);
    state.relist.result = reply;
    // A PIN refusal belongs against the PIN field, not the general result.
    if (reply.pin) state.relist.pinError = reply.wrongPin ? 'That PIN was refused.' : 'Your PIN is needed for this.';
    if (reply.ok) {
      state.relist.item = { ...item, listed: true };
      showToast(`${entry.name} is up for auction.`);
    } else {
      showToast(reply.message || 'Neopets did not accept the auction.', { tone: 'bad' });
    }
  } catch (err) {
    state.relist.result = { ok: false, message: err?.message || 'Could not reach Neopets.' };
    showToast(state.relist.result.message, { tone: 'bad' });
  } finally {
    state.relist.busy = false;
  }
}

/** Forgets the item's saved relist; its badge goes from the inventory with it. */
export async function deleteRelist() {
  const name = state.relist.entry?.name ?? state.relist.item?.name;
  if (!name || state.relist.busy) return;
  const got = await api.storage.local.get(RELIST_KEY).catch(() => ({}));
  await api.storage.local.set({ [RELIST_KEY]: withoutRelist(got[RELIST_KEY], name) });
  state.relist.entry = null;
  state.relist.draft = null;
  state.relist.result = null;
  showToast(`Removed ${name} from Fast Relist.`);
}

/**
 * Place sends the bet itself rather than opening a tab. The panel lives in the
 * Neopets page, so this is a same-origin request carrying your session — the
 * service worker could not do it without host access to neopets.com, which is
 * a much broader permission than placing one bet is worth.
 *
 * The bet is marked done only once Neopets has accepted it, so a refused bet
 * stays on the list to try again.
 */
export async function placeBet(bet) {
  const url = placeBetUrl({ picks: bet.picks, amount: state.fc.amount, totalOdds: bet.totalOdds });
  if (!url || state.fc.placing) return;

  state.fc.placing = betId(bet);
  try {
    const res = await fetch(url, { credentials: 'include', referrer: BET_URL });
    if (!res.ok) throw new Error(`Neopets returned ${res.status}`);

    // A placed bet redirects to the current-bets page. Anything else is a
    // refusal, whose page usually says why.
    if (!wasPlaced(res)) {
      showToast(placementRefusal(await res.text()), { tone: 'bad' });
      return;
    }

    state.fc.placed = [...new Set([...state.fc.placed, betNameKey(bet)])];
    showToast(`Bet placed — ${state.fc.amount.toLocaleString('en-US')} NP at ${bet.totalOdds}:1.`,
      { action: { label: 'View bets', href: CURRENT_BETS_URL } });
  } catch (err) {
    showToast(`Could not place that bet: ${err.message}`, { tone: 'bad' });
  } finally {
    state.fc.placing = null;
  }
}

export const isPlacing = (bet) => state.fc.placing === betId(bet);

// --- reordering favourites -------------------------------------------------

const reorder = (list, from, to) => {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return null;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

/** Moves an item favourite and persists the new order. */
export async function moveFavourite(from, to) {
  const next = reorder(state.favourites, from, to);
  if (!next) return;
  state.favourites = next;
  await saveFavourites(next);
}

/** Same, for the favourited dailies pinned at the top of that tab. */
export async function moveDailyFavourite(from, to) {
  const next = reorder(state.dailyFavourites, from, to);
  if (!next) return;
  state.dailyFavourites = next;
  await saveDailyFavourites(next);
}

export { RISK_LEVELS, BET_URL, SETS_URL, CURRENT_BETS_URL, COLLECT_URL };
