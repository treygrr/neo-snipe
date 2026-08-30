import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { webkit } from 'playwright';

import {
  SELECTORS, extractSearchResults, extractItemPage, extractTradingPost,
  normalizeItem, normalizeTradingPost, parseNp, parseDate, parseRarity,
  imageHashOf, itemIdFromUrl, pickResult,
} from '../src/jellyneo.js';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');
const fixture = (f) => readFileSync(join(FIXTURES, f), 'utf8');

const FIXTURE_ROUTES = {
  '/search/': 'search-faerie-paint-brush.html',
  '/item/5554/': 'item-5554-faerie-paint-brush.html',
  '/item/5554/trading-post-history/': 'item-5554-trading-post-history.html',
  '/item/117/trading-post-history/': 'item-117-trading-post-too-cheap.html',
};

// --- pure helpers: no browser needed ---------------------------------------

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
  assert.deepEqual(parseRarity(''), { rarity: null, rarityLabel: null });
});

test('itemIdFromUrl pulls the id out of a Jelly Neo item URL', () => {
  assert.equal(itemIdFromUrl('https://items.jellyneo.net/item/5554/'), '5554');
  assert.equal(itemIdFromUrl('https://items.jellyneo.net/search/'), null);
});

test('imageHashOf strips path and extension', () => {
  assert.equal(imageHashOf('https://images.neopets.com/items/faeriepntbrush.gif'), 'faeriepntbrush');
  assert.equal(imageHashOf(null), null);
});

test('pickResult prefers exact name, falls back to image hash', () => {
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
  assert.equal(pickResult(ambiguous, { name: 'Sword' }), null, 'refuses to guess between duplicates');
  assert.equal(pickResult([], { name: 'Sword' }), null);
});

// --- extraction: runs the real in-page code against saved HTML --------------

test('extraction against saved Jelly Neo fixtures', async (t) => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  t.after(async () => { await browser.close(); });

  // Serve each fixture at the URL it came from, so document.location (which the
  // item id is derived from) matches what the scraper sees in production.
  await page.route('**://items.jellyneo.net/**', (route) => {
    const file = FIXTURE_ROUTES[new URL(route.request().url()).pathname];
    if (!file) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: 'text/html', body: fixture(file) });
  });

  await t.test('search results', async () => {
    await page.goto('https://items.jellyneo.net/search/?name=Faerie+Paint+Brush');
    const { count, results } = await page.evaluate(extractSearchResults, SELECTORS.search);

    assert.equal(count, 1);
    assert.equal(results.length, 1);
    assert.equal(results[0].name, 'Faerie Paint Brush');
    assert.match(results[0].url, /\/item\/5554\//);
    assert.equal(imageHashOf(results[0].imageUrl), 'faeriepntbrush');
    assert.equal(parseNp(results[0].priceText), 1300000);
    assert.equal(parseDate(results[0].priceDate), '2026-08-05');
    assert.deepEqual(parseRarity(results[0].imageAlt), { rarity: 101, rarityLabel: null });
  });

  await t.test('empty search results', async () => {
    await page.setContent(fixture('search-no-results.html')); // no URL dependency here
    const { count, results } = await page.evaluate(extractSearchResults, SELECTORS.search);
    assert.equal(count, 0);
    assert.equal(results.length, 0);
    assert.equal(pickResult(results, { name: 'Bag of Dust' }), null);
  });

  await t.test('trading post history', async () => {
    await page.goto('https://items.jellyneo.net/item/5554/trading-post-history/');
    const raw = await page.evaluate(extractTradingPost, SELECTORS.tradingPost);
    const tp = normalizeTradingPost(raw);

    assert.equal(tp.lastSeen, '2026-08-30');
    assert.equal(tp.shopWizardLastSeen, '2026-04-05');
    assert.equal(tp.uniqueOwners90d, 911);
    assert.equal(tp.appearances90d, 1988);

    assert.ok(tp.lots.length > 0, 'expected some lots');
    const first = tp.lots[0];
    assert.equal(first.lot, '447954160');
    assert.equal(first.date, '2026-08-30');
    assert.equal(first.time, '3:18PM');
    assert.equal(first.price, 1150000);
    assert.equal(first.instantBuy, 1150000);
    assert.equal(first.items, 1);

    // A multi-item lot prices the bundle, not the individual item.
    const bundle = tp.lots.find((l) => l.items > 1);
    assert.ok(bundle, 'expected a lot holding several items');
    assert.equal(bundle.price, null, 'no individual price should normalise to null');

    assert.ok(tp.lots.length <= 20, 'lots are capped');
    assert.equal(tp.unavailableReason, null, 'lots present, so nothing to explain');
  });

  await t.test('trading post history withheld for a low-value item', async () => {
    await page.goto('https://items.jellyneo.net/item/117/trading-post-history/');
    const tp = normalizeTradingPost(await page.evaluate(extractTradingPost, SELECTORS.tradingPost));

    assert.equal(tp.lots.length, 0);
    // An empty list here means "deliberately not published", not "no activity".
    assert.match(tp.unavailableReason, /relatively low price/i);
  });

  await t.test('item page', async () => {
    await page.goto('https://items.jellyneo.net/item/5554/');
    const raw = await page.evaluate(extractItemPage, SELECTORS.item);
    const item = normalizeItem(raw);

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
    assert.ok(!('tradingPost' in item), 'trading post is fetched separately');
    assert.match(item.description, /Rainbow Pool/);

    assert.equal(item.history.length, 3);
    assert.deepEqual(item.history[0], { price: 1300000, date: '2026-08-05', change: -500000 });
    assert.deepEqual(item.history[1], { price: 1800000, date: '2026-07-09', change: 500000 });
  });
});
