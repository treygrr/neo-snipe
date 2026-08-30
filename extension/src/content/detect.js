// Neopets renders items three different ways, verified against the live site
// (fixtures in test/fixtures/neopets-*.html):
//
//   inventory     div.item-img   image in data-src (lazy)      name in data-itemname
//   main shop     div.item-img   image in inline background    name in data-name
//   safety depo   img            image in src                  name in alt
//   auctions      img            image in src                  name in a sibling <td> link
//   trading post  img            image in src                  name in p.item-name-text
//
// So an "item" is not necessarily an <img>, and on the grid surfaces `alt` and
// `title` hold the item *description* rather than its name.
const ITEM_URL = /images\.neopets\.com\/items\//i;

// Anything that could carry item art. Narrow enough to stay cheap on big pages.
const CANDIDATES = 'img, [data-src], [data-image], [style*="background-image"]';

const MIN_SIZE = 30; // smaller is UI chrome, not item art
export const MARK = 'neosnipeBadged'; // dataset flag, i.e. data-neosnipe-badged

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** Resolves the item image URL from whichever place this surface keeps it. */
export function itemImageUrl(el) {
  if (el.tagName === 'IMG' && ITEM_URL.test(el.src)) return el.src;

  const ds = el.dataset || {};
  for (const value of [ds.image, ds.src]) {
    // Protocol-relative URLs are common here (//images.neopets.com/...).
    if (value && ITEM_URL.test(value)) return value;
  }

  // Inline styles only: running getComputedStyle over a whole page is far too
  // expensive, and every surface that uses a background sets it inline.
  const bg = el.style?.backgroundImage;
  if (bg) {
    const match = bg.match(/url\(["']?([^"')]+)/);
    if (match && ITEM_URL.test(match[1])) return match[1];
  }
  return null;
}

function displayWidth(el) {
  // Lazy images have no box yet; allow those and let the name check decide.
  return el.offsetWidth || Number(el.getAttribute('width')) || el.naturalWidth || 0;
}

export function isItemElement(el) {
  if (!itemImageUrl(el)) return false;
  const w = displayWidth(el);
  return w === 0 || w >= MIN_SIZE;
}

export function findItemElements(root = document) {
  return [...root.querySelectorAll(CANDIDATES)].filter((el) => !el.dataset[MARK] && isItemElement(el));
}

export function imageHashOf(url) {
  const file = String(url || '').split('?')[0].split('/').pop() || '';
  return file.replace(/\.[a-z0-9]+$/i, '') || null;
}

// Name nodes, most specific first. `.item-name` is last because the inventory
// and main shop both use it but also carry a more reliable data attribute.
const NAME_NODES = '.item-name-text, .sdb-item-name, .item-name';

function nameFromContainer(el) {
  let node = el;
  for (let depth = 0; depth < 4 && node; depth++, node = node.parentElement) {
    const hit = node.querySelector?.(NAME_NODES);
    const text = clean(hit?.textContent);
    if (text) return text;
  }
  return null;
}

/**
 * Auctions and trading-post listings put the name in a link elsewhere in the
 * row rather than anywhere near the image.
 */
function nameFromRowLink(el) {
  const row = el.closest('tr, li');
  if (!row) return null;

  for (const link of row.querySelectorAll('a')) {
    const href = link.getAttribute('href') || '';
    // Skip owner/profile links and the row's action buttons.
    if (/user=|randomfriend|neomail/i.test(href)) continue;
    if (/button/i.test(link.className || '')) continue;
    // Skip the link that merely wraps the image.
    if (link.contains(el)) continue;

    const text = clean(link.textContent);
    if (text && text.length <= 80) return text;
  }
  return null;
}

/**
 * Best-effort item name. Returns null rather than guessing — a wrong name is
 * worse than no badge, because it sends Jelly Neo on a pointless lookup.
 */
export function itemNameFor(el) {
  // 1. Explicit data attributes are authoritative where they exist.
  const explicit = clean(el.dataset?.itemname) || clean(el.dataset?.name);
  if (explicit) return explicit;

  // 2. A labelled name node in the surrounding item container.
  const labelled = nameFromContainer(el);
  if (labelled) return labelled;

  // 3. alt, but only on a real <img>: the grid surfaces put the item
  //    description in alt, which would send us looking up a whole sentence.
  if (el.tagName === 'IMG') {
    const alt = clean(el.getAttribute('alt'));
    if (alt) return alt;
  }

  // 4. A name link elsewhere in the listing row.
  return nameFromRowLink(el);
}

export function itemIdFor(el) {
  // Main shop keeps the real id in data-link; elsewhere it is on an ancestor link.
  const fromData = String(el.dataset?.link || '').match(/obj_info_id=(\d+)/);
  if (fromData) return fromData[1];

  const link = el.closest('a[href*="obj_info_id"]')
    || el.parentElement?.querySelector?.('a[href*="obj_info_id"]');
  const fromHref = link?.getAttribute('href')?.match(/obj_info_id=(\d+)/);
  return fromHref ? fromHref[1] : null;
}

export function describeItem(el) {
  const name = itemNameFor(el);
  if (!name) return null;
  return { name, imageHash: imageHashOf(itemImageUrl(el)), itemId: itemIdFor(el) };
}
