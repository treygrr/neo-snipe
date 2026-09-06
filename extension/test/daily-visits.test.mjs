// The parts that can be wrong without anyone noticing: which Neopets day it is,
// whether the page you are on is a daily, and when each one comes back.
// it is, and whether the page you are on is a daily.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nstDay, formatCountdown, dailyUrlFor, expiryOf } from '../src/lib/daily-visits.js';
import {
  nextNstMidnight, nextNstMonth, nextWindow, nextResetAfter, resetRuleFor,
  isTracked, hours, windows, MONTHLY, ANYTIME,
} from '../src/lib/reset-rules.js';

const at = (iso) => Date.parse(iso);

test('the Neopets day is the Pacific one, not the local or UTC one', () => {
  // 03:30 UTC on the 7th is still the 6th in California, which is the whole
  // reason this is not just toISOString().slice(0, 10).
  assert.equal(nstDay(at('2026-09-07T03:30:00Z')), '2026-09-06');
  assert.equal(nstDay(at('2026-09-07T07:30:00Z')), '2026-09-07');
});

test('the day rolls over at midnight Pacific in winter too', () => {
  // PST is UTC-8, so the rollover moves an hour later in UTC terms.
  assert.equal(nstDay(at('2026-01-07T07:30:00Z')), '2026-01-06');
  assert.equal(nstDay(at('2026-01-07T08:30:00Z')), '2026-01-07');
});

test('midnight NST is the instant the day string changes', () => {
  const justBefore = at('2026-09-07T06:59:00Z'); // 23:59 NST
  const midnight = nextNstMidnight(justBefore);
  assert.equal(nstDay(midnight - 1000), '2026-09-06');
  assert.equal(nstDay(midnight), '2026-09-07');
});

test('midnight is found correctly across both DST changeovers', () => {
  // Spring forward: 2am NST on 8 March 2026 does not exist, but midnight does.
  const spring = nextNstMidnight(at('2026-03-07T20:00:00Z'));
  assert.equal(nstDay(spring), '2026-03-08');
  assert.equal(nstDay(spring - 1000), '2026-03-07');

  // Fall back: 1am NST on 1 November 2026 happens twice.
  const autumn = nextNstMidnight(at('2026-10-31T20:00:00Z'));
  assert.equal(nstDay(autumn), '2026-11-01');
  assert.equal(nstDay(autumn - 1000), '2026-10-31');
});

test('a cooldown counts from your visit, not from the clock', () => {
  const visited = at('2026-09-07T03:00:00Z'); // 20:00 NST
  const rule = hours(13);
  assert.equal(nextResetAfter(visited, rule) - visited, 13 * 3600_000);
  // Which is the whole point: this one is still on cooldown well after the
  // midnight that would have cleared it under the old scheme.
  assert.ok(nextResetAfter(visited, rule) > nextNstMidnight(visited));
});

test('a window rule waits for the next window, not the next day', () => {
  // Snowager: 6am, 2pm and 10pm NST. Raided just after the 6am one opens...
  const morning = at('2026-09-06T13:30:00Z'); // 06:30 NST
  const next = nextWindow(morning, [6, 14, 22]);
  assert.equal(nstDay(next), '2026-09-06', 'should still be the same day');
  assert.ok(next - morning < 8 * 3600_000, 'should be the 2pm window, not tomorrow');

  // ...and after the last window of the day, it rolls to tomorrow's first.
  const night = at('2026-09-07T05:30:00Z'); // 22:30 NST
  assert.equal(nstDay(nextWindow(night, [6, 14, 22])), '2026-09-07');
});

test('a monthly rule holds until the first of the next month', () => {
  const claimed = at('2026-09-06T15:00:00Z');
  const next = nextNstMonth(claimed);
  assert.equal(nstDay(next), '2026-10-01');
  assert.equal(nstDay(next - 1000), '2026-09-30');
});

