import { LOOKUP, TP_LOOKUP, getSettings } from './lib/messages.js';
import { api } from './lib/ext-api.js';

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 2000;
const TIMEOUT_MS = 20000;
// Jelly Neo generates the trading post page on demand; it can take ~20s the
// first time a heavily traded item is requested.
const TP_TIMEOUT_MS = 60000;

// Coalesces identical lookups that are in flight in this worker.
const inFlight = new Map();

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

// storage.local is finite; drop the oldest entries once we're over budget.
async function trimCache() {
  const all = await api.storage.local.get(null);
  const entries = Object.entries(all).filter(([k]) => k.startsWith('p:'));
  if (entries.length <= MAX_ENTRIES) return;
  entries.sort((a, b) => (a[1]?.at || 0) - (b[1]?.at || 0));
  await api.storage.local.remove(entries.slice(0, entries.length - MAX_ENTRIES).map(([k]) => k));
}

// One lookup per click, never a batch: a page full of items costs Jelly Neo
// nothing until the user actually asks about one.
async function lookup(item) {
  const k = key(item);

  const cached = await readCache(k);
  if (cached) return { ok: true, data: { ...cached, cached: true } };

  if (inFlight.has(k)) return inFlight.get(k);

  const promise = (async () => {
    const { backendUrl, token } = await getSettings();
    if (!token) return { ok: false, error: 'no_token' };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${backendUrl.replace(/\/$/, '')}/api/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-NeoSnipe-Token': token },
        body: JSON.stringify(item),
        signal: controller.signal,
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        await writeCache(k, body);
        return { ok: true, data: body };
      }
      if (res.status === 401) return { ok: false, error: 'unauthorized' };
      return { ok: false, error: body.error || 'internal', detail: body.detail };
    } catch (err) {
      // An aborted fetch is our timeout; anything else means we never reached the server.
      return { ok: false, error: err.name === 'AbortError' ? 'timeout' : 'backend_down' };
    } finally {
      clearTimeout(timer);
      inFlight.delete(k);
    }
  })();

  inFlight.set(k, promise);
  return promise;
}

// Trading post history is a separate, slower call — only made when someone
// opens that tab, so items nobody asks about never cost Jelly Neo the page.
async function tradingPost(itemId) {
  if (!itemId) return { ok: false, error: 'no_item_id' };

  const k = `tp:${itemId}`;
  const cached = await readCache(k);
  if (cached) return { ok: true, data: { ...cached, cached: true } };

  if (inFlight.has(k)) return inFlight.get(k);

  const promise = (async () => {
    const { backendUrl, token } = await getSettings();
    if (!token) return { ok: false, error: 'no_token' };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TP_TIMEOUT_MS);
    try {
      const res = await fetch(`${backendUrl.replace(/\/$/, '')}/api/trading-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-NeoSnipe-Token': token },
        body: JSON.stringify({ itemId }),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        await writeCache(k, body);
        return { ok: true, data: body };
      }
      if (res.status === 401) return { ok: false, error: 'unauthorized' };
      return { ok: false, error: body.error || 'internal', detail: body.detail };
    } catch (err) {
      return { ok: false, error: err.name === 'AbortError' ? 'timeout' : 'backend_down' };
    } finally {
      clearTimeout(timer);
      inFlight.delete(k);
    }
  })();

  inFlight.set(k, promise);
  return promise;
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
  return false;
});
