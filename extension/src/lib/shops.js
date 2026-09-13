// The main Neopian shops, for the Purchase an Item quest. Pure given parsed
// documents, with fetching injected; shop and haggle markup come from real
// pages saved in test/fixtures/questlog/ (see its README).
//
// Buying stays a person's click. Every purchase opens a confirmation guarded
// by Cloudflare Turnstile and then a haggle page, and nothing here submits
// either: it only finds the item and fills in the price.

const NEOPETS = 'https://www.neopets.com';

/**
 * Every standard shop — `objects.phtml?type=shop&obj_type=N` — from Jelly Neo's
 * shop directory (https://www.jellyneo.net/?go=shopsdirectory). Shops with
 * pages of their own (the Attic, Hidden Tower, Igloo Garage Sale, the General
 * Store and the rest) are left out.
 */
export const SHOPS = {
  1: 'Fresh Foods', 2: "Kauvara's Magic Shop", 3: 'Toy Shop', 4: 'Unis Clothing Shop', 5: 'Grooming Parlour',
  7: 'Magical Bookshop', 8: 'Collectable Card Shop', 9: 'Battle Magic', 10: 'Defence Magic',
  12: 'Neopian Garden Centre', 13: 'Neopian Pharmacy', 14: 'Chocolate Factory', 15: 'The Bakery',
  16: 'Health Foods', 17: 'Neopian Gift Shop', 18: 'Smoothie Store', 20: 'Tropical Food', 21: 'Tiki Tack',
  22: 'Grundos Cafe', 23: 'Space Weaponry', 24: 'Space Armour', 25: 'Neopian Petpet Shop',
  26: 'Robo-Petpet Shop', 27: 'The Rock Pool', 30: 'Spooky Food', 31: 'Spooky Petpets', 34: 'The Coffee Cave',
  35: 'Slushie Shop', 36: 'Ice Crystal Shop', 37: 'SHIFS Shop', 38: 'Faerieland Bookshop', 39: 'Faerie Foods',
  40: 'Faerieland Petpets', 41: 'Neopian Furniture', 42: 'Tyrannian Foods', 43: 'Tyrannian Furniture',
  44: 'Tyrannian Petpets', 45: 'Tyrannian Weaponry', 46: "Hubert's Hot Dogs", 47: 'Pizzaroo', 48: 'Usukiland',
  49: 'Lost Desert Foods', 50: "Peopatra's Petpets", 51: "Sutek's Scrolls", 53: 'Neopian School Supplies',
  54: 'Sakhmet Battle Supplies', 55: "Osiri's Pottery", 56: 'Merifoods', 57: 'Ye Olde Petpets',
  58: 'Neopian Post Office', 59: 'Haunted Weaponry', 60: 'Spooky Furniture', 61: 'Wintery Petpets',
  62: 'Jelly Foods', 63: 'Refreshments', 66: 'Kiko Lake Treats', 67: 'Kiko Lake Carpentry',
  68: 'Collectable Coins', 69: 'Petpet Supplies', 70: 'Booktastic Books', 71: 'Kreludan Homes',
  72: 'Cafe Kreludor', 73: "Kayla's Potion Shop", 74: 'Darigan Toys', 75: 'Faerie Furniture',
  76: 'Roo Island Souvenirs', 77: 'Brightvale Books', 78: 'The Scrollery', 79: 'Brightvale Glaziers',
  80: 'Brightvale Armoury', 81: 'Brightvale Fruits', 82: 'Brightvale Motery', 83: 'Royal Potionery',
  84: 'Neopian Music Shop', 85: 'Lost Desert Medicine', 86: 'Collectable Sea Shells', 87: 'Maractite Marvels',
  88: 'Maraquan Petpets', 89: 'Geraptiku Petpets', 90: 'Qasalan Delights', 91: 'Desert Arms',
  92: 'Words of Antiquity', 93: 'Faerie Weapon Shop', 94: 'Illustrious Armoury', 95: 'Exquisite Ambrosia',
  96: 'Magical Marvels', 97: 'Legendary Petpets', 98: 'Plushie Palace', 100: 'Wonderous Weaponry',
  101: 'Exotic Foods', 102: 'Remarkable Restoratives', 103: 'Fanciful Fauna', 104: "Chesterdrawers' Antiques",
  105: 'The Crumpetmonger', 106: 'Neovian Printing Press', 107: 'Prigpants & Swolthy, Tailors',
  108: 'Mystical Surroundings', 110: "Lampwyck's Lights Fantastic", 111: "Cog's Togs", 112: 'Molten Morsels',
  113: 'Moltaran Petpets', 114: 'Moltaran Books', 116: 'Springy Things', 117: 'Ugga Shinies',
};
export const SHOP_IDS = Object.keys(SHOPS).map(Number);

export const shopUrl = (id) => `${NEOPETS}/objects.phtml?type=shop&obj_type=${id}`;

