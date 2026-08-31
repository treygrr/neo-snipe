// Food Club: reading the bet page and the daily sets, and turning them into
// bets that can be pre-filled into Neopets' own form.
//
// Verified against the live pages (fixtures in test/fixtures/foodclub/).
// The bet form is a POST to process_foodclub.phtml, so a bet cannot be placed
// by following a link — we fill the form and leave the user to submit it.

export const BET_URL = 'https://www.neopets.com/pirates/foodclub.phtml?type=bet';
export const SETS_URL = 'https://www.neopets.com/~Shrmsh';

export const ARENAS = ['Shipwreck', 'Lagoon', 'Treasure Island', 'Hidden Cove', "Harpoon Harry's"];

export const RISK_LEVELS = [
  { id: 'beginner', label: 'Beginner', blurb: 'Safest. Small bankroll, or new to Food Club.' },
  { id: 'standard', label: 'Standard', blurb: 'The middle ground.' },
  { id: 'aggressive', label: 'Aggressive', blurb: 'Higher variance for higher return.' },
  { id: 'adventurous', label: 'Adventurous', blurb: 'Highest variance. Expect losing streaks.' },
];

export class FoodClubError extends Error {
  constructor(what) {
    super(what);
    this.name = 'FoodClubError';
  }
}

const clean = (s) => String(s ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

/**
 * The bet page: your per-bet limit, and every arena's pirates with their odds.
 * Pirate ids come from the select option values, which is what the form posts.
 */
export function parseBetPage(doc) {
  const maxText = doc.body?.textContent || '';
  const maxBet = Number((maxText.match(/place up to\s*([\d,]+)\s*NeoPoints/i) || [])[1]?.replace(/,/g, ''));
  const daysPlayed = Number((maxText.match(/\(([\d,]+)\s*days\)/i) || [])[1]?.replace(/,/g, '')) || null;

  const arenas = [1, 2, 3, 4, 5].map((n) => {
    const select = doc.querySelector(`select[name="winner${n}"]`);
    if (!select) throw new FoodClubError(`arena ${n} is missing from the bet page`);

    const pirates = [...select.options]
      .filter((o) => o.value)
      .map((o) => {
        const text = clean(o.textContent);
        const odds = Number((text.match(/\((\d+):1\)/) || [])[1]);
        return { id: o.value, name: clean(text.replace(/\s*\(\d+:1\)\s*$/, '')), odds: odds || null };
      });

    if (!pirates.length) throw new FoodClubError(`arena ${n} has no pirates — is the round open?`);
    return { index: n, name: ARENAS[n - 1], pirates };
  });

  if (!Number.isFinite(maxBet)) throw new FoodClubError('could not read your maximum bet');
  return { maxBet, daysPlayed, arenas };
}

/**
 * The sets page publishes one table per risk level: a header row of arena
 * names, then one row per bet with a pirate name (or blank) per arena.
 */
export function parseSets(doc) {
  const sets = {};

  for (const { id } of RISK_LEVELS) {
    const heading = doc.getElementById(id);
    if (!heading) continue;

    let node = heading.nextElementSibling;
    let table = null;
    for (let i = 0; i < 8 && node && !table; i++, node = node.nextElementSibling) {
      table = node.tagName === 'TABLE' ? node : node.querySelector?.('table');
    }
    if (!table) continue;

    const rows = [...table.querySelectorAll('tr')];
    const header = rows[0] ? [...rows[0].children].map((c) => clean(c.textContent)) : [];
    // Only trust the table if its columns really are the five arenas.
    if (!ARENAS.every((a, i) => header[i] === a)) continue;

    const bets = rows.slice(1).map((row) => {
      const cells = [...row.children].map((c) => clean(c.textContent));
      return cells
        .map((name, i) => (name ? { arena: i + 1, pirateName: name } : null))
        .filter(Boolean);
    }).filter((bet) => bet.length);

    if (bets.length) sets[id] = bets;
  }

  if (!Object.keys(sets).length) throw new FoodClubError("could not read today's sets");
  return sets;
}

/**
 * Matches a set's pirate names to the ids and odds on the bet page. A name
 * that does not match is left unresolved rather than guessed at — a wrong
 * pirate is a wrong bet with real Neopoints on it.
 */
export function resolveBet(bet, arenas) {
  const picks = bet.map(({ arena, pirateName }) => {
    const found = arenas[arena - 1]?.pirates.find(
      (p) => p.name.toLowerCase() === pirateName.toLowerCase(),
    );
    return {
      arena,
      arenaName: ARENAS[arena - 1],
      pirateName,
      pirateId: found?.id ?? null,
      odds: found?.odds ?? null,
    };
  });

  const resolved = picks.every((p) => p.pirateId);
  const totalOdds = resolved ? picks.reduce((n, p) => n * (p.odds || 1), 1) : null;
  return { picks, resolved, totalOdds };
}

export const payout = (totalOdds, amount) =>
  (totalOdds && amount ? totalOdds * amount : null);
