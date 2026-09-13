// Customising a pet, against the editor data captured off the live site (see
// fixtures/questlog/README.md). A save is the whole outfit, so the tests pin
// down that nothing worn is ever dropped.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  editorBody, saveBody, readEditor, readEquipped, wearableCandidates, pickRandom, withItem,
  CustomiseError, CUSTOMISE_API_URL, CUSTOMISE_URL,
} from '../src/lib/customise.js';

const editor = () => readEditor(JSON.parse(readFileSync(resolve('test/fixtures/questlog/customise-editor.json'), 'utf8')));

test('the endpoints are the ones the Customise page uses', () => {
  assert.equal(CUSTOMISE_API_URL, 'https://www.neopets.com/amfphp/services/jss/apiservices.phtml');
  assert.equal(CUSTOMISE_URL, 'https://www.neopets.com/customise/');
});

test('loading and saving post what the page posts', () => {
  assert.deepEqual([...editorBody('vothex', 'Testeh').entries()],
    [['method', 'custompeteditordata'], ['username', 'vothex'], ['petname', 'Testeh']]);
  assert.deepEqual([...saveBody('vothex', 'Testeh', { 3: 10618245, 45: 10618158 }).entries()], [
    ['method', 'custompetsavedata'], ['username', 'vothex'], ['petname', 'Testeh'], ['petslot', '1'],
    ['equippedbyzone', '{"3":10618245,"45":10618158}'],
  ]);
});

test('a reply without a pet is an error, not an empty wardrobe', () => {
  assert.throws(() => readEditor({ editordata: null }), CustomiseError);
  assert.throws(() => readEditor(null), CustomiseError);
});

test('what is worn is read zone by zone', () => {
  assert.deepEqual(readEquipped(editor()), { 3: 10618245, 45: 10618158 });
});

test('only items that change nothing already worn are candidates', () => {
  const names = wearableCandidates(editor(), 'Testeh').map((i) => i.name).sort();
  // Worn items, one on another pet, one in a worn zone, and one the registry
  // does not know are all left out.
  assert.deepEqual(names, [
    'Confetti Shower', 'Intricate Border Ink Frame', 'Neovian Clocktower Lights Garland', 'Sunny Background Frame',
  ]);
  const sunny = wearableCandidates(editor(), 'Testeh').find((i) => i.name === 'Sunny Background Frame');
  assert.deepEqual(sunny, { name: 'Sunny Background Frame', closetObjId: 10618239, objInfoId: 78334, zones: ['48'] });
});

test('an item that would hide a worn zone, or be hidden by one, is not a candidate', () => {
  const data = editor();
  const mask = (zone) => '0'.repeat(zone - 1) + '1' + '0'.repeat(52 - zone);
  // Sunny now hides zone 3, where Haunted Trees Background is worn.
  data.object_info_registry['78334'].zones_restrict = mask(3);
  // And the worn foreground now hides zone 44, the ink frame's zone.
  data.object_info_registry['900002'].zones_restrict = mask(44);
  const names = wearableCandidates(data, 'Testeh').map((i) => i.name);
  assert.ok(!names.includes('Sunny Background Frame'), names.join(', '));
  assert.ok(!names.includes('Intricate Border Ink Frame'), names.join(', '));
  assert.ok(names.includes('Confetti Shower'));
});

test('adding an item keeps everything worn, and taking it off is the outfit as it was', () => {
  const before = readEquipped(editor());
  const item = wearableCandidates(editor(), 'Testeh').find((i) => i.name === 'Sunny Background Frame');
  const after = withItem(before, item);
  assert.deepEqual(after, { 3: 10618245, 45: 10618158, 48: 10618239 });
  // The original map is untouched, so saving it again is the removal.
  assert.deepEqual(before, { 3: 10618245, 45: 10618158 });
});

test('the random pick stays inside the list', () => {
  const list = ['a', 'b', 'c'];
  assert.equal(pickRandom(list, () => 0), 'a');
  assert.equal(pickRandom(list, () => 0.9999), 'c');
  assert.equal(pickRandom([], () => 0), null);
});

// --- saving ---------------------------------------------------------------------
import { parseSave } from '../src/lib/customise.js';

test('a save counts only when Neopets reports the update', () => {
  assert.deepEqual(parseSave(readFileSync(resolve('test/fixtures/questlog/customise-save.json'), 'utf8')), { updated: 1 });
  assert.deepEqual(parseSave({ updatecount: 2 }), { updated: 2 });
  assert.throws(() => parseSave('{"updatecount":0}'), CustomiseError);
  assert.throws(() => parseSave('<html>Please log in</html>'), CustomiseError);
  assert.throws(() => parseSave(null), CustomiseError);
});
