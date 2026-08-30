import { LOOKUP, TP_LOOKUP } from './lib/messages.js';
import { api } from './lib/ext-api.js';
import { dedupe } from './lib/queue.js';
import { lookupItem, lookupTradingPost, NotFoundError, ScrapeError } from './lib/jellyneo.js';

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 2000;

const key = ({ name, imageHash }) =>
  `p:${String(name || '').toLowerCase().replace(/\s+/g, ' ').trim()}|${imageHash || ''}`;

async function readCache(k) {
  const stored = (await api.storage.local.get(k))[k];
  if (!stored) return null;
  if (Date.now() - stored.at > TTL_MS) {
    await api.storage.local.remove(k);
    return null;
  }
  return stored.value;
}

async function writeCache(k, value) {
  await api.storage.local.set({ [k]: { value, at: Date.now() } });
  await trimCache();
}

// storage.local is finite; drop the oldest entries once we are over budget.
async function trimCache() {
  const all = await api.storage.local.get(null);
  const entries = Object.entries(all).filter(([k]) => k.startsWith('p:') || k.startsWith('tp:'));
  if (entries.length <= MAX_ENTRIES) return;
  entries.sort((a, b) => (a[1]?.at || 0) - (b[1]?.at || 0));
  await api.storage.local.remove(entries.slice(0, entries.length - MAX_ENTRIES).map(([k]) => k));
}

/** Maps a thrown error onto a code the popover knows how to explain. */
function asFailure(err) {
  if (err instanceof NotFoundError) return { ok: false, error: 'not_found' };
  if (err instanceof ScrapeError) return { ok: false, error: 'scrape_failed', detail: err.message };
  // fetch() rejects with a TypeError when the network is unreachable.
  if (err?.name === 'TypeError') return { ok: false, error: 'offline' };
  console.error('[neo-snipe] lookup failed', err);
  return { ok: false, error: 'internal', detail: err?.message };
}

// One click, one lookup: nothing is fetched until someone asks about an item.
async function lookup(item) {
  const k = key(item);

  const cached = await readCache(k);
  if (cached) return { ok: true, data: { ...cached, cached: true } };

  return dedupe(k, async () => {
    const raced = await readCache(k);
    if (raced) return { ok: true, data: { ...raced, cached: true } };
    try {
      const data = await lookupItem(item);
      await writeCache(k, data);
      return { ok: true, data: { ...data, cached: false } };
    } catch (err) {
      return asFailure(err);
    }
  });
}

// Separate because Jelly Neo generates that page on demand and it is slow for
// heavily traded items; only fetched when its tab is opened.
async function tradingPost(itemId) {
  if (!itemId) return { ok: false, error: 'no_item_id' };

  const k = `tp:${itemId}`;
  const cached = await readCache(k);
  if (cached) return { ok: true, data: { ...cached, cached: true } };

  return dedupe(k, async () => {
    try {
      const data = await lookupTradingPost({ itemId });
      await writeCache(k, data);
      return { ok: true, data: { ...data, cached: false } };
    } catch (err) {
      return asFailure(err);
    }
  });
}

api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === LOOKUP) {
    lookup(msg.item).then(sendResponse);
    return true; // keep the message channel open for the async response
  }
  if (msg?.type === TP_LOOKUP) {
    tradingPost(msg.itemId).then(sendResponse);
    return true;
  }
  if (msg?.type === 'neosnipe:clear-cache') {
    api.storage.local.get(null)
      .then((all) => api.storage.local.remove(Object.keys(all).filter((k) => /^(p|tp):/.test(k))))
      .then(() => sendResponse({ ok: true }));
    return true;
  }
  return false;
});
