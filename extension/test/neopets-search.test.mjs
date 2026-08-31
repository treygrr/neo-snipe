// The search URLs are copied from Jelly Neo's "Find This Item" links; this
// checks the builders still produce exactly those shapes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEARCHES, SUPER_WIZARD, searchesFor } from '../src/lib/neopets-search.js';

const NAME = 'Faerie Paint Brush';

test('each search matches the URL Jelly Neo links to', () => {
  const byId = Object.fromEntries(SEARCHES.map((s) => [s.id, s.url(NAME)]));

  assert.equal(byId.wizard,
    'https://www.neopets.com/shops/wizard.phtml?string=Faerie+Paint+Brush');
  assert.equal(byId.trading,
    'https://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&sort_by=newest&search_string=Faerie+Paint+Brush');
  assert.equal(byId.auctions,
    'https://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie=Faerie+Paint+Brush');
});

test('names with punctuation and spaces are encoded, not broken', () => {
  const url = SEARCHES[0].url("Ol' Stripey & Co.");
  assert.ok(url.startsWith('https://www.neopets.com/shops/wizard.phtml?string='));
  assert.ok(!/ /.test(url), 'no raw spaces');
  assert.ok(url.includes('%26'), 'an ampersand must not start a new parameter');
  assert.ok(url.includes("%27") || url.includes("'"), 'apostrophe survives');
});

test('the Super Shop Wizard is only offered to Premium', () => {
  assert.equal(searchesFor(NAME).length, 3);
  assert.equal(searchesFor(NAME, { premium: true }).length, 4);
  assert.equal(searchesFor(NAME, { premium: true }).at(-1).id, SUPER_WIZARD.id);
});

test('every search points at neopets.com', () => {
  for (const s of searchesFor(NAME, { premium: true })) {
    assert.match(s.href, /^https:\/\/www\.neopets\.com\//, s.id);
  }
});
