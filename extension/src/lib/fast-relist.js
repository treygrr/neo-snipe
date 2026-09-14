// Fast Relist: an auction's settings, saved from the inventory's "Put up for
// Auction!" form, so the same item can go back up with one click later.
//
// Saved by item name rather than object id: an id belongs to one copy of an
// item, and the copy you relist next is a different one. The id to auction is
// read from the inventory when the auction is made.

export const RELIST_KEY = 'fastRelist';

// Where the inventory's own auctionItem() posts the form.
export const ADD_AUCTION_URL = 'https://www.neopets.com/add_auction.phtml';

// The form's Auction Length choices, by the hours it sends.
export const AUCTION_DURATIONS = {
  1: '1 Hour', 2: '2 Hours', 3: '3 Hours', 4: '4 Hours', 6: '6 Hours',
  9: '9 Hours', 12: '12 Hours', 18: '18 Hours', 24: '1 Day', 48: '2 Days',
};

const digits = (value) => Number(String(value ?? '').replace(/[^\d]/g, '')) || 0;
const squash = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

export const relistKey = (name) => squash(name).toLowerCase();

/**
 * The values on an open auction form, or null when `root` holds no such form.
 * The item's name comes from the form's "Putting … up for Auction" line, or
 * `fallbackName` (the item popup's title) when that line is missing.
 */
export function readAuctionForm(root, { fallbackName = null } = {}) {
  const field = (name) => root?.querySelector?.(`[name="${name}"]`);
  const objId = squash(field('obj_id')?.value);
  const duration = Number(field('duration')?.value);
  if (!objId || !(duration in AUCTION_DURATIONS)) return null;

  const line = [...root.querySelectorAll('p, b, h3, td, div')]
    .map((el) => squash(el.textContent))
    .find((t) => /^Putting .+ up for Auction/i.test(t));
  const name = /^Putting (.+?) up for Auction/i.exec(line ?? '')?.[1] ?? squash(fallbackName);
  if (!name) return null;

  return {
    name,
    objId,
    imageUrl: root.querySelector('img[src*="/items/"]')?.getAttribute('src') ?? null,
    startPrice: digits(field('start_price')?.value),
    minIncrement: digits(field('min_increment')?.value),
    duration,
    neofriendsOnly: field('neofriends_only')?.checked === true,
    guildMembersOnly: field('guild_members_only')?.checked === true,
  };
}

/** One saved relist, or null if it is not the shape we write. */
export function cleanRelist(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const name = squash(entry.name);
  const duration = Number(entry.duration);
  if (!name || !(duration in AUCTION_DURATIONS)) return null;
  return {
    name,
    imageUrl: typeof entry.imageUrl === 'string' ? entry.imageUrl : null,
    startPrice: digits(entry.startPrice),
    minIncrement: digits(entry.minIncrement),
    duration,
    neofriendsOnly: entry.neofriendsOnly === true,
    guildMembersOnly: entry.guildMembersOnly === true,
    savedAt: Number(entry.savedAt) || null,
  };
}

/** Every saved relist, keyed by `relistKey`, dropping anything malformed. */
export function cleanRelists(raw) {
  const out = {};
  for (const entry of Object.values(raw && typeof raw === 'object' ? raw : {})) {
    const clean = cleanRelist(entry);
    if (clean) out[relistKey(clean.name)] = clean;
  }
  return out;
}

/** A new map with `entry` saved over any earlier one for the same item. */
export function withRelist(raw, entry) {
  const all = cleanRelists(raw);
  const clean = cleanRelist(entry);
  if (clean) all[relistKey(clean.name)] = clean;
  return all;
}

/** A new map without the item's relist. */
export function withoutRelist(raw, name) {
  const all = cleanRelists(raw);
  delete all[relistKey(name)];
  return all;
}

/** The request auctionItem() sends, for this copy of the item. */
export const auctionBody = (objId, entry) => new URLSearchParams({
  obj_id: String(objId),
  start_price: String(entry.startPrice),
  min_increment: String(entry.minIncrement),
  duration: String(entry.duration),
  neofriends_only: entry.neofriendsOnly ? 'on' : 'off',
  guild_members_only: entry.guildMembersOnly ? 'on' : 'off',
});

/**
 * What add_auction.phtml said. Its reply has not been captured yet, so success
 * is a guess: any reply without refusal wording counts as accepted.
 */
export function parseAuctionReply(doc) {
  const body = doc?.body?.cloneNode(true);
  body?.querySelectorAll('script, style, title').forEach((el) => el.remove());
  const message = squash(body?.textContent);
  const refused = /\b(error|sorry|cannot|can't|unable|invalid|not allowed|too many|must)\b/i.test(message);
  return { ok: Boolean(message) && !refused, message };
}
