// The Magma Pool. Each account has one ten-minute window a day, at the same
// NST time every day, when the guard naps and the pool can be used. Finding it
// means checking at least every ten minutes until one check lands inside.
//   https://www.jellyneo.net/?go=magma_pool
import { nstClock, nextNstTimeOfDay } from './reset-rules.js';

export const MAGMA_POOL_URL = 'https://www.neopets.com/magma/pool.phtml';

// The window lasts ten minutes, so checks no further apart than this cannot
// step over it.
export const MAGMA_CHECK_MS = 10 * 60_000;

// The page's own words either way. The open side matches the pet-selection
// sentence as well as the nap, and both spellings of the guard, so a typo fixed
// on Neopets' side does not blind the check.
const OPEN = [
  /select your neopet to take a swim in the magma pool/i,
  /the (guard|gaurde) is sleeping/i,
];
const CLOSED = /well-versed in the ways of moltara/i;

/**
 * What a pool page says: 'open', 'closed', or 'unknown' — a logged-out page, an
 * error, a redesign. Only 'open' ever records a time, so anything unexpected
 * costs a check rather than saving a wrong answer.
 */
export function readPoolState(text) {
  const s = String(text ?? '');
  if (OPEN.some((re) => re.test(s))) return 'open';
  if (CLOSED.test(s)) return 'closed';
  return 'unknown';
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
export const isPoolTime = (v) => typeof v === 'string' && HHMM.test(v);

/** The NST minute a check saw the pool open, as "HH:MM". */
export const poolTimeAt = (at = Date.now()) => nstClock(at);

/** When the recorded minute next comes round: later today, or tomorrow. */
export const nextPoolOpening = (time, at = Date.now()) => nextNstTimeOfDay(time, at);

/** Neopets usernames ignore case, so one account is one key however it is typed. */
export const accountKey = (name) => String(name ?? '').trim().toLowerCase();

// Where the logged-in username can be read, and the element that carries it.
export const ACCOUNT_URL = 'https://www.neopets.com/settings/account';
const USERNAME_ID = 'flag_username';

/**
 * The logged-in account on a parsed settings page, as its key, or null when the
 * page does not say — logged out, or a layout that has moved on. The element
 * may be a form field or plain text, so both are read.
 */
export function readAccountName(doc) {
  const el = doc?.getElementById?.(USERNAME_ID);
  if (!el) return null;
  const key = accountKey(el.value || el.getAttribute?.('value') || el.textContent);
  return key || null;
}

/**
 * Only well-formed account → "HH:MM" pairs survive. Used on anything that did
 * not come from this module, such as an imported backup.
 */
export function cleanPoolTimes(value) {
  const out = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const [account, time] of Object.entries(value)) {
    const key = accountKey(account);
    if (key && isPoolTime(time)) out[key] = time;
  }
  return out;
}
