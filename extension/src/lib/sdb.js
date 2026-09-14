// Fast Relist from the Safety Deposit Box.
//
// The SDB auctions an item where the inventory cannot: its own call takes the
// item straight from the box, so Fast Relist never moves anything to the
// inventory first. That call differs from the inventory's in three ways worth
// knowing, and all three shape what is below:
//
//   - it names the item by `obj_info_id` — the *kind* of item, not one copy —
//     so there is no object id to find before auctioning;
//   - it sends JSON, not a form, and answers JSON rather than a page;
//   - it has no guild-members-only option, so a relist saved with one from the
//     inventory loses it here. `sdbDrops` says so, for the panel to warn with.
//
// The PIN is the SDB's own: the box asks for it on every auction when the
// account has one set, and Neopets answers `pin_required`/`pin_wrong` when it
// is missing or wrong.

import { AUCTION_DURATIONS as AUCTION_HOURS } from './fast-relist.js';

const NEOPETS = 'https://www.neopets.com';

export const SDB_URL = `${NEOPETS}/safetydeposit.phtml`;
export const SDB_AUCTION_URL = `${NEOPETS}/np-templates/ajax/safetydeposit/auction.php`;

/** The box's own calls send JSON and mark themselves as its XHR; a plain form post is refused. */
export const SDB_AJAX_HEADERS = {
  'Content-Type': 'application/json',
  'x-requested-with': 'XMLHttpRequest',
};

/** The SDB auctions one copy at a time, whatever the quantity in the box. */
export const SDB_AUCTION_QUANTITY = 1;

/** The PIN, kept in storage.local only — see `cleanPin` for what counts as one. */
export const SDB_PIN_KEY = 'sdbPin';

/** What the inventory can send and the box cannot. */
export const SDB_DROPS = ['guildMembersOnly'];

export const isSdbPath = (pathname) => /^\/safetydeposit\.phtml/i.test(String(pathname ?? ''));

/**
 * The PIN as Neopets takes it: four digits, or null for "none saved". Anything
 * else — a longer number, letters, spaces — is not a PIN and is not kept.
 */
export function cleanPin(value) {
  const pin = String(value ?? '').trim();
  return /^\d{4}$/.test(pin) ? pin : null;
}

/** The saved settings this relist would lose by going through the box. */
export function sdbDrops(entry) {
  return SDB_DROPS.filter((key) => entry?.[key] === true);
}

/**
 * One SDB row, or null when the row is not an item. The id comes off the row's
 * checkbox, whose id ends in the item's `obj_info_id` — the box renders a
 * desktop and a mobile layout, so the prefix varies but the number does not.
 *
 * Whether the item can be auctioned is the page's own answer: its action menu
 * carries an "auction" option exactly when the box would allow one. Reading it
 * rather than re-deriving it keeps no-trade, NC and unverified-account rules in
 * one place — Neopets'.
 */
export function readSdbRow(row) {
  const name = row?.querySelector?.('.sdb-item-name')?.textContent?.replace(/\s+/g, ' ').trim();
  const objInfoId = Number(/(\d+)$/.exec(row?.querySelector?.('.sdb-item-checkbox')?.id ?? '')?.[1]);
  if (!name || !Number.isInteger(objInfoId) || objInfoId <= 0) return null;

  const options = [...(row.querySelectorAll?.('select.sdb-action-select option') ?? [])];
  return {
    name,
    objInfoId,
    imageUrl: row.querySelector?.('img[src*="/items/"]')?.getAttribute('src') ?? null,
    canAuction: options.some((o) => o.value === 'auction'),
  };
}

/** Every item row the box is showing. */
export function readSdbRows(root) {
  return [...(root?.querySelectorAll?.('tr') ?? [])]
    .map(readSdbRow)
    .filter(Boolean);
}

