// The Purchase an Item helper: the shop list, a shop's stock, the cheapest pick,
// finding a shop with stock, and the haggle page — against pages captured off
// the live site (see fixtures/questlog/README.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';
import {
  SHOPS, SHOP_IDS, shopUrl, shopIdOf, isSoldOut, readShopStock, cheapestItem, pickShop,
  findShopWithStock, readHaggle, isLivePlan, purchasesLeft, SHOPPING_TTL_MS,
} from '../src/lib/shops.js';

const fixture = (f) => readFileSync(resolve('test/fixtures/questlog', f), 'utf8');
const doc = (body) => parseHTML(`<!doctype html><html><body>${body}</body></html>`).document;

test("the shop list is Jelly Neo's standard shops, and only those", () => {
  assert.equal(SHOP_IDS.length, 104);
  assert.equal(SHOPS[7], 'Magical Bookshop');
  assert.equal(SHOPS[38], 'Faerieland Bookshop');
  // Numbers Neopets never used, or shops the directory does not list.
  for (const gone of [6, 11, 19, 28, 29, 32, 33, 52, 64, 65, 99, 109, 115]) assert.ok(!(gone in SHOPS), gone);
  assert.equal(shopUrl(38), 'https://www.neopets.com/objects.phtml?type=shop&obj_type=38');
});

test('a shop page is recognised from its URL', () => {
  assert.equal(shopIdOf('https://www.neopets.com/objects.phtml?type=shop&obj_type=38'), 38);
  assert.equal(shopIdOf('/objects.phtml?obj_type=7&type=shop'), 7);
  assert.equal(shopIdOf('https://www.neopets.com/objects.phtml'), null);
  assert.equal(shopIdOf('https://www.neopets.com/haggle.phtml?obj_info_id=8982'), null);
});

test("a shop's stock is read from its cards, with each item's haggle ids", () => {
  const stock = readShopStock(doc(fixture('shop-in-stock.html')));
  assert.equal(stock.length, 2);
  assert.deepEqual(stock[0], {
    name: 'Battle Ready!',
    price: 669,
    stock: 1,
    objInfoId: '8982',
    stockId: '617600191',
    link: 'https://www.neopets.com/haggle.phtml?obj_info_id=8982&stock_id=617600191&g=3',
    image: 'https://images.neopets.com/items/faeriebook_battleready.gif',
  });
  assert.equal(isSoldOut(doc(fixture('shop-in-stock.html'))), false);
});

test('an emptied shop reads as sold out, with nothing to buy', () => {
  const soldOut = doc(fixture('shop-sold-out.html'));
  assert.equal(isSoldOut(soldOut), true);
  assert.deepEqual(readShopStock(soldOut), []);
});

test('the cheapest item wins, and of two at one price the one with more stock', () => {
  assert.equal(cheapestItem(readShopStock(doc(fixture('shop-in-stock.html')))).name, 'Battle Ready!');
  assert.equal(cheapestItem([
    { name: 'A', price: 50, stock: 1 }, { name: 'B', price: 50, stock: 9 }, { name: 'C', price: 400, stock: 3 },
  ]).name, 'B');
  assert.equal(cheapestItem([]), null);
});

test('shops are picked at random, never twice', () => {
  assert.equal(pickShop(new Set(), () => 0), SHOP_IDS[0]);
  assert.equal(pickShop(new Set(), () => 0.9999), SHOP_IDS[SHOP_IDS.length - 1]);
  assert.equal(pickShop(new Set([SHOP_IDS[0]]), () => 0), SHOP_IDS[1]);
  assert.equal(pickShop(new Set(SHOP_IDS)), null);
});

test('finding a shop skips sold-out ones and stops at the first with stock', async () => {
  const pages = { [shopUrl(SHOP_IDS[0])]: fixture('shop-sold-out.html'), [shopUrl(SHOP_IDS[1])]: fixture('shop-in-stock.html') };
  const asked = [];
  const found = await findShopWithStock(async (url) => { asked.push(url); return doc(pages[url] ?? ''); },
    { random: () => 0, pause: async () => {} });
  assert.deepEqual(asked, [shopUrl(SHOP_IDS[0]), shopUrl(SHOP_IDS[1])]);
  assert.equal(found.shopId, SHOP_IDS[1]);
  assert.equal(found.shopName, SHOPS[SHOP_IDS[1]]);
  assert.equal(found.item.name, 'Battle Ready!');
});

test('finding a shop gives up after its attempts rather than touring every shop', async () => {
  let asked = 0;
  const found = await findShopWithStock(async () => { asked += 1; return doc(fixture('shop-sold-out.html')); },
    { attempts: 3, pause: async () => {} });
  assert.equal(found, null);
  assert.equal(asked, 3);
});

test("the haggle page gives the shopkeeper's price, and the accepted page what was paid", () => {
  assert.deepEqual(readHaggle(doc(fixture('haggle-offer.html'))),
    { itemName: 'Battle Ready!', askingPrice: 669, paid: null, added: null });
  assert.deepEqual(readHaggle(doc(fixture('haggle-accepted.html'))),
    { itemName: 'Battle Ready!', askingPrice: null, paid: 669, added: 'Battle Ready!' });
});

test('a plan lasts while buys are left and shops could still hold the stock', () => {
  const now = Date.parse('2026-09-13T20:00:00Z');
  assert.equal(isLivePlan({ remaining: 2, at: now - 60_000 }, now), true);
  assert.equal(isLivePlan({ remaining: 0, at: now }, now), false);
  assert.equal(isLivePlan({ remaining: 1, at: now - SHOPPING_TTL_MS - 1 }, now), false);
  assert.equal(isLivePlan(null, now), false);
});

test('buys left come from the quest task count', () => {
  assert.equal(purchasesLeft({ tasks: [{ label: 'Purchase Item(s)', done: false, have: 1, need: 3 }] }), 2);
  assert.equal(purchasesLeft({ tasks: [{ label: 'Purchase Item(s)', done: false, have: 3, need: 3 }] }), 0);
  assert.equal(purchasesLeft({ tasks: [{ label: 'Purchase Item(s)', done: false, have: null, need: null }] }), 1);
});
