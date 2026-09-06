// Tab order has to survive two things it cannot control: a tab being hidden
// (the SSW tab without Premium) and the set of tabs changing between builds.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PANEL_TABS, POPOVER_TABS, fullOrder, visibleOrder, moveInOrder,
} from '../src/lib/tab-order.js';

test('an empty or missing order is just the shipped one', () => {
  assert.deepEqual(fullOrder(undefined, PANEL_TABS), PANEL_TABS);
  assert.deepEqual(fullOrder([], PANEL_TABS), PANEL_TABS);
  assert.deepEqual(fullOrder('nonsense', PANEL_TABS), PANEL_TABS);
});

test('a saved order is kept, and junk in it is discarded', () => {
  assert.deepEqual(
    fullOrder(['foodclub', 'dailies', 'favourites'], PANEL_TABS),
    ['foodclub', 'dailies', 'favourites'],
  );
  // A tab this build no longer has, and a duplicate, are both dropped.
  assert.deepEqual(
    fullOrder(['foodclub', 'retired-tab', 'foodclub', 'dailies', 'favourites'], PANEL_TABS),
    ['foodclub', 'dailies', 'favourites'],
  );
});

test('a tab added by a later build lands where it was declared, not last', () => {
  // Someone who reordered before 'dailies' existed should not get it at the end.
  const saved = ['foodclub', 'favourites'];
  assert.deepEqual(fullOrder(saved, PANEL_TABS), ['foodclub', 'dailies', 'favourites']);
});

test('hidden tabs are left out of what renders', () => {
  const order = fullOrder([], POPOVER_TABS);
  const withoutPremium = POPOVER_TABS.filter((id) => id !== 'shops');
  assert.deepEqual(visibleOrder(order, withoutPremium), ['price', 'tp', 'wiz']);
  assert.deepEqual(visibleOrder(order, POPOVER_TABS), ['price', 'tp', 'wiz', 'shops']);
});

test('reordering moves the right tab in both directions', () => {
  const order = ['price', 'tp', 'wiz', 'shops'];
  // Drag the last tab to the front.
  assert.deepEqual(moveInOrder(order, POPOVER_TABS, 3, 0), ['shops', 'price', 'tp', 'wiz']);
  // And the first to the end.
  assert.deepEqual(moveInOrder(order, POPOVER_TABS, 0, 3), ['tp', 'wiz', 'shops', 'price']);
  // A move to where it already is changes nothing.
  assert.equal(moveInOrder(order, POPOVER_TABS, 1, 1), null);
  assert.equal(moveInOrder(order, POPOVER_TABS, 0, 9), null);
});

test('reordering visible tabs does not lose where a hidden one sat', () => {
  // SSW is stored between TP and SW, but hidden because there is no Premium.
  const order = ['price', 'tp', 'shops', 'wiz'];
  const visible = ['price', 'tp', 'wiz'];

  // Drag SW (visible index 2) to the front. SSW must still be next to TP.
  const next = moveInOrder(order, visible, 2, 0);
  assert.deepEqual(next, ['wiz', 'price', 'tp', 'shops']);

  // Turning Premium on brings it back in that spot rather than somewhere new.
  assert.deepEqual(visibleOrder(next, POPOVER_TABS), ['wiz', 'price', 'tp', 'shops']);
});