/** The shop a URL is for, or null when it is not a standard shop page. */
export function shopIdOf(href) {
  let url;
  try { url = new URL(href, NEOPETS); } catch { return null; }
  if (url.pathname !== '/objects.phtml' || url.searchParams.get('type') !== 'shop') return null;
  const id = Number(url.searchParams.get('obj_type'));
  return Number.isInteger(id) && id > 0 ? id : null;
}

const text = (el) => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

/** An emptied shop says so where its stock would be. */
export const isSoldOut = (doc) => !!doc?.querySelector?.('form[name="items_for_sale"] .soldOutMessage');

/** Each item for sale, as its card and the data on its picture describe it. */
export function readShopStock(doc) {
  return [...(doc?.querySelectorAll?.('form[name="items_for_sale"] .shop-item') ?? [])]
    .map((card) => {
      const img = card.querySelector('.item-img');
      const link = img?.getAttribute('data-link') ?? '';
      const params = new URLSearchParams(link.split('?')[1] ?? '');
      const stockLine = [...card.querySelectorAll('.item-stock')].map(text).find((t) => /in stock/i.test(t)) ?? '';
      const art = /url\((?:&quot;|["'])?([^"')&]+)/.exec(img?.getAttribute('style') ?? '')?.[1];
      return {
        name: img?.getAttribute('data-name') || text(card.querySelector('.item-name')),
        price: Number(img?.getAttribute('data-price')) || null,
        stock: Number(/(\d+)\s+in stock/i.exec(stockLine)?.[1]) || null,
        objInfoId: params.get('obj_info_id'),
        stockId: params.get('stock_id'),
        link: link ? new URL(link, `${NEOPETS}/`).href : null,
        image: art ? new URL(art, NEOPETS).href : null,
      };
    })
    .filter((item) => item.name && item.price != null && item.objInfoId);
}

/** The cheapest item, and of two at one price the one with more left. */
export function cheapestItem(items) {
  return [...(items ?? [])].sort((a, b) => a.price - b.price || (b.stock ?? 0) - (a.stock ?? 0))[0] ?? null;
}

/** A shop not tried yet, chosen at random, or null once every shop has been. */
export function pickShop(tried = new Set(), random = Math.random) {
  const left = SHOP_IDS.filter((id) => !tried.has(id));
  return left.length ? left[Math.min(left.length - 1, Math.floor(random() * left.length))] : null;
}

/**
 * A random shop that has stock, and its cheapest item. Shops restock every few
 * minutes and empty just as fast, so a handful are tried, a moment apart, before
 * giving up. `fetchDoc(url)` returns a parsed document.
 */
export async function findShopWithStock(fetchDoc, {
  attempts = 6, random = Math.random, exclude = [], pause = () => new Promise((r) => setTimeout(r, 400)),
} = {}) {
  const tried = new Set(exclude);
  for (let i = 0; i < attempts; i += 1) {
    const shopId = pickShop(tried, random);
    if (shopId == null) break;
    tried.add(shopId);
    if (i > 0) await pause();
    const doc = await fetchDoc(shopUrl(shopId));
    if (isSoldOut(doc)) continue;
    const item = cheapestItem(readShopStock(doc));
    if (item) return { shopId, shopName: SHOPS[shopId], item };
  }
  return null;
}

/**
 * A haggle page, before or after the offer: the item, what the shopkeeper wants,
 * and — once accepted — what was paid and what went into the inventory.
 */
export function readHaggle(doc) {
  const body = text(doc?.body);
  const heading = [...(doc?.querySelectorAll?.('h1, h2, h3, h4, b, p, div') ?? [])]
    .map(text).find((t) => /^Haggle for /.test(t) && t.length < 120);
  const addedLine = [...(doc?.querySelectorAll?.('p') ?? [])].find((p) => /has been added to your inventory/i.test(text(p)));
  const num = (m) => (m ? Number(m[1].replace(/,/g, '')) : null);
  return {
    itemName: heading ? heading.replace(/^Haggle for /, '') : null,
    askingPrice: num(/want at least ([\d,]+) Neopoints/i.exec(body)),
    paid: num(/accept your offer of ([\d,]+) Neopoints/i.exec(body)),
    added: addedLine ? (text(addedLine.querySelector('b')) || text(addedLine).replace(/\s*has been added.*$/i, '')) : null,
  };
}

// The plan a Shop press leaves for the pages it sends you to: which quest, how
// many buys are left, and the shop and item picked. Device state, in
// storage.local, and only good for half an hour — shops do not hold stock.
export const SHOPPING_KEY = 'questShopping';
export const SHOPPING_TTL_MS = 30 * 60_000;

export const isLivePlan = (plan, now = Date.now()) =>
  !!plan && plan.remaining > 0 && now - (plan.at ?? 0) < SHOPPING_TTL_MS;

/** Buys still to make for a Purchase quest, from its task count (1 when it has none). */
export function purchasesLeft(quest) {
  const task = quest?.tasks?.find((t) => t.need != null);
  return task ? Math.max(0, task.need - (task.have ?? 0)) : 1;
}
