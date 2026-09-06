// When each daily actually comes back.
//
// Most reset at midnight NST, but a good number do not: Coltzan's runs on a
// 13-hour cooldown from when you last visited, the Snowager wakes in three
// fixed windows, the freebies are monthly, and a handful can be done whenever
// you like. Ticking all of them off at midnight would say a thing is ready
// when it is not, which is worse than not tracking it at all.
//
// Every interval below is taken from the same published guide the URLs in
// dailies.js came from, rather than written from memory:
//   https://www.jellyneo.net/?go=dailies
//
// Keyed by URL and kept apart from the list itself so this table can be
// audited against that page in one pass.

// --- Neopets Standard Time -------------------------------------------------
// NST is US Pacific. Intl carries the DST rules, so nothing here needs a table
// of changeover dates.

const NST_ZONE = 'America/Los_Angeles';
export const DAY_MS = 24 * 60 * 60 * 1000;

const dayFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: NST_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
});

const partsFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: NST_ZONE, hour12: false,
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  weekday: 'short',
});

/** The current Neopets day, as YYYY-MM-DD. */
export const nstDay = (at = Date.now()) => dayFormat.format(new Date(at));

function nstParts(at) {
  const found = {};
  for (const p of partsFormat.formatToParts(new Date(at))) found[p.type] = p.value;
  return {
    year: Number(found.year),
    month: Number(found.month),
    day: Number(found.day),
    // hour12:false renders midnight as 24 in some engines.
    hour: Number(found.hour) % 24,
    minute: Number(found.minute),
    second: Number(found.second),
  };
}

/** The NST wall clock at `at`, expressed as though it were UTC. */
function wallOf(at) {
  const p = nstParts(at);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
}

/**
 * The reverse: a wall-clock instant back to a real timestamp.
 *
 * The offset has to be measured at the answer, not at the guess, or a
 * conversion that straddles a DST change lands an hour out — so measure,
 * apply, and measure again at the result. One correction is always enough
 * because the offset either changed or it did not.
 */
function fromWall(wall, near) {
  const first = wall - (wallOf(near) - near);
  return wall - (wallOf(first) - first);
}

const startOfWallDay = (wall) => {
  const d = new Date(wall);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

/** Midnight NST at the start of the day after `at`. */
export function nextNstMidnight(at = Date.now()) {
  return fromWall(startOfWallDay(wallOf(at)) + DAY_MS, at);
}

/** Midnight NST on the first of the following month. */
export function nextNstMonth(at = Date.now()) {
  const d = new Date(wallOf(at));
  return fromWall(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1), at);
}

/**
 * The start of the next of the given daily windows, in NST hours. Used for the
 * Snowager, which wakes three times a day rather than resetting once.
 */
export function nextWindow(at, hoursOfDay) {
  const wall = wallOf(at);
  const midnight = startOfWallDay(wall);
  const starts = [...hoursOfDay].sort((a, b) => a - b);

  for (const hour of starts) {
    const start = midnight + hour * 3600_000;
    if (start > wall) return fromWall(start, at);
  }
  // Past the last window today, so the first one tomorrow.
  return fromWall(midnight + DAY_MS + starts[0] * 3600_000, at);
}

// --- the rules -------------------------------------------------------------

/** Midnight NST, which is what most dailies do. */
export const NST_MIDNIGHT = { kind: 'nstDay' };

/** A cooldown counted from your own visit, not from the clock. */
export const every = (ms, label) => ({ kind: 'interval', ms, label });
export const minutes = (n) => every(n * 60_000, n === 1 ? 'every minute' : `every ${n} minutes`);
export const hours = (n) => every(n * 3600_000, n === 1 ? 'hourly' : `every ${n} hours`);
export const days = (n) => every(n * DAY_MS, n === 1 ? 'daily' : `every ${n} days`);

export const windows = (...hoursOfDay) => ({ kind: 'windows', hoursOfDay });
export const MONTHLY = { kind: 'month' };

/**
 * No cooldown worth tracking — the stock market, the training schools, your
 * shop till. A tick against these would mean nothing, so they do not get one.
 */
export const ANYTIME = { kind: 'none' };