test('something with no cooldown is not tracked and never expires', () => {
  assert.equal(nextResetAfter(Date.now(), ANYTIME), null);
  assert.equal(isTracked(ANYTIME), false);
  assert.equal(isTracked(hours(2)), true);
  assert.equal(isTracked(MONTHLY), true);
});

test('the real table wires the awkward dailies to the right rules', () => {
  const now = at('2026-09-06T15:00:00Z');
  const after = (url) => expiryOf(url, now) - now;

  // Coltzan's is thirteen hours, not midnight.
  assert.equal(after('https://www.neopets.com/desert/shrine.phtml'), 13 * 3600_000);
  // The three kiosks are deliberately different from each other.
  assert.equal(after('https://www.neopets.com/desert/sc/kiosk.phtml'), 4 * 3600_000);
  assert.equal(after('https://www.neopets.com/halloween/scratch.phtml'), 2 * 3600_000);
  assert.equal(after('https://www.neopets.com/winter/kiosk.phtml'), 6 * 3600_000);
  // The Snowager waits for a window.
  assert.equal(resetRuleFor('https://www.neopets.com/winter/snowager.phtml').kind, 'windows');
  // The freebies are monthly.
  assert.equal(nstDay(expiryOf('https://www.neopets.com/freebies/', now)), '2026-10-01');
  // The stock market is not something you finish.
  assert.equal(expiryOf('https://www.neopets.com/stockmarket.phtml?type=portfolio', now), null);
  // Anything not in the table falls back to midnight.
  assert.equal(
    expiryOf('https://www.neopets.com/medieval/grumpyking.phtml', now),
    nextNstMidnight(now),
  );
});

test('the countdown reads as hours and minutes', () => {
  assert.equal(formatCountdown(6 * 3600_000 + 12 * 60_000), '6h 12m');
  assert.equal(formatCountdown(12 * 60_000), '12m');
  assert.equal(formatCountdown(-5), '0m');
  // The magma pool is eight days away, which is nobody's idea of "192h".
  assert.equal(formatCountdown(8 * 24 * 3600_000), '8d');
});

test('a daily page is recognised however you arrived at it', () => {
  assert.equal(
    dailyUrlFor('https://www.neopets.com/desert/shrine.phtml'),
    'https://www.neopets.com/desert/shrine.phtml',
  );
  // Neopets hangs its own parameters off links; ours still match.
  assert.equal(
    dailyUrlFor('https://www.neopets.com/desert/shrine.phtml?ref=nav'),
    'https://www.neopets.com/desert/shrine.phtml',
  );
  // Trailing slashes are not meaningful in these paths.
  assert.equal(
    dailyUrlFor('https://www.neopets.com/shenkuu/lunar'),
    'https://www.neopets.com/shenkuu/lunar/',
  );
});

test('dailies sharing a path are told apart by their own parameters', () => {
  assert.equal(
    dailyUrlFor('https://www.neopets.com/stockmarket.phtml?type=portfolio'),
    'https://www.neopets.com/stockmarket.phtml?type=portfolio',
  );
  assert.equal(
    dailyUrlFor('https://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true'),
    'https://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true',
  );
  // The shop of offers is only the Rich Slorg with the payout parameter.
  assert.equal(dailyUrlFor('https://www.neopets.com/shop_of_offers.phtml'), null);
  assert.equal(
    dailyUrlFor('https://www.neopets.com/shop_of_offers.phtml?slorg_payout=yes'),
    'https://www.neopets.com/shop_of_offers.phtml?slorg_payout=yes',
  );
});

test('pages that are not dailies, and hosts that are not Neopets, do not count', () => {
  assert.equal(dailyUrlFor('https://www.neopets.com/inventory.phtml'), null);
  assert.equal(dailyUrlFor('https://items.jellyneo.net/desert/shrine.phtml'), null);
  assert.equal(dailyUrlFor('not a url'), null);
});
