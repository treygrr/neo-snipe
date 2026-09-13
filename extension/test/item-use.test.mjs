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

test('each quest kind looks at its own kind of item, cheapest first, never NC', () => {
  const items = readInventory(INVENTORY);
  const names = (kind) => candidatesFor(kind, items).map((i) => i.name);
  assert.deepEqual(names('read'), ['Battle Ready!']);
  assert.deepEqual(names('feed'), ['Waterfish', 'Space Slug Soup']);
  assert.deepEqual(names('play'), ['Headless Von Roo Plushie', 'Blue Kougra Plushie']);
  assert.deepEqual(names('groom'), ['Red Blush']);
  assert.deepEqual(candidatesFor('purchase', items), []);
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
