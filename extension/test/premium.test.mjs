// Premium detection, against nav markup captured from a subscribed account.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';
import { detectPremium } from '../src/lib/premium.js';

const doc = (html) => parseHTML(`<html><body>${html}</body></html>`).document;
const fixture = (f) => readFileSync(resolve('test/fixtures/premium', f), 'utf8');

test('a subscribed nav is detected as Premium', () => {
  assert.equal(detectPremium(doc(fixture('nav-with-premium.html'))), true);
});

test('the same nav without the premium entries is not', () => {
  assert.equal(detectPremium(doc(fixture('nav-without-premium.html'))), false);
});

test('a page with no nav is unknown, not a denial', () => {
  // Absence of premium links only means something where the nav is rendered.
  assert.equal(detectPremium(doc('<p>an error page, or a bare fragment</p>')), null);
  assert.equal(detectPremium(null), null);
});

test('the Super Shop Wizard icon alone is enough', () => {
  assert.equal(detectPremium(doc('<div class="nav-bar"><div class="navsub-ssw-icon__2020"></div></div>')), true);
});
