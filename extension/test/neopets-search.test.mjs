// The search URLs are copied from Jelly Neo's "Find This Item" links; this
// checks the builders still produce exactly those shapes.
//
// Only two are links. The Shop Wizard is a POST and the Super Shop Wizard is a
// JSON endpoint, so both live in popover tabs instead.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEARCHES, searchesFor } from '../src/lib/neopets-search.js';

const NAME = 'Faerie Paint Brush';
const byId = (id) => SEARCHES.find((s) => s.id === id);

test('each search matches the URL Jelly Neo links to', () => {
  assert.equal(byId('trading').url(NAME),
    'https://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&sort_by=newest&search_string=Faerie+Paint+Brush');
  assert.equal(byId('auctions').url(NAME),
    'https://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie=Faerie+Paint+Brush');
});

test('only the trading post and auction house are links', () => {
  assert.deepEqual(searchesFor(NAME).map((s) => s.id), ['trading', 'auctions']);
});

test('each link carries an icon name and a description', () => {
  for (const s of searchesFor(NAME)) {
    assert.ok(s.icon, `${s.id} has no icon`);
    assert.ok(s.title.length > 10, `${s.id} has no usable title`);
  }
});

test('names with punctuation and spaces are encoded, not broken', () => {
  const url = byId('trading').url("Ol' Stripey & Co.");
  assert.ok(!/ /.test(url), 'no raw spaces');
  assert.ok(url.includes('%26'), 'an ampersand must not start a new parameter');
  // The one it belongs to, and no others.
  assert.equal(url.split('search_string=')[1].split('&').length, 1);
});

test('every search points at neopets.com', () => {
  for (const s of searchesFor(NAME)) assert.match(s.href, /^https:\/\/www\.neopets\.com\//, s.id);
});
