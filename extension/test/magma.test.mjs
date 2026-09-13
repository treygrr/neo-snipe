// The Magma Pool: reading the page, the NST minute it was seen open, when that
// minute comes round again, and what an imported backup may carry.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  readPoolState, poolTimeAt, nextPoolOpening, cleanPoolTimes, isPoolTime, accountKey,
  MAGMA_POOL_URL, MAGMA_CHECK_MS,
} from '../src/lib/magma.js';

// The page's own words, as they appear on neopets.com.
const CLOSED = "I'm sorry, only those well-versed in the ways of Moltara are permitted to enter the Pool. Learn more and try again later.";
const OPEN = "Shhh... Look! The gaurde is sleeping. Maybe you can sneak by him if you're very, very careful... Please select your Neopet to take a swim in the Magma Pool and be painted Magma.";

test('the refusal reads as closed', () => {
  assert.equal(readPoolState(`<html><body><p>${CLOSED}</p></body></html>`), 'closed');
});

test('the sleeping guard reads as open, however "guard" is spelt', () => {
  assert.equal(readPoolState(OPEN), 'open');
  assert.equal(readPoolState(OPEN.replace('gaurde', 'guard')), 'open');
  // Either sentence alone is enough.
  assert.equal(readPoolState('Please select your Neopet to take a swim in the Magma Pool'), 'open');
});

test('anything else is unknown, never open', () => {
  assert.equal(readPoolState('<form action="/login.phtml">Log in</form>'), 'unknown');
  assert.equal(readPoolState(''), 'unknown');
  assert.equal(readPoolState(null), 'unknown');
});

test('a check interval no longer than the ten-minute window', () => {
  assert.ok(MAGMA_CHECK_MS <= 10 * 60_000);
  assert.equal(MAGMA_POOL_URL, 'https://www.neopets.com/magma/pool.phtml');
});

test('the time recorded is the NST minute, through daylight saving', () => {
  // September: NST is UTC-7.
  assert.equal(poolTimeAt(Date.parse('2026-09-13T21:23:45Z')), '14:23');
  // January: NST is UTC-8.
  assert.equal(poolTimeAt(Date.parse('2026-01-15T22:05:00Z')), '14:05');
  // Midnight renders as 00, not 24.
  assert.equal(poolTimeAt(Date.parse('2026-09-14T07:02:00Z')), '00:02');
});

test('the next opening is later today, or tomorrow once it has gone', () => {
  const at = Date.parse('2026-09-13T21:00:00Z'); // 14:00 NST
  assert.equal(new Date(nextPoolOpening('14:23', at)).toISOString(), '2026-09-13T21:23:00.000Z');

  const after = Date.parse('2026-09-13T21:30:00Z'); // 14:30 NST
  assert.equal(new Date(nextPoolOpening('14:23', after)).toISOString(), '2026-09-14T21:23:00.000Z');
});

test('the next opening holds the NST minute across the clocks going back', () => {
  // 2026-10-31 14:30 PDT; daylight saving ends overnight, so tomorrow's 14:23
  // NST is an hour later in UTC than today's was.
  const at = Date.parse('2026-10-31T21:30:00Z');
  assert.equal(new Date(nextPoolOpening('14:23', at)).toISOString(), '2026-11-01T22:23:00.000Z');
});

test('pool times are validated strictly', () => {
  assert.ok(isPoolTime('00:00'));
  assert.ok(isPoolTime('23:59'));
  assert.ok(!isPoolTime('24:00'));
  assert.ok(!isPoolTime('9:05'));
  assert.ok(!isPoolTime(1423));
});

test('accounts are one key whatever the case', () => {
  assert.equal(accountKey('  SomeUser '), 'someuser');
});

// --- the logged-in account, from /settings/account ----------------------------
import { parseHTML } from 'linkedom';
import { readAccountName, ACCOUNT_URL } from '../src/lib/magma.js';

const page = (body) => parseHTML(`<!doctype html><html><body>${body}</body></html>`).document;

test('the username is read from #flag_username, as a field or as text', () => {
  assert.equal(ACCOUNT_URL, 'https://www.neopets.com/settings/account');
  assert.equal(readAccountName(page('<input id="flag_username" value="MainAcct">')), 'mainacct');
  assert.equal(readAccountName(page('<span id="flag_username"> SideAcct </span>')), 'sideacct');
});

test('no username means no account, never a guess', () => {
  assert.equal(readAccountName(page('<form action="/login.phtml"></form>')), null);
  assert.equal(readAccountName(page('<span id="flag_username">   </span>')), null);
  assert.equal(readAccountName(null), null);
});

test('an imported map keeps only well-formed account times', () => {
  assert.deepEqual(
    cleanPoolTimes({ SomeUser: '14:23', other: '25:00', '': '10:00', third: 1423, fourth: '03:07' }),
    { someuser: '14:23', fourth: '03:07' },
  );
  assert.deepEqual(cleanPoolTimes(null), {});
  assert.deepEqual(cleanPoolTimes(['14:23']), {});
  assert.deepEqual(cleanPoolTimes('14:23'), {});
});
