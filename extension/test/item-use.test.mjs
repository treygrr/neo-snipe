// Using an item on a pet, against the inventory markup, item popup and reply
// captured off the live site (see fixtures/questlog/README.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';
import {
  readInventory, candidatesFor, readActivePet, readItemActions, actionFor, useBody, parseUse,
  itemInfoUrl, ItemUseError, USE_OBJECT_URL, INVENTORY_URL, USES,
} from '../src/lib/item-use.js';

const fixture = (f) => readFileSync(resolve('test/fixtures/questlog', f), 'utf8');
const doc = (body) => parseHTML(`<!doctype html><html><body>${body}</body></html>`).document;

// Inventory cells in the shape the inventory page renders them, with values
// from the captured account.
const cell = (a) => `<div class="lazy item-img" id="${a.objid}x" onclick="invView2('${a.objid}x');"
  data-itemvalue="${a.value}" data-rarity="${a.rarity}" data-itemtype="${a.type}" data-itemset="${a.set ?? 'np'}"
  data-objid="${a.objid}" data-image="https://images.neopets.com/items/${a.img}.gif" data-itemname="${a.name}"></div>`;
const INVENTORY = doc([
  cell({ name: 'Waterfish', type: 'Food', objid: '1944994546', value: '0 NP', rarity: 101, img: 'vor_waterfish' }),
  cell({ name: 'Space Slug Soup', type: 'Space Food', objid: '1944900001', value: '250 NP', rarity: 40, img: 'space_slug_soup' }),
  cell({ name: 'Red Blush', type: 'Grooming', objid: '1944788232', value: '120 NP', rarity: 35, img: 'red_blush' }),
  cell({ name: 'Blue Kougra Plushie', type: 'Plushies', objid: '1944787782', value: '1,200 NP', rarity: 50, img: 'kougra_plushie' }),
  cell({ name: 'Headless Von Roo Plushie', type: 'Plushies', objid: '1944788389', value: '300 NP', rarity: 70, img: 'vonroo_plushie' }),
  cell({ name: 'Battle Ready!', type: 'Faerie Book', objid: '1944998704', value: '669 NP', rarity: 60, img: 'faeriebook_battleready' }),
  cell({ name: 'Mystery Book', type: 'Book', objid: '1', value: '0 NP', rarity: 1, img: 'x', set: 'nc' }),
].join(''));

// The Grooming tab, as Neopets fills it: the brush is typed `Special` and is
// in there all the same — issue #1, where filtering by type left it out.
const GROOMING_TAB = doc([
  cell({ name: 'Red Blush', type: 'Grooming', objid: '1944788232', value: '120 NP', rarity: 35, img: 'red_blush' }),
  cell({ name: 'Red Long Hair Brush', type: 'Special', objid: '1944788999', value: '0 NP', rarity: 90, img: 'red_long_hair_brush' }),
].join(''));

test('the endpoints are the ones the inventory page uses', () => {
  assert.equal(USE_OBJECT_URL, 'https://www.neopets.com/np-templates/views/useobject.phtml');
  assert.equal(itemInfoUrl('1944998704'), 'https://www.neopets.com/np-templates/views/iteminfo.phtml?obj_id=1944998704');
  assert.equal(INVENTORY_URL, 'https://www.neopets.com/inventory.phtml');
});

test('inventory items are read from their data attributes', () => {
  const items = readInventory(INVENTORY);
  assert.equal(items.length, 7);
  assert.deepEqual(items.find((i) => i.name === 'Battle Ready!'), {
    objId: '1944998704', name: 'Battle Ready!', type: 'Faerie Book',
    image: 'https://images.neopets.com/items/faeriebook_battleready.gif', value: 669, rarity: 60, nc: false,
  });
  // "0 NP" is a known value of nothing, not an unknown one.
  assert.equal(items.find((i) => i.name === 'Waterfish').value, 0);
});

test('the tab\'s items are the candidates, cheapest first, never NC and never by type', () => {
  const names = (kind, d) => candidatesFor(kind, readInventory(d)).map((i) => i.name);
  // Whatever the tab holds is fair game — the NC book is the only one left out.
  assert.deepEqual(names('feed', INVENTORY),
    ['Waterfish', 'Red Blush', 'Space Slug Soup', 'Headless Von Roo Plushie', 'Battle Ready!', 'Blue Kougra Plushie']);
  // The Grooming tab's `Special`-typed brush is a candidate, and the cheaper one.
  assert.deepEqual(names('groom', GROOMING_TAB), ['Red Long Hair Brush', 'Red Blush']);
  assert.deepEqual(candidatesFor('purchase', readInventory(INVENTORY)), []);
});

