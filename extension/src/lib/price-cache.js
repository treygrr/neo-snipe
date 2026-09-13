// The Jelly Neo lookups the service worker keeps in storage.local. Shared with
// backup, so an export carries exactly what the worker would still use.
//
// Keys are versioned: bump CACHE_VERSION when a change makes existing entries
// wrong, and the worker drops the older ones. v2: entries written before this
// could hold the wrong item entirely, because a Neopets obj_info_id was being
// used as a Jelly Neo item id.

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
export const CACHE_MAX_ENTRIES = 2000;
export const CACHE_VERSION = 2;
export const PRICE_PREFIX = `p${CACHE_VERSION}:`;
export const TP_PREFIX = `tp${CACHE_VERSION}:`;

/** A price or trading post entry written by this cache version. */
export const isCurrentCacheKey = (k) =>
  typeof k === 'string' && (k.startsWith(PRICE_PREFIX) || k.startsWith(TP_PREFIX));

/** Any price or trading post entry, whatever version wrote it. */
export const isCacheKey = (k) => /^(p|tp)\d*:/.test(k);

/** A stored `{ value, at }` still inside its day, and not dated in the future. */
export function isFreshEntry(entry, now = Date.now()) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false;
  if (entry.value === null || typeof entry.value !== 'object') return false;
  const at = Number(entry.at);
  return Number.isFinite(at) && at <= now + 60_000 && now - at <= CACHE_TTL_MS;
}

/**
 * The entries worth keeping out of a storage dump or an import: current version,
 * fresh, well-formed, newest first and no more than the worker would hold.
 */
export function freshCacheEntries(all, now = Date.now()) {
  if (!all || typeof all !== 'object' || Array.isArray(all)) return {};
  return Object.fromEntries(
    Object.entries(all)
      .filter(([k, v]) => isCurrentCacheKey(k) && isFreshEntry(v, now))
      .sort((a, b) => Number(b[1].at) - Number(a[1].at))
      .slice(0, CACHE_MAX_ENTRIES)
      .map(([k, v]) => [k, { value: v.value, at: Number(v.at) }]),
  );
}
