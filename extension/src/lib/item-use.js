// Using an item on a pet — what the Feed, Groom, Play With and Read to a Pet
// quests ask for. Pure given parsed documents; the store does the fetching.
// Requests and replies come from real traffic, saved in test/fixtures/questlog/
// with a README.
import { INVENTORY_URL } from './neopets-search.js';

export { INVENTORY_URL };

const NEOPETS = 'https://www.neopets.com';
export const USE_OBJECT_URL = `${NEOPETS}/np-templates/views/useobject.phtml`;

/**
 * Where the inventory's items come from. The inventory page itself arrives
 * empty and fills in with this call, which Neopets answers "Request denied"
 * unless it is marked as the page's own XHR. Stacked the way the page asks by
 * default, so each item appears once with its quantity. `tab` is the
 * inventory's own tab (1 Food, 2 Toys, 3 Books, 4 Grooming, 5 Healing,
 * 6 Wearables, 7 Equipment, 8 Furniture, 9 Misc); blank is everything.
 */
export const inventoryItemsUrl = (tab = '') =>
  `${NEOPETS}/np-templates/ajax/inventory.php?itemType=np&alpha=&itemStack=1&action=${tab}`;
export const INVENTORY_AJAX_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };

/**
 * The item call's reply: its item cells, or an error when Neopets refused —
 * a refusal is a small JSON body rather than HTML with nothing in it.
 */
export function parseInventoryReply(text, parse) {
  const reply = String(text ?? '');
  if (/^\s*\{/.test(reply)) {
    let json = null;
    try { json = JSON.parse(reply); } catch { /* not JSON after all */ }
    if (json?.error) {
      throw new ItemUseError(`Neopets would not show your inventory (${json.message || 'refused'}).`);
    }
  }
  return readInventory(parse(`<body>${reply}</body>`));
}

/** The popup the inventory opens for one item, which lists what it can do. */
export const itemInfoUrl = (objId) =>
  `${NEOPETS}/np-templates/views/iteminfo.phtml?obj_id=${encodeURIComponent(objId)}`;

/**
 * Each quest kind: the words its action starts with in the item popup, the
 * button's label, what to call a suitable item, and the inventory tab that
 * holds them. Neopets sorts the tab itself — whatever it puts under Grooming
 * can groom, whatever the item's own `data-itemtype` happens to say (a Red
 * Long Hair Brush is typed `Special` and sits there all the same). The item's
 * popup still has the final say on what it can do.
 */
export const USES = {
  read: { verb: 'Read to', label: 'Read', noun: 'book', tab: 3 },
  feed: { verb: 'Feed to', label: 'Feed', noun: 'food', tab: 1 },
  play: { verb: 'Play with', label: 'Play', noun: 'toy', tab: 2 },
  groom: { verb: 'Groom', label: 'Groom', noun: 'grooming item', tab: 4 },
};

const npValue = (s) => {
  const n = String(s ?? '').replace(/[^\d]/g, '');
  return n === '' ? null : Number(n);
};

/** Every item on an inventory page, as its `.item-img` data attributes describe it. */
export function readInventory(doc) {
  return [...(doc?.querySelectorAll?.('.item-img[data-itemname]') ?? [])]
    .map((el) => ({
      objId: el.getAttribute('data-objid'),
      name: el.getAttribute('data-itemname'),
      type: el.getAttribute('data-itemtype') || '',
      image: el.getAttribute('data-image') || null,
      value: npValue(el.getAttribute('data-itemvalue')),
      rarity: Number(el.getAttribute('data-rarity')) || null,
      nc: el.getAttribute('data-itemset') === 'nc',
    }))
    .filter((item) => item.objId && item.name);
}

/**
 * The items worth trying for a quest kind, least valuable first: using an item
 * usually uses it up (a Faerie Book vanishes once read), so the cheapest one
 * goes. Unknown values sort last, then commoner items first. NC items never.
 * The items are the quest's own inventory tab, so nothing is filtered by type.
 */
export function candidatesFor(kind, items) {
  if (!USES[kind]) return [];
  const rank = (v) => (v == null ? Infinity : v);
  return items
    .filter((item) => !item.nc)
    .sort((a, b) => rank(a.value) - rank(b.value) || rank(a.rarity) - rank(b.rarity));
}

/** The header's "Active Pet" link, which every logged-in page carries. */
export function readActivePet(doc) {
  const href = doc?.querySelector?.('.nav-profile-dropdown-text a[href*="petlookup.phtml?pet="]')?.getAttribute('href');
  const pet = /[?&]pet=([^&#]+)/.exec(href ?? '')?.[1];
  return pet ? decodeURIComponent(pet) : null;
}

/** An item popup's action values, as `useobject.phtml` expects them back. */
export function readItemActions(doc) {
  return [...(doc?.querySelectorAll?.('select[name="action"] option') ?? [])]
    .map((o) => o.getAttribute('value') ?? '')
    .filter(Boolean);
}

/**
 * The action to post for a quest kind on one pet, or null when the item does
 * not offer it. Exact to the pet: a plushie that some other pet could eat must
 * not count as food for yours, and no pet is ever guessed.
 */
export function actionFor(kind, actions, pet) {
  const use = USES[kind];
  if (!use || !pet) return null;
  const want = `${use.verb} ${pet}`.toLowerCase();
  return actions.find((a) => a.toLowerCase() === want) ?? null;
}

/** What the inventory page's `useInvItem()` posts. */
export const useBody = (objId, action) =>
  new URLSearchParams({ obj_id: String(objId), action, petcare: '0' });

const text = (el) => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

/**
 * `useobject.phtml`'s reply: what the pet said and what became of the item.
 * Anything wordless is treated as a failure, so a blank reply is never
 * reported as done — the quest list is what confirms it counted.
 */
export function parseUse(doc) {
  const lines = [...(doc?.querySelectorAll?.('p') ?? [])].map(text).filter(Boolean);
  const message = lines.join(' ') || text(doc?.body);
  if (!message) throw new ItemUseError('Neopets did not say what happened.');
  return { message, usedUp: /vanishes|disappears|used up|is gone|eats|devours/i.test(message) };
}

export class ItemUseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ItemUseError';
  }
}
