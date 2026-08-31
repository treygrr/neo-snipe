// Food Club parsing, against pages saved from the live site while logged in.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';

import {
  parseBetPage, parseSets, resolveBet, payout, ARENAS, RISK_LEVELS, FoodClubError,
  placeBetUrl, WINNINGS_CAP, placementRefusal, wasPlaced, parseCurrentBets, betNameKey,
} from '../src/lib/foodclub.js';

const doc = (f) => parseHTML(`<html><body>${readFileSync(resolve('test/fixtures/foodclub', f), 'utf8')}</body></html>`).document;

test('bet page: max bet, arenas, pirates and odds', () => {
  const { maxBet, daysPlayed, arenas } = parseBetPage(doc('bet-page.html'));

  assert.equal(maxBet, 10540);
  assert.equal(daysPlayed, 5245);
  // The stated formula, as a sanity check on the parse.
  assert.equal(maxBet, 50 + 2 * daysPlayed);

  assert.equal(arenas.length, 5);
  assert.deepEqual(arenas.map((a) => a.name), ARENAS);

  const shipwreck = arenas[0];
  assert.ok(shipwreck.pirates.length >= 4);
  const stripey = shipwreck.pirates.find((p) => p.name === "Ol' Stripey");
  assert.ok(stripey, 'expected Ol\' Stripey in Shipwreck');
  assert.equal(stripey.id, '12', 'the id is what the form posts');
  assert.equal(stripey.odds, 2);

  // Every pirate must have an id and odds, or a bet built from them is wrong.
  for (const arena of arenas) {
    for (const p of arena.pirates) {
      assert.ok(p.id, `${arena.name}: ${p.name} has no id`);
      assert.ok(p.odds > 0, `${arena.name}: ${p.name} has no odds`);
    }
  }
});

test('sets page: one table per risk level', () => {
  const sets = parseSets(doc('sets-page.html'));

  for (const { id } of RISK_LEVELS) {
    assert.ok(sets[id], `missing the ${id} set`);
    assert.ok(sets[id].length > 0, `${id} has no bets`);
    for (const bet of sets[id]) {
      assert.ok(bet.length >= 1 && bet.length <= 5, `${id}: a bet covers 1-5 arenas`);
      for (const pick of bet) {
        assert.ok(pick.arena >= 1 && pick.arena <= 5);
        assert.ok(pick.pirateName.length > 2);
      }
    }
  }
});

test('a set resolves to real pirate ids and odds', () => {
  const { arenas } = parseBetPage(doc('bet-page.html'));
  const sets = parseSets(doc('sets-page.html'));

  let resolvedBets = 0;
  for (const [level, bets] of Object.entries(sets)) {
    for (const bet of bets) {
      const r = resolveBet(bet, arenas);
      assert.ok(r.picks.length, `${level}: no picks`);
      if (r.resolved) {
        resolvedBets++;
        assert.ok(r.totalOdds >= 1);
        for (const p of r.picks) assert.match(p.pirateId, /^\d+$/);
      }
    }
  }
  // Today's sets and today's odds come from the same round, so they must match.
  assert.ok(resolvedBets > 10, `expected most bets to resolve, got ${resolvedBets}`);
});

test('an unknown pirate name is reported, never guessed', () => {
  const { arenas } = parseBetPage(doc('bet-page.html'));
  const r = resolveBet([{ arena: 1, pirateName: 'Captain Nobody' }], arenas);

  assert.equal(r.resolved, false);
  assert.equal(r.picks[0].pirateId, null);
  assert.equal(r.totalOdds, null, 'no odds without a real pirate');
});

test('payout multiplies odds by the stake', () => {
  assert.equal(payout(24, 1000), 24000);
  assert.equal(payout(null, 1000), null);
  assert.equal(payout(24, 0), null);
});

test('a page without a bet form fails loudly', () => {
  assert.throws(() => parseBetPage(parseHTML('<html><body><p>Come back later</p></body></html>').document),
    FoodClubError);
});

// The place-bet URL. Shape read out of neofood.club's own bundle: winner<n>
// then matches[] for the arenas bet on, then amount, odds, winnings, type.
const PICKS = [
  { arena: 1, pirateId: '2', odds: 4 },
  { arena: 3, pirateId: '7', odds: 3 },
];

test('place URL carries the bet on the query string', () => {
  const url = placeBetUrl({ picks: PICKS, amount: 500, totalOdds: 12 });
  assert.equal(url, 'https://www.neopets.com/pirates/process_foodclub.phtml'
    + '?winner1=2&winner3=7&matches[]=1&matches[]=3'
    + '&bet_amount=500&total_odds=12&winnings=6000&type=bet');
});

test('place URL names only the arenas actually bet on', () => {
  const url = placeBetUrl({ picks: PICKS, amount: 50, totalOdds: 12 });
  for (const n of [2, 4, 5]) assert.ok(!url.includes(`winner${n}=`), `arena ${n} should be absent`);
  assert.equal(url.match(/matches\[\]/g).length, 2);
});

