import { api } from './ext-api.js';

const KEY = 'favorites';
const MAX = 200;

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

  await api.storage.local.set({ [KEY]: next });
  return next;
}

export async function removeFavourite(item) {
  const id = favouriteId(item);
  const next = (await listFavourites()).filter((f) => favouriteId(f) !== id);
  await api.storage.local.set({ [KEY]: next });
  return next;
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

/** Adds or removes by URL, and returns the new list. */
export async function toggleDailyFavourite({ label, url }) {
  const current = await listDailyFavourites();
  const without = current.filter((d) => d.url !== url);
  const next = without.length === current.length
    ? [...current, { label, url }]
    : without;

  await api.storage.local.set({ [DAILY_KEY]: next });
  return next;
}
