// Jelly Neo parsing, against pages saved from the live site. No browser and no
// network: linkedom parses the fixtures exactly as the service worker parses a
// real response.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';

import {
  URLS, SELECTORS, extractSearchResults, extractItemPage, extractTradingPost,
  normalizeItem, normalizeTradingPost, parseNp, parseDate, parseRarity,
  imageHashOf, itemIdFromUrl, pickResult, lookupItem, lookupTradingPost, NotFoundError,
} from '../src/lib/jellyneo.js';

const fixture = (f) => readFileSync(resolve('test/fixtures/jellyneo', f), 'utf8');
const doc = (f) => parseHTML(fixture(f)).document;

const PAGES = {
  [URLS.search('Faerie Paint Brush', true)]: 'search-faerie-paint-brush.html',
  [URLS.search('Bag of Dust', true)]: 'search-no-results.html',
  [URLS.search('Bag of Dust', false)]: 'search-no-results.html',
  'https://items.jellyneo.net/item/5554/': 'item-5554-faerie-paint-brush.html',
  [URLS.tradingPostHistory('5554')]: 'item-5554-trading-post-history.html',
  [URLS.tradingPostHistory('117')]: 'item-117-trading-post-too-cheap.html',
};

// Stands in for the network: every lookup goes through this.
const load = async (url) => {
  const file = PAGES[url];
  if (!file) throw new Error(`unexpected fetch: ${url}`);
  return doc(file);
};

// --- pure helpers ----------------------------------------------------------

test('parseNp reads Neopoint amounts', () => {
  assert.equal(parseNp('1,300,000 NP'), 1300000);
  assert.equal(parseNp('(-500,000 NP)'), 500000);
  assert.equal(parseNp('unbuyable'), null);
  assert.equal(parseNp(null), null);
});

test('parseDate normalises Jelly Neo dates', () => {
  assert.equal(parseDate('August 5, 2026'), '2026-08-05');
  assert.equal(parseDate('on January 16, 2001'), '2001-01-16');
  assert.equal(parseDate('nonsense'), null);
});

test('parseRarity handles both sidebar and alt-text forms', () => {
  assert.deepEqual(parseRarity('r101 (Special)'), { rarity: 101, rarityLabel: 'Special' });
  assert.deepEqual(parseRarity('Faerie Paint Brush - r101'), { rarity: 101, rarityLabel: null });
});

test('itemIdFromUrl pulls the id out of a Jelly Neo item URL', () => {
  assert.equal(itemIdFromUrl('https://items.jellyneo.net/item/5554/'), '5554');
  assert.equal(itemIdFromUrl('https://items.jellyneo.net/search/'), null);
});

test('imageHashOf strips path and extension', () => {
  assert.equal(imageHashOf('https://images.neopets.com/items/faeriepntbrush.gif'), 'faeriepntbrush');
  assert.equal(imageHashOf(null), null);
});

test('pickResult prefers exact name, falls back to image hash, refuses to guess', () => {
  const results = [
    { name: 'Faerie Paint Brush', imageUrl: '/items/faeriepntbrush.gif' },
    { name: 'Faerie Paint Brush Stamp', imageUrl: '/items/stamp.gif' },
  ];
  assert.equal(pickResult(results, { name: 'faerie paint brush' }).name, 'Faerie Paint Brush');

  const ambiguous = [
    { name: 'Sword', imageUrl: '/items/sword_a.gif' },
    { name: 'Sword', imageUrl: '/items/sword_b.gif' },
  ];
  assert.equal(pickResult(ambiguous, { name: 'Sword', imageHash: 'sword_b' }).imageUrl, '/items/sword_b.gif');
  assert.equal(pickResult(ambiguous, { name: 'Sword' }), null);
});

// --- extraction ------------------------------------------------------------

test('search results', () => {
  const { count, results } = extractSearchResults(doc('search-faerie-paint-brush.html'), SELECTORS.search);
  assert.equal(count, 1);
  assert.equal(results[0].name, 'Faerie Paint Brush');
  assert.match(results[0].url, /\/item\/5554\//);
  assert.equal(imageHashOf(results[0].imageUrl), 'faeriepntbrush');
  assert.equal(parseNp(results[0].priceText), 1300000);
  assert.equal(parseDate(results[0].priceDate), '2026-08-05');
});

test('empty search results', () => {
  const { count, results } = extractSearchResults(doc('search-no-results.html'), SELECTORS.search);
  assert.equal(count, 0);
  assert.equal(results.length, 0);
});

test('item page', () => {
  const url = 'https://items.jellyneo.net/item/5554/';
  const item = normalizeItem(extractItemPage(doc('item-5554-faerie-paint-brush.html'), SELECTORS.item, url));

  assert.equal(item.name, 'Faerie Paint Brush');
  assert.equal(item.rarity, 101);
  assert.equal(item.rarityLabel, 'Special');
  assert.equal(item.category, 'Special');
  assert.equal(item.estimatedPrice, 1300000);
  assert.equal(item.priceText, '1,300,000 NP');
  assert.equal(item.priceAsOf, '2026-08-05');
  assert.equal(item.neopetsEstValue, 1000000);
  assert.equal(item.releaseDate, '2001-01-16');
  assert.equal(item.imageHash, 'faeriepntbrush');
  assert.equal(item.itemId, '5554');
  assert.match(item.description, /Rainbow Pool/);
  assert.equal(item.history.length, 3);
  assert.deepEqual(item.history[0], { price: 1300000, date: '2026-08-05', change: -500000 });
});

test('trading post history', () => {
  const tp = normalizeTradingPost(extractTradingPost(doc('item-5554-trading-post-history.html'), SELECTORS.tradingPost));
  assert.equal(tp.lastSeen, '2026-08-30');
  assert.equal(tp.shopWizardLastSeen, '2026-04-05');
  assert.equal(tp.uniqueOwners90d, 911);
  assert.equal(tp.appearances90d, 1988);
  assert.equal(tp.lots[0].lot, '447954160');
  assert.equal(tp.lots[0].price, 1150000);
  assert.equal(tp.unavailableReason, null);

  const bundle = tp.lots.find((l) => l.items > 1);
  assert.equal(bundle.price, null, 'a multi-item lot prices the bundle, not this item');
});

test('trading post history withheld for a low-value item', () => {
  const tp = normalizeTradingPost(extractTradingPost(doc('item-117-trading-post-too-cheap.html'), SELECTORS.tradingPost));
  assert.equal(tp.lots.length, 0);
  assert.match(tp.unavailableReason, /relatively low price/i);
});

// --- the whole lookup, end to end over saved pages -------------------------

test('lookupItem walks search then item page', async () => {
  const item = await lookupItem({ name: 'Faerie Paint Brush' }, { load });
  assert.equal(item.name, 'Faerie Paint Brush');
  assert.equal(item.priceText, '1,300,000 NP');
  assert.equal(item.itemId, '5554');
});

test('lookupItem skips the search when given an item id', async () => {
  const seen = [];
  await lookupItem({ itemId: '5554' }, { load: (u) => { seen.push(u); return load(u); } });
  assert.equal(seen.length, 1, 'no search request');
  assert.match(seen[0], /\/item\/5554\//);
});

test('lookupItem reports no match rather than guessing', async () => {
  await assert.rejects(() => lookupItem({ name: 'Bag of Dust' }, { load }), NotFoundError);
});

test('lookupTradingPost returns lots', async () => {
  const tp = await lookupTradingPost({ itemId: '5554' }, { load });
  assert.ok(tp.lots.length > 0);
});
