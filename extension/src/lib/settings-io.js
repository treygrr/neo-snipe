import { api } from './ext-api.js';
import { DEFAULTS } from './messages.js';

// Bumped only when the shape changes in a way an importer must know about.
// Import accepts anything from this version or older, and ignores keys it does
// not recognise, so a file written by a newer build still loads what it can.
export const EXPORT_VERSION = 1;

const SETTING_KEYS = Object.keys(DEFAULTS);

/**
 * Everything worth keeping: your settings and your lists.
 *
 * Deliberately not included — cached prices (`p2:`/`tp2:`), which are a
 * throwaway copy of Jelly Neo and would bloat the file, and Food Club done
 * marks, which are scoped to a round that will be over by the time anyone
 * imports this.
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

  return {
    app: 'neo-snipe',
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    favourites: Array.isArray(local.favorites) ? local.favorites : [],
    dailyFavourites: Array.isArray(local.dailyFavorites) ? local.dailyFavorites : [],
  };
}

export const toJson = (data) => JSON.stringify(data, null, 2);

export class ImportError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ImportError';
  }
}

/** Parses and validates a file, without touching storage. */
export function parseExport(text) {
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

  // Keep only what we recognise and can trust the shape of.
  const settings = {};
  for (const key of SETTING_KEYS) {
    const value = data.settings?.[key];
    if (typeof value === typeof DEFAULTS[key]) settings[key] = value;
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
  };
}

/** Writes a parsed export. Replaces the lists rather than merging them. */
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
  await Promise.all(writes);

  return {
    settings: Object.keys(parsed.settings).length,
    favourites: parsed.favourites.length,
    dailyFavourites: parsed.dailyFavourites.length,
  };
}
