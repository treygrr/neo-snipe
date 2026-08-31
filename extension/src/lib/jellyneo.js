import { parseHTML } from 'linkedom';

// ---------------------------------------------------------------------------
// Everything site-specific lives here. Verified against items.jellyneo.net on
// 2026-08-30 (fixtures in test/fixtures/). If Jelly Neo changes its layout,
// this block is the only thing that should need editing.
//
// Jelly Neo serves complete server-rendered HTML to a plain fetch, so no
// browser engine is involved: the extension fetches and parses it directly.
// MV3 service workers have no DOM, hence linkedom rather than DOMParser.
// ---------------------------------------------------------------------------

export const URLS = {
  origin: 'https://items.jellyneo.net',
  // name_type: 1 = Partial, 2 = Contains, 3 = Exact (from the search form's <select>).
  search: (name, exact = true) =>
    `https://items.jellyneo.net/search/?name=${encodeURIComponent(name)}&name_type=${exact ? 3 : 1}`,
  tradingPostHistory: (id) => `https://items.jellyneo.net/item/${id}/trading-post-history/`,
};

export const SELECTORS = {
  search: {
    // The page has more than one .jnflex-grid (an alerts modal uses one too),
    // so cards are additionally filtered by the presence of an item link.
    resultCard: '.jnflex-grid > div',
    cardLink: 'a[href*="/item/"]',
    cardImage: 'img.item-result-image',
    cardPrice: 'a.price-history-link',  // text = "1,300,000 NP", title = "August 5, 2026"
  },
  item: {
    name: 'h1',
    image: 'img.item-result-image',
    statBlock: 'li',                    // each sidebar stat: h3.jnheader + p
    statLabel: 'h3.jnheader',
    statValue: 'p',
    priceRow: '.pricing-row-container .price-row',
    priceDate: '.price-date',
    priceIncrease: '.price-increase',
    priceDecrease: '.price-decrease',
  },
  tradingPost: {
    statBlock: 'li',
    statLabel: 'h3.jnheader',
    statValue: 'p',
    figure: 'p.price-data-figure',
    section: 'h3',
    lot: '.tp-lot-container > li',
    lotRow: '.row',
    highlighted: '.tp-highlighted-item',
    priceCell: '.small-9',
  },
};

export class ScrapeError extends Error {
  constructor(field, message) {
    super(message || `Could not extract "${field}" — Jelly Neo's layout may have changed`);
    this.name = 'ScrapeError';
    this.field = field;
  }
}

export class NotFoundError extends Error {
  constructor(query, candidates = []) {
    super(`No Jelly Neo match for "${query}"`);
    this.name = 'NotFoundError';
    this.query = query;
    this.candidates = candidates;
  }
}

// ---------------------------------------------------------------------------
// Extractors. Given a parsed document, they return raw strings only — every
// bit of interpretation happens in the normalisers below, which stay pure and
// trivially testable.
// ---------------------------------------------------------------------------

export function extractSearchResults(doc, sel) {
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  const countEl = [...doc.querySelectorAll('p')].find((p) =>
    /results? for your search/i.test(p.textContent),
  );
  const count = countEl ? Number((countEl.textContent.match(/([\d,]+)\s+results?/i) || [])[1]?.replace(/,/g, '')) : null;

  const cards = [...doc.querySelectorAll(sel.resultCard)]
    .filter((card) => card.querySelector(sel.cardLink));

  const results = cards.map((card) => {
    const link = card.querySelector(sel.cardLink);
    const img = card.querySelector(sel.cardImage);
    const price = card.querySelector(sel.cardPrice);
    const links = [...card.querySelectorAll(sel.cardLink)];
    // The card holds two links to the same item: the image, then the name.
    const nameLink = links.find((a) => text(a).length > 0);

    return {
      url: link ? link.href : null,
      name: text(nameLink),
      imageUrl: img ? img.src : null,
      // alt is "Faerie Paint Brush - r101"
      imageAlt: img ? img.getAttribute('alt') || '' : '',
      priceText: text(price),
      priceDate: price ? price.getAttribute('title') || '' : '',
    };
  });

  return { count: Number.isFinite(count) ? count : results.length, results };
}

