// Shop Wizard parsing, against a real captured response.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';
import { wizardBody, parseWizardResponse, WizardError, WIZARD_URL } from '../src/lib/wizard.js';

const doc = (html) => parseHTML(`<html><body>${html}</body></html>`).document;
const sample = () => doc(readFileSync(resolve('test/fixtures/wizard/vo-codestone.html'), 'utf8'));

test('the request body matches what the site posts, field for field', () => {
  const body = wizardBody('eo codestone');

  assert.equal(WIZARD_URL, 'https://www.neopets.com/np-templates/ajax/wizard.php');
  assert.deepEqual([...body.entries()], [
    ['type', 'process_wizard'],
    ['feedset', '0'],
    ['shopwizard', 'eo codestone'],
    ['table', 'shop'],
    ['criteria', 'exact'],
    ['min_price', '0'],
    ['max_price', '999999'],
  ]);
});

test('a resubmitted search is not what a fresh one sends', () => {
  // An early capture carried every field twice, under resubmit_values[...].
  // That is the page forwarding a previous search, not a first request.
  const keys = [...wizardBody('x').keys()];
  assert.ok(!keys.some((k) => k.startsWith('resubmit_values')), keys.join(','));
});

test('listings come out cheapest first with shop links', () => {
  const r = parseWizardResponse(sample());

  assert.equal(r.itemName, 'Vo Codestone');
  assert.equal(r.listings.length, 20);

  const first = r.listings[0];
  assert.equal(first.owner, 'shopper001');
  assert.equal(first.price, 3900);
  assert.equal(first.priceText, '3,900 NP');
  assert.equal(first.amount, 9);
  assert.equal(first.href,
    'https://www.neopets.com/browseshop.phtml?owner=shopper001&buy_obj_info_id=7461&buy_cost_neopoints=3900');

  const prices = r.listings.map((l) => l.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  for (const l of r.listings) {
    assert.ok(l.owner && l.price > 0 && l.amount > 0, JSON.stringify(l));
    assert.match(l.href, /^https:\/\/www\.neopets\.com\/browseshop\.phtml\?owner=/);
  }
});

test('the header row is not mistaken for a listing', () => {
  const r = parseWizardResponse(sample());
  assert.ok(!r.listings.some((l) => /shop owner/i.test(l.owner)));
});

test('being told to slow down is reported as that, not as no results', () => {
  const d = doc('<p>You have made too many searches. Please wait a little while.</p>');
  assert.throws(() => parseWizardResponse(d),
    (e) => e instanceof WizardError && /slow down/i.test(e.message));
});

test('a genuine empty result is not an error', () => {
  const d = doc("<div class='wizard-results-text'><p>Sorry, no shops were found.</p></div>");
  const r = parseWizardResponse(d);
  assert.deepEqual(r.listings, []);
});

test('an unreadable reply fails loudly rather than looking empty', () => {
  // No listings and no message we recognise — the layout probably changed.
  assert.throws(() => parseWizardResponse(doc('<div>something else entirely</div>')),
    (e) => e instanceof WizardError && /layout may have changed/i.test(e.message));
});

test('the referer rejection is reported as itself, not as an empty shop list', () => {
  // Captured live by calling the endpoint without a referrer.
  const html = readFileSync(resolve('test/fixtures/wizard/wrong-place-error.html'), 'utf8');
  assert.throws(() => parseWizardResponse(doc(html)),
    (e) => e instanceof WizardError && /wrong page/i.test(e.message));
});

test('the referrer the endpoint demands is the wizard page', async () => {
  const { WIZARD_REFERRER } = await import('../src/lib/wizard.js');
  assert.equal(WIZARD_REFERRER, 'https://www.neopets.com/shops/wizard.phtml');
});

// --- accumulating across searches ------------------------------------------
import { mergeListings } from '../src/lib/wizard.js';

const row = (owner, price, amount = 1) => ({ owner, price, amount, priceText: `${price} NP`, href: `#${owner}` });

test('a second search adds shops rather than replacing them', () => {
  const merged = mergeListings([row('alice', 300), row('bob', 500)], [row('carol', 400)]);
  assert.deepEqual(merged.map((l) => l.owner), ['alice', 'carol', 'bob'], 'cheapest first');
  assert.equal(merged.length, 3);
});

test('a shop seen twice appears once, with its newer price', () => {
  const merged = mergeListings([row('alice', 300, 5)], [row('alice', 250, 2)]);
  assert.equal(merged.length, 1, 'one row per owner');
  assert.equal(merged[0].price, 250, 'the newer search wins');
  assert.equal(merged[0].amount, 2);
});

test('a repriced shop moves to its new position', () => {
  const merged = mergeListings(
    [row('alice', 100), row('bob', 200), row('carol', 300)],
    [row('alice', 900)],
  );
  assert.deepEqual(merged.map((l) => l.owner), ['bob', 'carol', 'alice']);
});

test('merging is safe with nothing on either side', () => {
  assert.deepEqual(mergeListings(), []);
  assert.deepEqual(mergeListings([], [row('a', 1)]).map((l) => l.owner), ['a']);
  assert.deepEqual(mergeListings([row('a', 1)], []).map((l) => l.owner), ['a']);
});

test('a row with no price sorts last rather than first', () => {
  const merged = mergeListings([], [{ owner: 'x', price: null }, row('y', 50)]);
  assert.deepEqual(merged.map((l) => l.owner), ['y', 'x']);
});
