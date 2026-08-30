import { withPage } from './browser.js';

// ---------------------------------------------------------------------------
// Everything site-specific lives here. Verified against items.jellyneo.net on
// 2026-08-30 (fixtures in test/fixtures/). If Jelly Neo changes its layout,
// this block is the only thing that should need editing.
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
// In-page extractors. These run inside the browser, so they must be
// self-contained: selectors are passed in rather than closed over. They return
// raw strings only — all parsing happens in Node so it stays unit-testable.
// ---------------------------------------------------------------------------

export function extractSearchResults(sel) {
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  const countEl = [...document.querySelectorAll('p')].find((p) =>
    /results? for your search/i.test(p.textContent),
  );
  const count = countEl ? Number((countEl.textContent.match(/([\d,]+)\s+results?/i) || [])[1]?.replace(/,/g, '')) : null;

  const cards = [...document.querySelectorAll(sel.resultCard)]
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

export function extractItemPage(sel) {
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  const name = text(document.querySelector(sel.name));
  const img = document.querySelector(sel.image);

  // The "Description" header is markup-only on desktop (show-for-small), but the
  // paragraph after it is always present. Fall back to the first substantial
  // <p><em>, skipping icon and footnote <em>s.
  const descHeader = [...document.querySelectorAll('h3')].find((h) => /^description$/i.test(h.textContent.trim()));
  let description = '';
  if (descHeader && descHeader.nextElementSibling?.tagName === 'P') {
    description = text(descHeader.nextElementSibling);
  }
  if (!description) {
    description = text([...document.querySelectorAll('p > em')].find(
      (em) => !em.classList.contains('svg-icon') && !em.classList.contains('text-smaller')
        && em.textContent.trim().length > 15,
    ));
  }

  // Sidebar stats are label/value pairs; read them generically so a new or
  // reordered stat doesn't break the parse.
  const stats = {};
  for (const li of document.querySelectorAll(sel.statBlock)) {
    const label = li.querySelector(sel.statLabel);
    const value = li.querySelector(sel.statValue);
    if (label && value) stats[text(label)] = text(value);
  }

  const history = [...document.querySelectorAll(sel.priceRow)].map((row) => {
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
    url: document.location.href,
  };
}

export function extractTradingPost(sel) {
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  // Sidebar: "Last Seen" under a Shop Wizard / Trading Post heading, plus two
  // bare figures whose meaning is in the caption below them.
  const stats = {};
  for (const li of document.querySelectorAll(sel.statBlock)) {
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
  if (!document.querySelector(sel.lot)) {
    const heading = [...document.querySelectorAll(sel.section)]
      .find((h) => /trading post history/i.test(h.textContent));
    let node = heading?.nextElementSibling;
    for (let i = 0; i < 6 && node && !notice; i++, node = node.nextElementSibling) {
      const strong = node.querySelector?.('strong');
      if (strong) notice = text(strong);
    }
  }

  const lots = [...document.querySelectorAll(sel.lot)].map((li) => {
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
 * Trading post history, fetched separately from the price.
 *
 * Jelly Neo generates this page on demand and it can take ~20s for a heavily
 * traded item before their own cache warms (afterwards it is ~1s). Making the
 * price wait on that would be a poor trade, so the extension asks for this
 * only when someone actually opens the trading post tab.
 */
export async function lookupTradingPost({ itemId }) {
  if (!itemId) throw new NotFoundError('(no item id)');

  return withPage(async (page) => {
    await page.goto(URLS.tradingPostHistory(itemId), {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    const raw = await page.evaluate(extractTradingPost, SELECTORS.tradingPost);
    const tp = normalizeTradingPost(raw);
    if (!tp) throw new ScrapeError('trading post history');
    return tp;
  });
}

export async function lookupItem({ name, imageHash, itemId }) {
  return withPage(async (page) => {
    let itemUrl = itemId ? `${URLS.origin}/item/${itemId}/` : null;
    let searchHit = null;

    if (!itemUrl) {
      // Exact match first — it's the common case and avoids ambiguity.
      let found = null;
      for (const exact of [true, false]) {
        await page.goto(URLS.search(name, exact), { waitUntil: 'domcontentloaded' });
        const { results } = await page.evaluate(extractSearchResults, SELECTORS.search);
        found = pickResult(results, { name, imageHash });
        if (found) break;
      }
      if (!found) throw new NotFoundError(name);
      searchHit = found;
      itemUrl = found.url;
    }

    await page.goto(itemUrl, { waitUntil: 'domcontentloaded' });
    const raw = await page.evaluate(extractItemPage, SELECTORS.item);
    const item = normalizeItem(raw);


    // The search card carries rarity in its alt text; use it if the item page
    // sidebar didn't yield one.
    if (item.rarity === null && searchHit?.imageAlt) {
      Object.assign(item, parseRarity(searchHit.imageAlt));
    }
    return item;
  });
}