/** The request the box's own "Put up for Auction" sends, for this item. */
export const sdbAuctionBody = (objInfoId, entry, { pin, refCk }) => ({
  obj_info_id: Number(objInfoId),
  quantity: SDB_AUCTION_QUANTITY,
  start_price: Number(entry.startPrice) || 0,
  min_increment: Number(entry.minIncrement) || 0,
  duration: Number(entry.duration),
  // A boolean here, where the inventory's form wants "on"/"off".
  neofriends_only: entry.neofriendsOnly === true,
  pin: String(pin ?? ''),
  _ref_ck: String(refCk ?? ''),
});

const PIN_CODES = /pin_required|pin_wrong/i;
const PIN_WORDS = /\bpin\b/i;

/**
 * What the box said. `pin` is set when the PIN is why it refused, which the
 * panel shows against its PIN field rather than as a general failure.
 */
export function parseSdbAuctionReply(json) {
  const code = String(json?.error ?? '');
  const message = String(json?.message ?? '').replace(/\s+/g, ' ').trim();
  const ok = json?.success === true;
  const pinCode = PIN_CODES.exec(code || message)?.[0]?.toLowerCase() ?? null;
  return {
    ok,
    message: message || (ok ? 'The item is up for auction.' : 'Neopets did not accept the auction.'),
    // A refusal naming the PIN counts even when the code did not come through.
    pin: !ok && Boolean(pinCode || PIN_WORDS.test(code || message)),
    missingPin: pinCode === 'pin_required',
    wrongPin: pinCode === 'pin_wrong',
  };
}

/**
 * The box's "Put up for Auction" dialog, when one is open — and only that one.
 * Every action the box confirms (Move to Inventory, Donate, Trading Post, Give
 * to Neofriend) draws the same `.sdb-popup`, so the dialog is told apart by the
 * auction fields it alone carries rather than by its heading, which is wording
 * and could be translated.
 */
export const sdbAuctionPopup = (root) => [...(root?.querySelectorAll?.('.sdb-popup') ?? [])]
  .find((el) => el.querySelector('.sdb-auction-input')) ?? null;

const digits = (value) => Number(String(value ?? '').replace(/[^\d]/g, '')) || 0;

/**
 * The values on the box's open auction dialog, in the same shape the
 * inventory's form gives, or null when `popup` is not that dialog.
 *
 * The dialog's own classes are the only stable hooks it has — its labels and
 * layout carry utility classes that say nothing — so the two price fields are
 * told apart by order, which is the order the box has always drawn them in.
 * `guildMembersOnly` is always false: the box has no such option to read.
 */
export function readSdbAuctionForm(popup) {
  const body = popup?.querySelector?.('.popup-body__2020');
  if (!body) return null;

  const fields = [...body.querySelectorAll('.sdb-auction-input')];
  const prices = fields.filter((el) => el.tagName === 'INPUT');
  const duration = Number(fields.find((el) => el.tagName === 'SELECT')?.value);
  if (prices.length < 2 || !(duration in AUCTION_HOURS)) return null;

  // The heading of the dialog's own body, which is the item it is about.
  const name = body.querySelector('p')?.textContent?.replace(/\s+/g, ' ').trim();
  if (!name) return null;

  return {
    name,
    imageUrl: body.querySelector('img[src*="/items/"]')?.getAttribute('src') ?? null,
    startPrice: digits(prices[0].value),
    minIncrement: digits(prices[1].value),
    duration,
    neofriendsOnly: body.querySelector('.sdb-auction-checkbox-row input[type="checkbox"]')?.checked === true,
    guildMembersOnly: false,
  };
}

/**
 * The PIN typed into the box's auction dialog, or null when it is empty or not
 * yet four digits. The field is found by its length rather than its type: the
 * dialog's own "Show password" switch turns it from a password into a plain
 * text box, and it is still the PIN either way. The auction's own inputs are
 * ruled out by class — they take a price, which has no such limit.
 */
export function readSdbAuctionPin(popup) {
  const body = popup?.querySelector?.('.popup-body__2020');
  if (!body) return null;
  const field = [...body.querySelectorAll('input')].find((el) => (
    Number(el.getAttribute('maxlength')) === 4 && !el.classList.contains('sdb-auction-input')
  ));
  return cleanPin(field?.value);
}
