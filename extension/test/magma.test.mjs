// The Magma Pool: reading the page, the NST minute it was seen open, when that
// minute comes round again, and what an imported backup may carry.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  readPoolState, readPoolDetail, poolTimeAt, nextPoolOpening, cleanPoolTimes, isPoolTime, accountKey,
  MAGMA_POOL_URL, MAGMA_CHECK_MS, MAGMA_LOG, MAGMA_LOG_MAX, withLogEntry, excerptOf,
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

test('the detail names the words that decided it', () => {
  assert.deepEqual(readPoolDetail(CLOSED), { state: 'closed', matched: 'well-versed in the ways of Moltara' });
  assert.deepEqual(readPoolDetail(OPEN), { state: 'open', matched: 'select your Neopet to take a swim in the Magma Pool' });
  assert.deepEqual(readPoolDetail('Shhh... the guard is sleeping.'), { state: 'open', matched: 'the guard is sleeping' });
  assert.deepEqual(readPoolDetail('<form>Log in</form>'), { state: 'unknown', matched: null });
});

test('the log keeps the newest check first and drops the oldest past its cap', () => {
  assert.equal(MAGMA_LOG, 'magmaLog');
  let log = null;
  for (let at = 1; at <= MAGMA_LOG_MAX + 5; at++) log = withLogEntry(log, { at });
  assert.equal(log.length, MAGMA_LOG_MAX);
  assert.equal(log[0].at, MAGMA_LOG_MAX + 5);
  assert.equal(log.at(-1).at, 6);
  // Anything that is not a list starts a new one.
  assert.deepEqual(withLogEntry({ bad: true }, { at: 1 }), [{ at: 1 }]);
});

test('an excerpt is the page text, cut around the words that decided it', () => {
  assert.equal(excerptOf('  a\n\n b  '), 'a b');
  const long = `${'menu '.repeat(200)}${CLOSED}${' footer'.repeat(200)}`;
  const cut = excerptOf(long, 'well-versed in the ways of Moltara', 120);
  assert.ok(cut.includes('well-versed in the ways of Moltara'), cut);
  assert.ok(cut.startsWith('…') && cut.endsWith('…'), cut);
  assert.ok(cut.length <= 122, `${cut.length}`);
  // Nothing matched: from the start.
  assert.ok(excerptOf(long, null, 50).startsWith('menu menu'));
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
import { readAccountName, isAccountPage, ACCOUNT_URL } from '../src/lib/magma.js';

const page = (body) => parseHTML(`<!doctype html><html><body>${body}</body></html>`).document;

test('the username is read from the markup Neopets actually serves', () => {
  // Captured from https://www.neopets.com/settings/account.
  assert.equal(readAccountName(page('<div class="settings-ro" id="flag_username" title="vothex">vothex</div>')), 'vothex');
  // The same name is in `title`, so empty text still yields it.
  assert.equal(readAccountName(page('<div class="settings-ro" id="flag_username" title="vothex"></div>')), 'vothex');
});

// The settings page as a fetch receives it (trimmed from a real response): the
// username div is drawn later by script, so only the site header names the account.
const SERVED = `
  <script type="text/javascript">
  var appInsightsUserName = 'vothex';
  var userIDApp = appInsightsUserName.replace(/[,;=| ]+/g, "_");
  </script>
  <div class="nav-profile-dropdown__2020 nav-toggle-dropdown__2020" id="navprofiledropdown__2020">
    <div class='nav-profile-dropdown-text' style='margin-top:15px'>Welcome, <a href="/userlookup.phtml?user=vothex" class="text-muted">vothex</a></div>
    <div class='nav-profile-dropdown-text'>Active Pet: <a href="/petlookup.phtml?pet=Testeh" class='profile-dropdown-link'>Testeh</a></div>
  </div>
  <div id="app"></div>`;

test('the fetched settings page, with no #flag_username yet, still names the account', () => {
  assert.equal(readAccountName(page(SERVED)), 'vothex');
  // Either header source alone is enough.
  assert.equal(readAccountName(page(SERVED.replace(/<script[\s\S]*?<\/script>/, ''))), 'vothex');
  assert.equal(readAccountName(page(SERVED.replace(/Welcome, <a[^>]*>vothex<\/a>/, 'Welcome'))), 'vothex');
});

test("another user's lookup link is never taken for the account", () => {
  assert.equal(readAccountName(page('<td><a href="/userlookup.phtml?user=shopowner">shopowner</a></td>')), null);
});

test('the settings page is recognised with or without its trailing slash', () => {
  assert.ok(isAccountPage('https://www.neopets.com/settings/account'));
  assert.ok(isAccountPage('https://www.neopets.com/settings/account/'));
  assert.ok(!isAccountPage('https://www.neopets.com/settings/privacy/'));
});

test('the username is read from #flag_username, as a field or as text', () => {
  assert.equal(ACCOUNT_URL, 'https://www.neopets.com/settings/account/');
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
