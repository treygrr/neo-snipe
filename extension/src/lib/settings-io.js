import { api } from './ext-api.js';
import { DEFAULTS } from './messages.js';
import { cleanPoolTimes } from './magma.js';
import { freshCacheEntries } from './price-cache.js';
import { cleanIconStep } from './launcher-size.js';

// Bumped only when the shape changes in a way an importer must know about.
// Import accepts anything from this version or older, and ignores keys it does
// not recognise, so a file written by a newer build still loads what it can.
// The optional `cache` is one of those: an older build simply skips it.
export const EXPORT_VERSION = 1;

const SETTING_KEYS = Object.keys(DEFAULTS);

/**
 * Everything worth keeping: your settings and your lists — and, with
 * `exportIncludeCache` on, the Jelly Neo prices and trading post histories
 * still inside their day (`p2:`/`tp2:`), so another browser starts with them.
 *
 * Never included: Food Club done marks, which are scoped to a round that will
 * be over by the time anyone imports this.
 */
export async function collectSettings() {
  const [sync, local] = await Promise.all([
    api.storage.sync.get(SETTING_KEYS).catch(() => ({})),
    api.storage.local.get(['favorites', 'dailyFavorites', ...SETTING_KEYS]).catch(() => ({})),
  ]);

  const settings = {};
  for (const key of SETTING_KEYS) {
    // storage.sync is the usual home, but Safari can refuse it and fall back.
    settings[key] = sync[key] ?? local[key] ?? DEFAULTS[key];
  }

  const data = {
    app: 'neo-snipe',
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    favourites: Array.isArray(local.favorites) ? local.favorites : [],
    dailyFavourites: Array.isArray(local.dailyFavorites) ? local.dailyFavorites : [],
  };
  if (settings.exportIncludeCache === true) {
    data.cache = freshCacheEntries(await api.storage.local.get(null).catch(() => ({})));
  }
  return data;
}

export const toJson = (data) => JSON.stringify(data, null, 2);

export class ImportError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ImportError';
  }
}

/**
 * Parses and validates a file, without touching storage. `now` decides which
 * cached entries are still inside their day.
 */
export function parseExport(text, { now = Date.now() } = {}) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ImportError('That is not valid JSON.');
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ImportError('That file does not look like a neo-snipe export.');
  }
  if (data.app && data.app !== 'neo-snipe') {
    throw new ImportError(`That export is from "${data.app}", not neo-snipe.`);
  }
  if (data.version && Number(data.version) > EXPORT_VERSION) {
    throw new ImportError(
      `That file is from a newer version (${data.version}); this build understands up to ${EXPORT_VERSION}.`,
    );
  }

  // Keep only what we recognise and can trust the shape of. `typeof` alone
  // cannot tell an array from any other object, and the popover's tab order is
  // an array of ids, so it is checked element by element (the bar's button order
  // too). A retired key, such as the old `panelTabOrder` or the `movablePanel`
  // and `movableTabs` switches, is not in SETTING_KEYS and so is never read.
  const settings = {};
  for (const key of SETTING_KEYS) {
    const value = data.settings?.[key];
    const fallback = DEFAULTS[key];

    // An object passes a typeof check whatever it holds, so the pool times are
    // cleaned pair by pair. Skipped when absent, so an older export does not
    // wipe times found since.
    if (key === 'magmaPoolTimes') {
      if (value !== undefined) settings[key] = cleanPoolTimes(value);
      continue;
    }

    // Any number passes typeof, and the bar only lays out at its five sizes.
    if (key === 'launcherIconStep' || key === 'verticalIconStep') {
      if (cleanIconStep(value, null) !== null) settings[key] = value;
      continue;
    }

    if (Array.isArray(fallback)) {
      if (Array.isArray(value) && value.every((v) => typeof v === 'string')) settings[key] = value;
      continue;
    }
    if (typeof value === typeof fallback && !Array.isArray(value)) settings[key] = value;
  }

  const items = (list) => (Array.isArray(list) ? list : []).filter(
    (f) => f && typeof f === 'object' && typeof f.name === 'string' && f.name.trim(),
  ).map((f) => ({
    name: f.name.trim(),
    imageHash: typeof f.imageHash === 'string' ? f.imageHash : null,
    imageUrl: typeof f.imageUrl === 'string' ? f.imageUrl : null,
    addedAt: Number(f.addedAt) || Date.now(),
  }));

  const dailies = (list) => (Array.isArray(list) ? list : []).filter(
    (d) => d && typeof d === 'object' && typeof d.url === 'string'
      && /^https:\/\/www\.neopets\.com\//.test(d.url),
  ).map((d) => ({ label: String(d.label ?? d.url), url: d.url }));

  return {
    settings,
    favourites: items(data.favourites),
    dailyFavourites: dailies(data.dailyFavourites),
    // Only current-version cache keys still inside their day, so an import can
    // never write anything but the worker's own kind of entry.
    cache: freshCacheEntries(data.cache, now),
  };
}

/**
 * Writes a parsed export. Replaces the lists rather than merging them; cached
 * entries are added alongside what is already cached, never instead of it.
 */
export async function applyImport(parsed) {
  const writes = [];
  if (Object.keys(parsed.settings).length) {
    writes.push(api.storage.sync.set(parsed.settings).catch(
      () => api.storage.local.set(parsed.settings),
    ));
  }
  writes.push(api.storage.local.set({
    favorites: parsed.favourites,
    dailyFavorites: parsed.dailyFavourites,
  }));
  const cache = parsed.cache ?? {};
  if (Object.keys(cache).length) writes.push(api.storage.local.set(cache));
  await Promise.all(writes);

  return {
    settings: Object.keys(parsed.settings).length,
    favourites: parsed.favourites.length,
    dailyFavourites: parsed.dailyFavourites.length,
    cache: Object.keys(cache).length,
  };
}
