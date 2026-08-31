// Safari exposes the standard `browser` namespace; Chrome exposes `chrome`.
// Both are promise-based for the calls we make, so a plain alias is enough.
export const api = globalThis.browser ?? globalThis.chrome;

/**
 * `sendMessage` returns a promise in Chrome (MV3) and Safari, but older
 * callback-only builds exist, so accept either shape.
 */
export function sendMessage(message) {
  const result = api.runtime.sendMessage(message);
  if (result && typeof result.then === 'function') return result;
  return new Promise((resolve) => api.runtime.sendMessage(message, resolve));
}

export const getURL = (path) => api.runtime.getURL(path);

/** The one host we ever fetch from. */
export const JELLYNEO_ORIGIN = 'https://items.jellyneo.net/*';

/**
 * Firefox treats MV3 host permissions as opt-in, so a fresh install cannot
 * fetch until the user grants them. Chrome grants them at install, where this
 * simply returns true.
 */
export async function hasJellyNeoAccess() {
  try {
    if (!api.permissions?.contains) return true;
    return await api.permissions.contains({ origins: [JELLYNEO_ORIGIN] });
  } catch {
    return true; // if we cannot tell, let the fetch itself be the judge
  }
}

export async function requestJellyNeoAccess() {
  return api.permissions.request({ origins: [JELLYNEO_ORIGIN] });
}

/**
 * Safari can refuse storage.sync (it needs iCloud, and returns an error when
 * that is unavailable), so fall back to local rather than losing settings.
 */
export async function readSettings(defaults) {
  for (const area of [api.storage.sync, api.storage.local]) {
    try {
      // Ask for keys, not defaults: passing defaults makes storage echo them
      // back for missing keys, so the result is always non-empty and we would
      // never fall through to local for settings that only landed there.
      const stored = await area.get(Object.keys(defaults));
      if (stored && Object.keys(stored).length) return { ...defaults, ...stored };
    } catch { /* try the next area */ }
  }
  return { ...defaults };
}

export async function writeSettings(values) {
  try {
    await api.storage.sync.set(values);
    // Clear any older copy in local so the two areas cannot disagree.
    await api.storage.local.remove(Object.keys(values)).catch(() => {});
  } catch {
    await api.storage.local.set(values);
  }
}
