import { reactive } from 'vue';
import { LOOKUP, TP_LOOKUP, ERROR_TEXT } from '../lib/messages.js';
import { sendMessage, api } from '../lib/ext-api.js';
import {
  BET_URL, SETS_URL, CURRENT_BETS_URL, COLLECT_URL,
  RISK_LEVELS, parseBetPage, parseSets, parseRound, parseCurrentBets, resolveBet, payout,
  placeBetUrl, placementRefusal, wasPlaced, betNameKey,
  betId, FoodClubError,
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
  },

  // A short-lived message over the panel. `action` is an optional link.
  toast: null,

  // The panel. `panelAnchor` is 'bottom' when opened from the in-page bar and
  // 'top' when opened from the toolbar button, so it appears under the button.
  panelOpen: false,
  panelAnchor: 'bottom',
  // 'tabs' or 'settings' — the cog swaps the panel body.
  panelView: 'tabs',
  settings: { hoverOnly: true, premium: false, premiumAuto: true, minMargin: 1000 },
  // What the nav said, or null if no page has told us yet.
  premiumDetected: null,
  io: { status: null, message: '', text: '' },
  panelTab: 'favourites',
  favourites: [],
  dailyFavourites: [],
  // True while a favourite is being re-fetched, so the popover can say so.
  refreshing: false,
});

let requestId = 0;

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
  Object.assign(state, { open: true, anchor, item, data: null, error: null, loading: true, tab: 'price' });
  state.tp = { loading: false, data: null, error: null };
  state.ssw = { loading: false, data: null, error: null, at: null };
  // A different item now, so any open shops popover is about the wrong thing.
  state.wiz = { loading: false, data: null, error: null, at: null, searches: 0 };
  state.refreshing = refresh;

  const res = await sendMessage({ type: LOOKUP, item, refresh });

  // A newer click has taken over; drop this response.
  if (id !== requestId) return;

  state.loading = false;
  state.refreshing = false;
  if (res?.ok) state.data = res.data;
  else state.error = asError(res);
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

  const res = await sendMessage({ type: TP_LOOKUP, itemId });
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
const sswCache = new Map();

export async function loadShops({ force = false } = {}) {
  if (state.ssw.loading) return;

  const name = state.data?.name;
  if (!name) return;

  if (!force) {
    if (state.ssw.data) return;
    const cached = sswCache.get(name);
    if (cached && Date.now() - cached.at < RESULT_CACHE_MS) {
      state.ssw = { loading: false, data: cached.data, error: null, at: cached.at };
      return;
    }
  }

  const id = requestId;
  state.ssw = { loading: true, data: null, error: null, at: null };
  try {
    const res = await fetch(sswQueryUrl(name), { credentials: 'include' });
    if (!res.ok) throw new SswError(`Neopets returned ${res.status}.`);
    const parsed = parseSswResponse(await res.json());
    if (id !== requestId) return;
    const at = Date.now();
    sswCache.set(name, { data: parsed, at });
    state.ssw = { loading: false, data: parsed, error: null, at };
  } catch (err) {
    if (id !== requestId) return;
    state.ssw.error = err instanceof SswError
      ? err.message
      : 'Could not reach the Super Shop Wizard. Are you logged in to Neopets?';
  } finally {
    if (id === requestId) state.ssw.loading = false;
  }
}

export const retryShops = () => loadShops({ force: true });

// Neopets limits how often you may use either wizard, so results are kept and
// reused rather than searched again for the same item.
const RESULT_CACHE_MS = 15 * 60 * 1000;
const wizCache = new Map();

export async function loadWizard({ force = false } = {}) {
  if (state.wiz.loading) return;

  const name = state.data?.name;
  if (!name) return;

  if (!force) {
    if (state.wiz.data) return;
    const cached = wizCache.get(name);
    if (cached && Date.now() - cached.at < RESULT_CACHE_MS) {
      state.wiz = { loading: false, data: cached.data, error: null, at: cached.at, searches: cached.searches };
      return;
    }
  }

  const id = requestId;
  // Keep what we already know: a forced search adds to it.
  const known = wizCache.get(name);
  state.wiz = { loading: true, data: state.wiz.data, error: null, at: null, searches: known?.searches ?? 0 };
  try {
    const res = await fetch(WIZARD_URL, {
      method: 'POST',
      credentials: 'include',
      // Neopets rejects this endpoint unless the request came from the wizard
      // page — "you have been directed to this page from the wrong place".
      // Referer is a forbidden header for fetch, but `referrer` is not, and
      // setting it to a same-origin URL satisfies the check.
      referrer: WIZARD_REFERRER,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: wizardBody(name).toString(),
    });
    if (!res.ok) throw new WizardError(`Neopets returned ${res.status}.`);
    const parsed = parseWizardResponse(new DOMParser().parseFromString(await res.text(), 'text/html'));
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
        : 'Could not reach the Shop Wizard. Are you logged in to Neopets?',
    };
  }
}

export const retryWizard = () => loadWizard({ force: true });

export function selectTab(tab) {
  state.tab = tab;
  if (tab === 'tp') loadTradingPost();
  if (tab === 'shops') loadShops();
  // Only on click: opening a popover must never spend a search.
  if (tab === 'wiz') loadWizard();
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
    const stored = await api.storage.local.get('premiumDetected');
    if (typeof stored.premiumDetected === 'boolean') state.premiumDetected = stored.premiumDetected;
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
}

export function showSettings(show) {
  state.panelView = show ? 'settings' : 'tabs';
  if (show) {
    state.io = { status: null, message: '', text: '' };
    loadSettings();
  }
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
        + ` and ${counts.settings} settings.`,
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
// the panel is closed from inside the panel itself.
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
  if (state.panelOpen) loadFavourites();
  onPanelChange?.(state.panelOpen);
}

export function closePanel() {
  state.panelOpen = false;
  onPanelChange?.(false);
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
    const [betDoc, setsDoc, placedDoc] = await Promise.all([
      fetchDoc(BET_URL),
      fetchDoc(SETS_URL),
      // A bet placed in an earlier session, or on the site itself, is still
      // placed — so the marks start from what Neopets says you have on.
      fetchDoc(CURRENT_BETS_URL).catch(() => null),
    ]);
    const { maxBet, arenas } = parseBetPage(betDoc);
    const sets = parseSets(setsDoc);
    const round = parseRound(setsDoc);

    state.fc.round = round;
    state.fc.done = await listDoneBets(round);
    state.fc.placed = placedDoc
      ? parseCurrentBets(placedDoc).filter((b) => b.round === round).map(betNameKey)
      : [];
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
