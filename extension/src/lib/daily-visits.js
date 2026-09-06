// Which dailies you have already done, and until when.
//
// Each visit is stored with the moment you made it, and every daily has its
// own reset rule (see reset-rules.js). A tick is live while now is before the
// reset that follows its visit — so the midnight ones clear together at
// midnight NST, Coltzan's clears thirteen hours after you went, the Snowager
// clears when its next window opens, and the freebies hold until the first of
// the month. Nothing has to be running at the reset for this to work: an
// expired visit simply reads as unticked.
import { api } from './ext-api.js';
import { DAILIES } from './dailies.js';
import { nextResetAfter, resetRuleFor, isTracked, nstDay } from './reset-rules.js';

export { nstDay, resetRuleFor, isTracked, describeRule } from './reset-rules.js';

const KEY = 'dailyVisits';

/** "6h 12m", or "12m" under an hour, or "3d" over a day. */
export function formatCountdown(ms) {
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins >= 60 * 24) return `${Math.round(mins / (60 * 24))}d`;
  const h = Math.floor(mins / 60);
  return h ? `${h}h ${mins % 60}m` : `${mins}m`;
}

// --- matching a page you are on to a daily ---------------------------------

const ALL_DAILIES = DAILIES.flatMap((group) => group.items);

const NEOPETS_HOST = /^(www\.)?neopets\.com$/i;

/** Trailing slashes and case are not meaningful in these paths. */
const normalisePath = (path) => path.replace(/\/+$/, '').toLowerCase() || '/';

function parts(url) {
  try {
    const u = new URL(url);
    if (!NEOPETS_HOST.test(u.hostname)) return null;
    return { path: normalisePath(u.pathname), query: u.searchParams };
  } catch {
    return null;
  }
}

/**
 * The daily URL a visited page counts as, or null.
 *
 * Path alone is not enough: the stock market appears twice, once as the
 * bargain list and once as your portfolio, and the Rich Slorg is the shop of
 * offers only with `slorg_payout=yes`. So a daily's own query parameters must
 * all be present on the page, while extra parameters the page happens to carry
 * (session ids, `?ref=`) are ignored. Where several dailies match, the most
 * specific one wins.
 */
export function dailyUrlFor(pageUrl) {
  const page = parts(pageUrl);
  if (!page) return null;

  let best = null;
  let bestScore = -1;

  for (const daily of ALL_DAILIES) {
    const target = parts(daily.url);
    if (!target || target.path !== page.path) continue;

    let score = 0;
    let ok = true;
    for (const [key, value] of target.query) {
      if (page.query.get(key) !== value) { ok = false; break; }
      score += 1;
    }
    if (ok && score > bestScore) {
      best = daily.url;
      bestScore = score;
    }
  }

  return best;
}

// --- when a visit expires ---------------------------------------------------

/** When a visit made at `at` stops counting, or null if it never does. */
export const expiryOf = (url, at) => nextResetAfter(at, resetRuleFor(url));

const live = (url, at, now) => {
  const until = expiryOf(url, at);
  return until === null ? true : now < until;
};

// --- storage ---------------------------------------------------------------
// `{ [url]: timestamp }`. Anything else — including the day-scoped shape an
// earlier build wrote — is discarded rather than migrated: the worst case is
// one day of ticks, and guessing at old data risks claiming a daily is done
// when it is not.

async function read() {
  try {
    const stored = (await api.storage.local.get(KEY))[KEY];
    const visits = stored?.visits;
    if (!visits || typeof visits !== 'object' || Array.isArray(visits)) return {};

    const now = Date.now();
    const kept = {};
    for (const [url, at] of Object.entries(visits)) {
      if (Number.isFinite(at) && live(url, at, now)) kept[url] = at;
    }
    return kept;
  } catch {
    return {};
  }
}

async function write(visits) {
  try {
    await api.storage.local.set({ [KEY]: { visits: { ...visits } } });
  } catch { /* a lost mark is not worth failing a page load over */ }
  return visits;
}

/** `{ url: visitedAt }` for everything still counting as done. */
export async function listVisits() {
  return read();
}

/**
 * Records a visit, given any page URL. Returns the new map, or null when the
 * page was not a daily, is untracked, or was already marked — so callers can
 * skip a write.
 */
export async function markVisited(pageUrl, at = Date.now()) {
  const url = dailyUrlFor(pageUrl);
  if (!url || !isTracked(resetRuleFor(url))) return null;

  const visits = await read();
  if (visits[url]) return null;

  return write({ ...visits, [url]: at });
}

/** The manual tick, so a wrong mark can be undone. */
export async function toggleVisited(url, at = Date.now()) {
  const visits = await read();
  if (visits[url]) {
    const { [url]: _gone, ...rest } = visits;
    return write(rest);
  }
  return write({ ...visits, [url]: at });
}

export async function clearVisits() {
  return write({});
}
