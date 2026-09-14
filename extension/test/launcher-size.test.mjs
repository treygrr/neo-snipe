// The bar's icon sizes: five steps from 20px, 4px apart, and only those.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ICON_STEPS, ICON_BASE_PX, ICON_STEP_PX, DEFAULT_ICON_STEP, cleanIconStep, iconPx,
} from '../src/lib/launcher-size.js';
import { DEFAULTS } from '../src/lib/messages.js';

test('step 1 is 20px and each step to 5 adds 4px', () => {
  assert.equal(ICON_STEPS, 5);
  assert.equal(ICON_BASE_PX, 20);
  assert.equal(ICON_STEP_PX, 4);
  assert.deepEqual([1, 2, 3, 4, 5].map(iconPx), [20, 24, 28, 32, 36]);
});

test('each bar starts at the size it had before sizes could change', () => {
  assert.equal(iconPx(DEFAULT_ICON_STEP.horizontal), 20);
  assert.equal(iconPx(DEFAULT_ICON_STEP.vertical), 32);
  assert.equal(DEFAULTS.launcherIconStep, DEFAULT_ICON_STEP.horizontal);
  assert.equal(DEFAULTS.verticalIconStep, DEFAULT_ICON_STEP.vertical);
});

test('only whole steps from 1 to 5 are kept', () => {
  for (const step of [1, 3, 5]) assert.equal(cleanIconStep(step, 4), step);
  for (const bad of [0, 6, 2.5, '3', null, undefined, NaN]) assert.equal(cleanIconStep(bad, 4), 4);
});
