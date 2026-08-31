import { reactive } from 'vue';
import { LOOKUP, TP_LOOKUP, ERROR_TEXT } from '../lib/messages.js';
import { sendMessage } from '../lib/ext-api.js';
import { listFavourites, toggleFavourite, favouriteId } from '../lib/favorites.js';

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

  // The bottom-right panel.
  panelOpen: false,
  panelTab: 'favourites',
  favourites: [],
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

export function selectTab(tab) {
  state.tab = tab;
  if (tab === 'tp') loadTradingPost();
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

// --- favourites and the panel ---------------------------------------------

export async function loadFavourites() {
  state.favourites = await listFavourites();
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

export function togglePanel() {
  state.panelOpen = !state.panelOpen;
  if (state.panelOpen) loadFavourites();
  onPanelChange?.(state.panelOpen);
}

export function closePanel() {
  state.panelOpen = false;
  onPanelChange?.(false);
}