test('each quest kind asks the inventory for its own tab', () => {
  assert.deepEqual(
    ['feed', 'play', 'read', 'groom'].map((k) => USES[k].tab), [1, 2, 3, 4]);
});

test("the active pet comes from the header's pet link", () => {
  const header = doc(`<div class="nav-profile-dropdown__2020">
    <div class='nav-profile-dropdown-text' style='margin-top:15px'>Welcome, <a href="/userlookup.phtml?user=vothex" class="text-muted">vothex</a></div>
    <div class='nav-profile-dropdown-text'>Active Pet: <a href="/petlookup.phtml?pet=Testeh" class='profile-dropdown-link'>Testeh</a></div>
  </div>`);
  assert.equal(readActivePet(header), 'Testeh');
  // A pet linked anywhere else on the page is not the active one.
  assert.equal(readActivePet(doc('<a href="/petlookup.phtml?pet=SomeoneElse">SomeoneElse</a>')), null);
});

test("an item's popup says what it can do, and only exact pet actions are taken", () => {
  const actions = readItemActions(doc(fixture('iteminfo-plushie.html')));
  assert.ok(actions.includes('Play with Testeh'));
  assert.ok(actions.includes('safetydeposit'));

  assert.equal(actionFor('play', actions, 'Testeh'), 'Play with Testeh');
  assert.equal(actionFor('play', actions, 'testeh'), 'Play with Testeh');
  // The plushie can be fed to Rengargh, but that is not feeding Testeh.
  assert.equal(actionFor('feed', actions, 'Testeh'), null);
  assert.equal(actionFor('feed', actions, 'Rengargh'), 'Feed to Rengargh');
  // No pet, no guess.
  assert.equal(actionFor('play', actions, null), null);
  assert.equal(actionFor('read', ['Read to Testeh'], 'Testeh'), 'Read to Testeh');
  assert.equal(USES.groom.verb, 'Groom');
});

test('using an item posts what the inventory page posts', () => {
  assert.equal(useBody('1944998704', 'Read to Testeh').toString(),
    'obj_id=1944998704&action=Read+to+Testeh&petcare=0');
});

test("the reply says what the pet thought and whether the item is gone", () => {
  const got = parseUse(doc(fixture('use-read-book.html')));
  assert.equal(got.message, "Testeh says 'Thats one of my favourites, thanks!!' Battle Ready! vanishes in a puff of green smoke!");
  assert.equal(got.usedUp, true);
  assert.equal(parseUse(doc('<p>Testeh plays with the plushie happily.</p>')).usedUp, false);
  assert.throws(() => parseUse(doc('   ')), ItemUseError);
});

// --- where the items come from ---------------------------------------------------
import { inventoryItemsUrl, INVENTORY_AJAX_HEADERS, parseInventoryReply } from '../src/lib/item-use.js';

const parse = (html) => parseHTML(`<!doctype html><html>${html}</html>`).document;

test('items come from the call the inventory page fills itself in with, asked as the page asks', () => {
  assert.equal(inventoryItemsUrl(),
    'https://www.neopets.com/np-templates/ajax/inventory.php?itemType=np&alpha=&itemStack=1&action=');
  assert.equal(inventoryItemsUrl(USES.groom.tab),
    'https://www.neopets.com/np-templates/ajax/inventory.php?itemType=np&alpha=&itemStack=1&action=4');
  assert.deepEqual(INVENTORY_AJAX_HEADERS, { 'X-Requested-With': 'XMLHttpRequest' });
});

test("the item call's reply is read cell by cell, and a refusal is an error, not an empty inventory", () => {
  const reply = `<div class='inv-total-count'>Total Items: <b>37</b> / <b>50</b></div>
    <div id='tableRowsId' class='itemgrid7__2020 item-grid'>
      <div class='grid-item'>${cell({ name: 'Homemade Marmalade', type: 'Food', objid: '1800968731', value: '0 NP', rarity: 10, img: 'marmalade' })}</div>
      <div class='grid-item'>${cell({ name: 'Neo Crackers', type: 'Food', objid: '1801704692', value: '106 NP', rarity: 20, img: 'crackers' })}</div>
    </div>`;
  const items = parseInventoryReply(reply, parse);
  assert.deepEqual(items.map((i) => i.name), ['Homemade Marmalade', 'Neo Crackers']);
  assert.equal(candidatesFor('feed', items)[0].name, 'Homemade Marmalade');

  assert.throws(() => parseInventoryReply('{"error":true,"message":"Request denied"}', parse),
    (err) => err instanceof ItemUseError && /Request denied/.test(err.message));
});