test('winnings are capped the way Neopets caps them', () => {
  const url = placeBetUrl({ picks: PICKS, amount: 10000, totalOdds: 1000 });
  assert.ok(url.includes(`winnings=${WINNINGS_CAP}`), url);
  assert.ok(url.includes('total_odds=1000'), 'the real odds are still sent');
});

test('an unresolved or unpriced bet produces no URL to place', () => {
  assert.equal(placeBetUrl({ picks: [{ arena: 1, pirateId: null }], amount: 50, totalOdds: 4 }), null);
  assert.equal(placeBetUrl({ picks: PICKS, amount: 0, totalOdds: 4 }), null);
  assert.equal(placeBetUrl({ picks: PICKS, amount: 50, totalOdds: null }), null);
});

test('a placed bet is one that redirected to the current-bets page', () => {
  assert.equal(wasPlaced({
    redirected: true,
    url: 'https://www.neopets.com/pirates/foodclub.phtml?type=current_bets',
  }), true);
});

test('anything short of that redirect is not a placed bet', () => {
  // Came back as a page rather than a redirect.
  assert.equal(wasPlaced({
    redirected: false,
    url: 'https://www.neopets.com/pirates/foodclub.phtml?type=current_bets',
  }), false);
  // Redirected, but somewhere else — bounced to the bet form, or to a login.
  assert.equal(wasPlaced({
    redirected: true,
    url: 'https://www.neopets.com/pirates/foodclub.phtml?type=bet',
  }), false);
  assert.equal(wasPlaced({ redirected: true, url: 'https://www.neopets.com/login.phtml' }), false);
  assert.equal(wasPlaced({}), false);
  assert.equal(wasPlaced({ redirected: true, url: 'not a url' }), false);
});

test('a refusal is reported in Neopets\' own words', () => {
  const html = readFileSync(resolve('test/fixtures/foodclub', 'refused.html'), 'utf8');
  const message = placementRefusal(html);
  assert.equal(message,
    'Sorry. We were unable to place your bet. '
    + 'Please note that you cannot place the same bet more than once!');
  // The block's own "Error:" label is not part of the sentence.
  assert.ok(!/^error:/i.test(message), message);
  // Nothing from the stylesheet above it leaks in.
  assert.ok(!/font-family|errorOuter/.test(message), message);
});

test('a refusal nobody recognises still says the bet did not go through', () => {
  assert.match(placementRefusal('<html><body>Something unexpected.</body></html>'), /did not accept/i);
  assert.match(placementRefusal(''), /did not accept/i);
});

test('current bets: one entry per placed bet, with its arenas and pirates', () => {
  const bets = parseCurrentBets(doc('current-bets.html'));
  assert.equal(bets.length, 5);
  assert.deepEqual(bets[0], {
    round: '9978',
    picks: [
      { arena: 2, pirateName: 'Scurvy Dan the Blade' },
      { arena: 3, pirateName: 'Admiral Blackbeard' },
    ],
  });
});

test('current bets: the lines are split, not run together', () => {
  // The cell separates arenas with <br>, which contributes no whitespace — so
  // reading textContent gives "...the BladeTreasure Island: ...".
  const names = parseCurrentBets(doc('current-bets.html'))
    .flatMap((b) => b.picks.map((p) => p.pirateName));
  for (const name of names) {
    assert.ok(!/(Lagoon|Treasure Island|Harpoon)/.test(name), name);
    assert.ok(!name.startsWith(':'), name);
  }
});

test('current bets: the header rows are not bets', () => {
  const rounds = parseCurrentBets(doc('current-bets.html')).map((b) => b.round);
  assert.deepEqual([...new Set(rounds)], ['9978']);
});

test('a page with no bet table yields no bets', () => {
  assert.deepEqual(parseCurrentBets(doc('sets-page.html')), []);
});

test('a placed bet matches a set bet by name, whichever order the picks are in', () => {
  const placed = parseCurrentBets(doc('current-bets.html'))[0];
  const mine = {
    picks: [
      // Same bet, listed the other way round and differently cased.
      { arena: 3, pirateName: 'admiral blackbeard', pirateId: '7' },
      { arena: 2, pirateName: 'Scurvy Dan the Blade', pirateId: '3' },
    ],
  };
  assert.equal(betNameKey(mine), betNameKey(placed));
});

test('a different bet does not match', () => {
  const placed = parseCurrentBets(doc('current-bets.html'))[0];
  const other = { picks: [{ arena: 2, pirateName: 'Buck Cutlass' }] };
  assert.notEqual(betNameKey(other), betNameKey(placed));
});

test('current bets: a bet on one arena is still a bet', () => {
  const single = parseCurrentBets(doc('current-bets.html')).filter((b) => b.picks.length === 1);
  assert.equal(single.length, 1);
  assert.deepEqual(single[0].picks, [{ arena: 3, pirateName: 'Lucky McKyriggan' }]);
});

test('current bets: the Total Possible Winnings row is not a bet', () => {
  // It spans four columns, so it has two cells rather than five.
  const bets = parseCurrentBets(doc('current-bets.html'));
  assert.ok(bets.every((b) => b.picks.length), 'every bet has picks');
  assert.ok(!JSON.stringify(bets).includes('Total'), 'no bet came from the totals row');
});