export function extractItemPage(doc, sel, url) {
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  const name = text(doc.querySelector(sel.name));
  const img = doc.querySelector(sel.image);

  // The "Description" header is markup-only on desktop (show-for-small), but the
  // paragraph after it is always present. Fall back to the first substantial
  // <p><em>, skipping icon and footnote <em>s.
  const descHeader = [...doc.querySelectorAll('h3')].find((h) => /^description$/i.test(h.textContent.trim()));
  let description = '';
  if (descHeader && descHeader.nextElementSibling?.tagName === 'P') {
    description = text(descHeader.nextElementSibling);
  }
  if (!description) {
    description = text([...doc.querySelectorAll('p > em')].find(
      (em) => !em.classList.contains('svg-icon') && !em.classList.contains('text-smaller')
        && em.textContent.trim().length > 15,
    ));
  }

  // Sidebar stats are label/value pairs; read them generically so a new or
  // reordered stat doesn't break the parse.
  const stats = {};
  for (const li of doc.querySelectorAll(sel.statBlock)) {
    const label = li.querySelector(sel.statLabel);
    const value = li.querySelector(sel.statValue);
    if (label && value) stats[text(label)] = text(value);
  }

  const history = [...doc.querySelectorAll(sel.priceRow)].map((row) => {
    const dateEl = row.querySelector(sel.priceDate);
    const up = row.querySelector(sel.priceIncrease);
    const down = row.querySelector(sel.priceDecrease);
    const clone = row.cloneNode(true);
    clone.querySelectorAll(`${sel.priceDate}, ${sel.priceIncrease}, ${sel.priceDecrease}`).forEach((n) => n.remove());
    return {
      priceText: clone.textContent.replace(/\s+/g, ' ').trim(),
      dateText: text(dateEl).replace(/^on\s+/i, ''),
      changeText: text(up) || text(down),
      direction: up ? 'up' : down ? 'down' : null,
    };
  });

  return {
    name,
    imageUrl: img ? img.src : null,
    description,
    stats,
    history,
    url,
  };
}

export function extractTradingPost(doc, sel) {
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  // Sidebar: "Last Seen" under a Shop Wizard / Trading Post heading, plus two
  // bare figures whose meaning is in the caption below them.
  const stats = {};
  for (const li of doc.querySelectorAll(sel.statBlock)) {
    const label = text(li.querySelector(sel.statLabel));
    const value = text(li.querySelector(sel.statValue));
    if (label && value) stats[label] = value;

    const figure = li.querySelector(sel.figure);
    if (figure) {
      const caption = [...li.querySelectorAll('p')].map(text).find((t) => t && t !== text(figure));
      if (caption) stats[caption] = text(figure);
    }
  }

  // Jelly Neo withholds trading post history for low-value items, and says so
  // in place of the lot list. That is a real answer, not an empty result.
  let notice = null;
  if (!doc.querySelector(sel.lot)) {
    const heading = [...doc.querySelectorAll(sel.section)]
      .find((h) => /trading post history/i.test(h.textContent));
    let node = heading?.nextElementSibling;
    for (let i = 0; i < 6 && node && !notice; i++, node = node.nextElementSibling) {
      const strong = node.querySelector?.('strong');
      if (strong) notice = text(strong);
    }
  }

  const lots = [...doc.querySelectorAll(sel.lot)].map((li) => {
    const header = text(li.querySelector('p'));
    const highlighted = li.querySelector(sel.highlighted);
    const paragraphs = [...li.querySelectorAll('p')].map(text);

    return {
      // "Lot 447954160 | Owned by mi****** Collected on August 30, 2026, 3:18PM"
      header,
      // The lot's price for the item we actually asked about.
      itemPriceText: text(highlighted?.querySelector(sel.priceCell)),
      itemCount: li.querySelectorAll(sel.lotRow).length,
      // "Instant Buy Price: 1,150,000 NP" and "The Wishlist: none"
      detail: paragraphs.slice(1).join(' '),
    };
  });

  return { stats, lots, notice };
}

