// Shop Wizard parsing, against a real captured response.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';
import { wizardBody, parseWizardResponse, WizardError, WIZARD_URL } from '../src/lib/wizard.js';

const doc = (html) => parseHTML(`<html><body>${html}</body></html>`).document;
const sample = () => doc(readFileSync(resolve('test/fixtures/wizard/vo-codestone.html'), 'utf8'));

test('the request body matches what the site posts', () => {
  const body = wizardBody('Vo Codestone');
  const pairs = [...body.entries()];

  assert.equal(WIZARD_URL, 'https://www.neopets.com/np-templates/ajax/wizard.php');
  // Every field twice: plain, and under resubmit_values[...].
  assert.equal(pairs.length, 14);
  assert.equal(body.get('type'), 'process_wizard');
  assert.equal(body.get('shopwizard'), 'Vo Codestone');
  assert.equal(body.get('criteria'), 'exact');
  assert.equal(body.get('min_price'), '1');
  assert.equal(body.get('max_price'), '999999');
  assert.equal(body.get('resubmit_values[shopwizard]'), 'Vo Codestone');
  assert.equal(body.get('resubmit_values[type]'), 'process_wizard');
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
