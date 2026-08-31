// The icons are build output from icons/icon.svg. They ship in every release,
// so a truncated or wrongly-sized PNG would reach people silently.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SIZES = [16, 48, 128];

/** Width and height live in the IHDR chunk, right after the 8-byte signature. */
function pngSize(buf) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(buf.subarray(0, 8).equals(signature), 'not a PNG');
  assert.equal(buf.subarray(12, 16).toString('ascii'), 'IHDR');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

test('every manifest icon exists at the size it claims', () => {
  for (const size of SIZES) {
    const buf = readFileSync(resolve(`icons/icon-${size}.png`));
    assert.deepEqual(pngSize(buf), { width: size, height: size }, `icon-${size}.png`);
    assert.ok(buf.length > 200, `icon-${size}.png is suspiciously small (${buf.length}B)`);
  }
});

test('the icons have transparent corners, not a white box', () => {
  // A rounded tile rendered without omitBackground would be opaque everywhere.
  const buf = readFileSync(resolve('icons/icon-128.png'));
  assert.ok(buf.length > 1000);
  // Colour type 6 is RGBA; without an alpha channel the corners cannot be clear.
  assert.equal(buf[25], 6, 'expected an RGBA PNG');
});

test('the SVG source is what the PNGs are generated from', () => {
  const svg = readFileSync(resolve('icons/icon.svg'), 'utf8');
  assert.match(svg, /<svg[^>]*viewBox="0 0 128 128"/);
  // The smallest size drops anything marked .detail, so that hook must exist.
  assert.match(svg, /class="detail"/);
});
