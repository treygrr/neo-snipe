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

/**
 * Safari can refuse storage.sync (it needs iCloud, and returns an error when
 * that is unavailable), so fall back to local rather than losing settings.
 */
export async function readSettings(defaults) {
  for (const area of [api.storage.sync, api.storage.local]) {
    try {
      const stored = await area.get(defaults);
      if (stored) return { ...defaults, ...stored };
    } catch { /* try the next area */ }
  }
  return { ...defaults };
}

export async function writeSettings(values) {
  try {
    await api.storage.sync.set(values);
  } catch {
    await api.storage.local.set(values);
  }
}
