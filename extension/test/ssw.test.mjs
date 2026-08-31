// Super Shop Wizard parsing, against a real captured response.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sswQueryUrl, parseSswResponse, SswError } from '../src/lib/ssw.js';

const sample = () => JSON.parse(readFileSync(resolve('test/fixtures/ssw/query-lu-codestone.json'), 'utf8'));

test('the query URL matches the one the SSW interface sends', () => {
  const url = new URL(sswQueryUrl('lu codestone', { cb: 233550 }));
  assert.equal(url.origin + url.pathname,
    'https://www.neopets.com/np-templates/views/shops/ssw/ssw_query.php');
  const p = url.searchParams;
  assert.equal(p.get('q'), 'lu codestone');
  assert.equal(p.get('caller'), 'h5');
  assert.equal(p.get('json'), '1');
  assert.equal(p.get('partial'), '0', 'exact search by default');
  assert.equal(p.get('lang'), 'en');
  assert.equal(p.get('cb'), '233550');
});

test('a partial search flips only that parameter', () => {
  assert.equal(new URL(sswQueryUrl('x', { exact: false })).searchParams.get('partial'), '1');
});

test('listings come out cheapest first, with a direct buy link', () => {
  const r = parseSswResponse(sample());

  assert.equal(r.itemName, 'Lu Codestone');
  assert.equal(r.neopetsItemId, 7460);
  assert.equal(r.rowCount, 130);
  assert.equal(r.listings.length, 130);

  const first = r.listings[0];
  assert.equal(first.price, 6750);
  assert.equal(first.priceText, '6,750 NP');
  assert.equal(first.amount, 74);
  assert.equal(first.href,
    'https://www.neopets.com/browseshop.phtml?owner=shopowner001&buy_obj_info_id=7460&buy_cost_neopoints=6750');

  const prices = r.listings.map((l) => l.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b), 'already sorted by price');
  for (const l of r.listings) {
    assert.ok(l.owner, 'every row has an owner');
    assert.ok(Number.isFinite(l.price), 'every row has a numeric price');
    assert.match(l.href, /^https:\/\/www\.neopets\.com\/browseshop\.phtml\?owner=/);
  }
});

test("the endpoint's error field is surfaced, not swallowed", () => {
  const refused = sample();
  refused.data.error = 'You must be a Premium member to use the Super Shop Wizard.';
  assert.throws(() => parseSswResponse(refused), (e) => e instanceof SswError && /Premium/.test(e.message));
});

test('a malformed response fails loudly', () => {
  assert.throws(() => parseSswResponse({}), SswError);
  assert.throws(() => parseSswResponse(null), SswError);
});

test('an empty result set is not an error', () => {
  const empty = { data: { rowcount: 0, owners: [], prices: [], links: [], amounts: [], price_str: [], error: '' }, req: {} };
  const r = parseSswResponse(empty);
  assert.equal(r.listings.length, 0);
  assert.equal(r.rowCount, 0);
});