/**
 * When a tick made at `at` should clear, or null for something untracked.
 */
export function nextResetAfter(at, rule = NST_MIDNIGHT) {
  switch (rule.kind) {
    case 'interval': return at + rule.ms;
    case 'windows': return nextWindow(at, rule.hoursOfDay);
    case 'month': return nextNstMonth(at);
    case 'none': return null;
    default: return nextNstMidnight(at);
  }
}

export const isTracked = (rule = NST_MIDNIGHT) => rule.kind !== 'none';

/** Short text for the settings and tooltips, e.g. "every 13 hours". */
export function describeRule(rule = NST_MIDNIGHT) {
  switch (rule.kind) {
    case 'interval': return rule.label ?? 'on its own timer';
    case 'windows': return 'once per window';
    case 'month': return 'monthly';
    case 'none': return 'anytime';
    default: return 'daily at midnight NST';
  }
}

// --- the table -------------------------------------------------------------
// Only the exceptions are listed. Anything absent resets at midnight NST,
// which covers the large majority.

const RULES = {
  // Wheels.
  'https://www.neopets.com/faerieland/wheel.phtml': hours(2),
  'https://www.neopets.com/prehistoric/mediocrity.phtml': minutes(40),
  'https://www.neopets.com/halloween/wheel/index.phtml': hours(2),

  // Scratchcard kiosks, each on a different cooldown.
  'https://www.neopets.com/desert/sc/kiosk.phtml': hours(4),
  'https://www.neopets.com/halloween/scratch.phtml': hours(2),
  'https://www.neopets.com/winter/kiosk.phtml': hours(6),

  // Cooldowns counted from your visit.
  'https://www.neopets.com/desert/shrine.phtml': hours(13),
  'https://www.neopets.com/faerieland/springs.phtml': minutes(30),
  'https://www.neopets.com/faerieland/poogleracing.phtml': minutes(15),
  'https://www.neopets.com/medieval/symolhole.phtml': hours(1),
  'https://www.neopets.com/halloween/strtest/index.phtml': hours(6),
  'https://www.neopets.com/pirates/buriedtreasure/index.phtml': hours(3),
  'https://www.neopets.com/wishing.phtml': hours(12),
  'https://www.neopets.com/medieval/earthfaerie.phtml': hours(12),
  'https://www.neopets.com/faerieland/darkfaerie.phtml': hours(12),
  'https://www.neopets.com/halloween/braintree.phtml': hours(24),
  'https://www.neopets.com/magma/pool.phtml': days(8),
  // Seven hours seven minutes, which is a joke about the Qasalan calendar and
  // also genuinely the interval.
  'https://www.neopets.com/games/giveaway/giveaway_game.phtml': every(7 * 3600_000 + 7 * 60_000, 'every 7h 7m'),

  // Grave Danger is quoted as a range. Taking the short end means it may say
  // ready before it is, which costs a wasted click; the long end would hide a
  // prize that was waiting, which is worse.
  'https://www.neopets.com/halloween/gravedanger/': hours(4),

  // The Snowager is awake except for three hours a day, and can be raided once
  // in each of them.
  'https://www.neopets.com/winter/snowager.phtml': windows(6, 14, 22),

  'https://www.neopets.com/freebies/': MONTHLY,

  // No cooldown at all — a tick here would be meaningless.
  'https://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true': ANYTIME,
  'https://www.neopets.com/stockmarket.phtml?type=portfolio': ANYTIME,
  'https://www.neopets.com/soupkitchen.phtml': ANYTIME,
  'https://www.neopets.com/space/strangelever.phtml': ANYTIME,
  'https://www.neopets.com/neolodge.phtml': ANYTIME,
  'https://www.neopets.com/halloween/esophagor.phtml': ANYTIME,
  'https://www.neopets.com/island/training.phtml': ANYTIME,
  'https://www.neopets.com/island/fight_training.phtml': ANYTIME,
  'https://www.neopets.com/pirates/academy.phtml': ANYTIME,
  'https://www.neopets.com/faerieland/employ/employment.phtml': ANYTIME,
};

export const resetRuleFor = (url) => RULES[url] ?? NST_MIDNIGHT;
