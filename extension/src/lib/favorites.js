import { api } from './ext-api.js';

const KEY = 'favorites';
const MAX = 200;

/**
 * Storage uses structured cloning, and Vue's reactive proxies do not survive
 * it intact — a reactive array came back out as an object with numeric keys.
 * Everything written here goes through this first.
 */
const plain = (value) => JSON.parse(JSON.stringify(value));

/** Favourites are identified the same way the price cache keys items. */
export const favouriteId = ({ name, imageHash }) =>
  `${String(name || '').toLowerCase().replace(/\s+/g, ' ').trim()}|${imageHash || ''}`;

export async function listFavourites() {
  try {
    const stored = (await api.storage.local.get(KEY))[KEY];
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

/** Adds or removes, and returns the new list. */
export async function toggleFavourite(item) {
  const id = favouriteId(item);
  const current = await listFavourites();
  const without = current.filter((f) => favouriteId(f) !== id);

  const next = without.length === current.length
    ? [{ name: item.name, imageHash: item.imageHash ?? null, imageUrl: item.imageUrl ?? null, addedAt: Date.now() },
       ...current].slice(0, MAX)
    : without;

  await api.storage.local.set({ [KEY]: plain(next) });
  return next;
}

/** Persists a whole list, which is what reordering needs. */
export async function saveFavourites(list) {
  await api.storage.local.set({ [KEY]: plain(list.slice(0, MAX)) });
  return list;
}

export async function removeFavourite(item) {
  const id = favouriteId(item);
  const next = (await listFavourites()).filter((f) => favouriteId(f) !== id);
  await api.storage.local.set({ [KEY]: plain(next) });
  return next;
}

// --- Food Club bets already dealt with -------------------------------------
// Kept per round: a mark against round 9978 means nothing once 9979 opens, and
// silently carrying it over would hide a bet you have not actually placed.

const FC_DONE_KEY = 'fcDone';

export async function listDoneBets(round) {
  try {
    const stored = (await api.storage.local.get(FC_DONE_KEY))[FC_DONE_KEY];
    if (!stored || (round && stored.round !== round)) return [];
    return Array.isArray(stored.ids) ? stored.ids : [];
  } catch {
    return [];
  }
}

export async function setDoneBets(round, ids) {
  await api.storage.local.set({ [FC_DONE_KEY]: plain({ round, ids }) });
  return ids;
}

// --- favourited dailies ----------------------------------------------------
// Kept separate from item favourites: different shape, different lifetime, and
// a daily is identified by its URL rather than by name and image.

const DAILY_KEY = 'dailyFavorites';

export async function listDailyFavourites() {
  try {
    const stored = (await api.storage.local.get(DAILY_KEY))[DAILY_KEY];
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

/** Persists a whole list, which is what reordering needs. */
export async function saveDailyFavourites(list) {
  await api.storage.local.set({ [DAILY_KEY]: plain(list) });
  return list;
}

/** Adds or removes by URL, and returns the new list. */
export async function toggleDailyFavourite({ label, url }) {
  const current = await listDailyFavourites();
  const without = current.filter((d) => d.url !== url);
  const next = without.length === current.length
    ? [...current, { label, url }]
    : without;

  await api.storage.local.set({ [DAILY_KEY]: plain(next) });
  return next;
}