// ---------------------------------------------------------------------------
// Node-side normalisation — pure, and where the unit tests live.
// ---------------------------------------------------------------------------

export function parseNp(text) {
  if (!text) return null;
  const m = String(text).match(/([\d,]+)\s*NP/i) || String(text).match(/([\d,]+)/);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** "August 5, 2026" -> "2026-08-05". Returns null on anything unrecognised. */
export function parseDate(text) {
  if (!text) return null;
  const t = new Date(String(text).replace(/^on\s+/i, '').trim());
  if (Number.isNaN(t.getTime())) return null;
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

/** "r101 (Special)" or an alt of "Faerie Paint Brush - r101". */
export function parseRarity(text) {
  if (!text) return { rarity: null, rarityLabel: null };
  const num = String(text).match(/\br(\d+)\b/i);
  const label = String(text).match(/\(([^)]+)\)/);
  return {
    rarity: num ? Number(num[1]) : null,
    rarityLabel: label ? label[1] : null,
  };
}

/** "https://items.jellyneo.net/item/5554/" -> "5554" */
export function itemIdFromUrl(url) {
  const m = String(url || '').match(/\/item\/(\d+)\//);
  return m ? m[1] : null;
}

/** Turns the raw trading-post extraction into the API payload. */
export function normalizeTradingPost(raw) {
  if (!raw) return null;

  const stat = (pattern) => {
    const hit = Object.entries(raw.stats || {}).find(([k]) => pattern.test(k));
    return hit ? hit[1] : null;
  };

  const lots = (raw.lots || []).map((lot) => {
    const header = lot.header || '';
    const noPrice = /no individual price specified/i.test(lot.itemPriceText || '');
    return {
      lot: (header.match(/Lot\s+(\d+)/i) || [])[1] || null,
      owner: (header.match(/Owned by\s+(\S+)/i) || [])[1] || null,
      date: parseDate((header.match(/Collected on ([A-Za-z]+ \d+, \d{4})/i) || [])[1]),
      time: (header.match(/(\d{1,2}:\d{2}\s*[AP]M)/i) || [])[1] || null,
      // A lot may price the whole bundle rather than each item.
      price: noPrice ? null : parseNp(lot.itemPriceText),
      instantBuy: parseNp((lot.detail.match(/Instant Buy Price:\s*([\d,]+\s*NP)/i) || [])[1]),
      wishlist: (lot.detail.match(/The Wishlist:\s*(.*?)(?:\s*Instant Buy Price:|$)/i) || [])[1]?.trim() || null,
      items: lot.itemCount || 1,
    };
  }).filter((l) => l.lot);

  return {
    lastSeen: parseDate(stat(/trading post/i)),
    shopWizardLastSeen: parseDate(stat(/shop wizard/i)),
    uniqueOwners90d: parseNp(stat(/unique tp owners/i)),
    appearances90d: parseNp(stat(/tp appearances/i)),
    lots: lots.slice(0, 20),
    // Set when Jelly Neo declines to publish lot history for this item.
    unavailableReason: lots.length ? null : (raw.notice || null),
  };
}

export function imageHashOf(url) {
  if (!url) return null;
  const file = String(url).split('/').pop() || '';
  return file.replace(/\.[a-z0-9]+$/i, '') || null;
}

/** Turns the raw item-page extraction into the API response payload. */
export function normalizeItem(raw) {
  if (!raw?.name) throw new ScrapeError('name');

  const { rarity, rarityLabel } = parseRarity(raw.stats?.Rarity);
  const history = (raw.history || []).map((h) => ({
    price: parseNp(h.priceText),
    date: parseDate(h.dateText),
    change: h.changeText ? parseNp(h.changeText) * (h.direction === 'down' ? -1 : 1) : null,
  }));
  const current = history[0] || null;

  if (!current) throw new ScrapeError('price history');

  return {
    name: raw.name,
    imageUrl: raw.imageUrl,
    imageHash: imageHashOf(raw.imageUrl),
    rarity,
    rarityLabel,
    estimatedPrice: current.price,
    priceText: current.price === null ? null : `${current.price.toLocaleString('en-US')} NP`,
    priceAsOf: current.date,
    history: history.slice(0, 5),
    category: raw.stats?.['Item Category'] || null,
    neopetsEstValue: parseNp(raw.stats?.['Neopets Est. Value']),
    releaseDate: parseDate(raw.stats?.['Release Date']),
    status: raw.stats?.Status || null,
    description: raw.description || null,
    url: raw.url,
    itemId: itemIdFromUrl(raw.url),
  };
}

/**
 * Chooses the search result matching the item we were asked about.
 * Exact name wins; otherwise the image hash disambiguates; a lone result is
 * taken as-is. Anything else is treated as "not found" rather than a guess.
 */
export function pickResult(results, { name, imageHash }) {
  if (!results?.length) return null;

  const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const wanted = norm(name);

  const byName = results.filter((r) => norm(r.name) === wanted);
  if (byName.length === 1) return byName[0];

  const pool = byName.length ? byName : results;
  if (imageHash) {
    const byImage = pool.find((r) => imageHashOf(r.imageUrl) === imageHash);
    if (byImage) return byImage;
  }

  return pool.length === 1 ? pool[0] : null;
}

// ---------------------------------------------------------------------------
// The actual lookup.
// ---------------------------------------------------------------------------

/**
 * Fetches a Jelly Neo page and parses it. Injectable so tests can feed saved
 * fixtures instead of hitting the network.
 */
export async function fetchDoc(url) {
  const res = await fetch(url, { credentials: 'omit', redirect: 'follow' });
  if (!res.ok) throw new ScrapeError('page', `Jelly Neo returned ${res.status} for ${url}`);
  const { document } = parseHTML(await res.text());
  return document;
}

/**
 * Trading post history, fetched separately from the price: Jelly Neo generates
 * that page on demand and it can take ~20s for a heavily traded item before
 * their own cache warms, so we only ask when someone opens that tab.
 */
export async function lookupTradingPost({ itemId }, { load = fetchDoc } = {}) {
  if (!itemId) throw new NotFoundError('(no item id)');

  const doc = await load(URLS.tradingPostHistory(itemId));
  const tp = normalizeTradingPost(extractTradingPost(doc, SELECTORS.tradingPost));
  if (!tp) throw new ScrapeError('trading post history');
  return tp;
}

/**
 * `jellyNeoId` must be a Jelly Neo item id, never a Neopets obj_info_id — the
 * two are unrelated numbering schemes. Detection cannot know it, so in practice
 * every lookup resolves by name; the parameter exists for re-fetching an item
 * we have already resolved.
 */
export async function lookupItem({ name, imageHash, jellyNeoId }, { load = fetchDoc } = {}) {
  let itemUrl = jellyNeoId ? `${URLS.origin}/item/${jellyNeoId}/` : null;
  let searchHit = null;

  if (!itemUrl) {
    // Exact match first — it is the common case and avoids ambiguity.
    let found = null;
    for (const exact of [true, false]) {
      const doc = await load(URLS.search(name, exact));
      const { results } = extractSearchResults(doc, SELECTORS.search);
      found = pickResult(results, { name, imageHash });
      if (found) break;
    }
    if (!found) throw new NotFoundError(name);
    searchHit = found;
    itemUrl = found.url;
  }

  const doc = await load(itemUrl);
  const item = normalizeItem(extractItemPage(doc, SELECTORS.item, itemUrl));

  // The search card carries rarity in its alt text; use it if the item page
  // sidebar did not yield one.
  if (item.rarity === null && searchHit?.imageAlt) {
    Object.assign(item, parseRarity(searchHit.imageAlt));
  }
  return item;
}
