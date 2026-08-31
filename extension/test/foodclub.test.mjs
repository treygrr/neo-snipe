// Food Club parsing, against pages saved from the live site while logged in.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';

import {
  parseBetPage, parseSets, resolveBet, payout, ARENAS, RISK_LEVELS, FoodClubError,
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
