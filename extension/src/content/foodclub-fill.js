import { api } from '../lib/ext-api.js';

export const PENDING_KEY = 'pendingBet';
const MAX_AGE_MS = 5 * 60 * 1000;

export const onBetPage = (url = location.href) =>
  /\/pirates\/foodclub\.phtml/i.test(url) && /type=bet/i.test(url);

/**
 * Fills Neopets' own bet form. It submits only when explicitly told to, by a
 * bet marked `submit` — which is what the panel's Place button sets and its
 * Fill button does not.
 *
 * total_odds and winnings are computed by the page's own script, wired to the
 * select's onchange and the checkbox's onclick. Setting values silently would
 * post total_odds=0, so we drive those handlers instead of assigning directly.
 */
export function fillBetForm(doc, bet) {
  const form = doc.querySelector('form[name="bet_form"]')
    || doc.querySelector('form[action*="process_foodclub"]');
  if (!form) return { ok: false, reason: 'no_form' };

  const boxes = [...form.querySelectorAll('input[name="matches[]"]')];
  const amount = form.querySelector('input[name="bet_amount"]');
  if (boxes.length !== 5 || !amount) return { ok: false, reason: 'unexpected_form' };

  // Clear whatever was there, so a previous bet cannot bleed into this one.
  // Clicking a checked box runs reset_odds for that arena.
  for (const box of boxes) if (box.checked) box.click();
  for (let n = 1; n <= 5; n++) {
    const select = form.querySelector(`select[name="winner${n}"]`);
    if (select) select.value = '';
  }

  const applied = [];
  for (const pick of bet.picks) {
    const select = form.querySelector(`select[name="winner${pick.arena}"]`);
    const box = boxes[pick.arena - 1];
    if (!select || !box) continue;

    // Set the pirate first: the checkbox handler reads the current selection.
    select.value = pick.pirateId;
    if (select.value !== String(pick.pirateId)) continue; // pirate not on this page
    if (!box.checked) box.click();
    applied.push(pick.arena);
  }

  if (!applied.length) return { ok: false, reason: 'no_pirates_matched' };

  // focus/blur so the page's onblur recalculates the winnings field.
  amount.focus();
  amount.value = String(bet.amount);
  amount.blur();

  form.scrollIntoView?.({ behavior: 'smooth', block: 'center' });

  // Only ever on an explicit Place: Fill leaves the submit to the user.
  if (bet.submit === true) {
    form.submit();
    return { ok: true, arenas: applied, submitted: true };
  }
  return { ok: true, arenas: applied, submitted: false };
}

/** Reads a bet stashed by the panel, applies it, and clears it. */
export async function applyPendingBet(doc = document) {
  if (!onBetPage()) return null;

  let pending;
  try {
    pending = (await api.storage.local.get(PENDING_KEY))[PENDING_KEY];
  } catch {
    return null;
  }
  if (!pending) return null;

  await api.storage.local.remove(PENDING_KEY);
  // Stale bets are dropped: odds move between rounds.
  if (Date.now() - (pending.at || 0) > MAX_AGE_MS) return { ok: false, reason: 'stale' };

  const result = fillBetForm(doc, pending);
  if (result.ok && !result.submitted) showFilledNotice(doc, pending);
  return result;
}

function showFilledNotice(doc, bet) {
  const note = doc.createElement('div');
  note.dataset.neosnipe = 'fc-notice';
  note.style.cssText = `
    position: fixed; left: 50%; transform: translateX(-50%); top: 12px; z-index: 2147483000;
    background: #1f6feb; color: #fff; padding: 8px 14px; border-radius: 6px;
    font: 600 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 3px 12px rgba(0,0,0,.3); max-width: 92vw; text-align: center;`;
  note.textContent = `neo-snipe filled this bet (${bet.amount.toLocaleString('en-US')} NP). `
    + 'Check it, then press Place Bet yourself.';
  doc.body.appendChild(note);
  setTimeout(() => note.remove(), 9000);
}
