// Food Club: reading the bet page and the daily sets, and turning them into
// bets that can be pre-filled into Neopets' own form.
//
// Verified against the live pages (fixtures in test/fixtures/foodclub/).
// Bets are placed by requesting process_foodclub.phtml, which takes the whole
// bet on the query string — see placeBetUrl.

export const BET_URL = 'https://www.neopets.com/pirates/foodclub.phtml?type=bet';
export const CURRENT_BETS_URL = 'https://www.neopets.com/pirates/foodclub.phtml?type=current_bets';
export const COLLECT_URL = 'https://www.neopets.com/pirates/foodclub.phtml?type=collect';
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
 * The round number, so "done" marks reset when a new round opens rather than
 * carrying over onto a different set of bets.
 */
export function parseRound(doc) {
  const m = (doc.body?.textContent || '').match(/Round\s+(\d+)/i);
  return m ? m[1] : null;
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

/**
 * The bets already placed this round, from `?type=current_bets`.
 *
 * The table is one row per bet: round, then a cell of `<b>Arena</b>: Pirate`
 * lines separated by `<br>`, then amount, odds and winnings. Captured live —
 * the fixture is test/fixtures/foodclub/current-bets.html.
 *
 * The arena/pirate pairs are read from the `<b>` elements and the text that
 * follows each, rather than from the cell's text: `textContent` runs the lines
 * together ("...Scurvy Dan the BladeTreasure Island:..."), because the breaks
 * are `<br>` elements and contribute no whitespace of their own.
 */
export function parseCurrentBets(doc) {
  const table = [...doc.querySelectorAll('table')].filter(
    (t) => /Bet Info/i.test(t.textContent),
  ).pop();
  if (!table) return [];

  const bets = [];
  for (const row of table.querySelectorAll('tr')) {
    const cells = [...row.children];
    if (cells.length < 5) continue;

    const round = cells[0].textContent.trim();
    if (!/^\d+$/.test(round)) continue; // the two header rows

    const picks = [];
    for (const b of cells[1].querySelectorAll('b')) {
      const arena = ARENAS.indexOf(clean(b.textContent).replace(/:$/, ''));
      if (arena < 0) continue;

      // Everything up to the next <br> or <b> is this arena's pirate.
      let pirateName = '';
      for (let n = b.nextSibling; n; n = n.nextSibling) {
        if (n.nodeType === 1 && /^(BR|B)$/.test(n.tagName)) break;
        pirateName += n.textContent || '';
      }
      pirateName = clean(pirateName).replace(/^:\s*/, '');
      if (pirateName) picks.push({ arena: arena + 1, pirateName });
    }

    if (picks.length) bets.push({ round, picks });
  }
  return bets;
}

/**
 * A bet is identified by what it actually bets on, so the same picks are the
 * same bet whichever risk level lists them.
 */
export const betId = (bet) =>
  (bet.picks || bet).map((p) => `${p.arena}:${p.pirateId ?? p.pirateName}`).sort().join(',');

/**
 * The same bet keyed by pirate *name*, for comparing against the current-bets
 * page — which lists names and never the ids the form posts.
 */
export const betNameKey = (bet) =>
  (bet.picks || bet)
    .map((p) => `${p.arena}:${String(p.pirateName ?? '').toLowerCase()}`)
    .sort()
    .join(',');

export const payout = (totalOdds, amount) =>
  (totalOdds && amount ? totalOdds * amount : null);

// Neopets pays at most this much on one bet, however good the odds.
export const WINNINGS_CAP = 1_000_000;

/**
 * A bet as a link. `process_foodclub.phtml` accepts the whole bet on the query
 * string, so a bet can be placed by opening a URL rather than by filling and
 * submitting the form.
 *
 * The shape is taken from neofood.club's own Place-bet button, read out of its
 * bundle rather than guessed: `winner<n>` only for the arenas being bet on,
 * a `matches[]` entry per those arenas, then the amount, the odds and the
 * winnings the site expects to pay — capped, as it caps them.
 */
export function placeBetUrl({ picks, amount, totalOdds }) {
  const live = picks.filter((p) => p.pirateId);
  if (!live.length || !amount || !totalOdds) return null;

  const params = [
    ...live.map((p) => `winner${p.arena}=${encodeURIComponent(p.pirateId)}`),
    ...live.map((p) => `matches[]=${p.arena}`),
    `bet_amount=${amount}`,
    `total_odds=${totalOdds}`,
    `winnings=${Math.min(totalOdds * amount, WINNINGS_CAP)}`,
    'type=bet',
  ];
  return `https://www.neopets.com/pirates/process_foodclub.phtml?${params.join('&')}`;
}

/**
 * A placed bet is a 302 to the current-bets page; a refused one comes back as
 * a page. `fetch` follows the redirect, so what is left to check is where the
 * response ended up. This is a positive test for success: anything that did
 * not redirect there was not placed, whether or not we can name the reason.
 */
export function wasPlaced(res) {
  if (!res?.redirected || !res.url) return false;
  try {
    const { pathname, searchParams } = new URL(res.url);
    return pathname === '/pirates/foodclub.phtml' && searchParams.get('type') === 'current_bets';
  } catch {
    return false;
  }
}

/**
 * Why a bet that did not go through did not go through. Only consulted once
 * `wasPlaced` has said no, so its job is to name the reason, not to decide.
 */
// A refused bet answers 200 with Neopets' standard error block:
//   <div class="errorMessage"><b>Error: </b>Sorry. We were unable to place your
//   bet.<br>Please note that you cannot place the same bet more than once!</div>
// Captured from a live refusal, so the reason shown is Neopets' own wording
// rather than a phrase of ours matched against theirs.
const ERROR_BLOCK = /<div[^>]*class=["'][^"']*errorMessage[^"']*["'][^>]*>([\s\S]*?)<\/div>/i;

const strip = (html) => String(html ?? '')
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export function placementRefusal(html) {
  const block = ERROR_BLOCK.exec(String(html ?? ''));
  // The block opens with a bold "Error:" label, which the message repeats.
  const message = block && strip(block[1]).replace(/^error:\s*/i, '');
  return message || 'Neopets did not accept that bet.';
}
