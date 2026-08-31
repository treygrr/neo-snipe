// Export/import has to survive version drift, so this pins the format and the
// rules for reading a file written by a different build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseExport, toJson, ImportError, EXPORT_VERSION } from '../src/lib/settings-io.js';

const good = {
  app: 'neo-snipe',
  version: EXPORT_VERSION,
  exportedAt: '2026-08-31T00:00:00.000Z',
  settings: { hoverOnly: false, premium: true },
  favourites: [{ name: 'Eo Codestone', imageHash: 'codestone5', imageUrl: null, addedAt: 1 }],
  dailyFavourites: [{ label: 'Food Club', url: 'https://www.neopets.com/pirates/foodclub.phtml?type=bet' }],
};

test('a file we wrote reads back unchanged', () => {
  const r = parseExport(toJson(good));
  assert.deepEqual(r.settings, { hoverOnly: false, premium: true });
  assert.equal(r.favourites[0].name, 'Eo Codestone');
  assert.equal(r.dailyFavourites[0].url, good.dailyFavourites[0].url);
});

test('a newer file is refused rather than half-read', () => {
  assert.throws(() => parseExport(toJson({ ...good, version: EXPORT_VERSION + 5 })),
    (e) => e instanceof ImportError && /newer version/.test(e.message));
});

test('an older file still loads what it can', () => {
  // No premium key, and no dailyFavourites at all: both simply absent.
  const older = { app: 'neo-snipe', version: 1, settings: { hoverOnly: true }, favourites: good.favourites };
  const r = parseExport(toJson(older));
  assert.deepEqual(r.settings, { hoverOnly: true }, 'only what was present');
  assert.equal(r.favourites.length, 1);
  assert.deepEqual(r.dailyFavourites, []);
});

test('unknown keys are ignored, not copied into storage', () => {
  const r = parseExport(toJson({ ...good, settings: { ...good.settings, somethingElse: 'x' }, extra: 1 }));
  assert.deepEqual(Object.keys(r.settings).sort(), ['hoverOnly', 'premium']);
});

test('settings of the wrong type are dropped', () => {
  const r = parseExport(toJson({ ...good, settings: { hoverOnly: 'yes', premium: true } }));
  assert.deepEqual(r.settings, { premium: true }, 'a string is not a boolean');
});

test('junk entries in the lists are filtered out', () => {
  const r = parseExport(toJson({
    ...good,
    favourites: [{ name: '  Spaced  ' }, { name: '' }, null, 'nope', { imageHash: 'x' }],
    dailyFavourites: [
      { label: 'Evil', url: 'https://evil.example.com/x' },
      { label: 'Fine', url: 'https://www.neopets.com/wishing.phtml' },
    ],
  }));
  assert.deepEqual(r.favourites.map((f) => f.name), ['Spaced'], 'trimmed, and the rest dropped');
  assert.deepEqual(r.dailyFavourites.map((d) => d.url), ['https://www.neopets.com/wishing.phtml'],
    'a daily link must point at neopets.com');
});

test('an export from another app is refused', () => {
  assert.throws(() => parseExport(toJson({ ...good, app: 'something-else' })), ImportError);
});

test('malformed input fails with a readable message', () => {
  assert.throws(() => parseExport('not json'), (e) => /valid JSON/.test(e.message));
  assert.throws(() => parseExport('[]'), (e) => /does not look like/.test(e.message));
  assert.throws(() => parseExport('null'), ImportError);
});
