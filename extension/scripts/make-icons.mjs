#!/usr/bin/env node
// Renders icons/icon.svg to the PNG sizes the manifest asks for, and Neopets'
// own Super Shop Wizard artwork down to the size the launcher draws it at.
// The SVGs are the source of truth; the PNGs are build output that happens to
// be checked in, because the extension manifest cannot point at an SVG — and
// because the launcher inlines its icons, where 49 kB of vector detail drawn
// at 20 px would be carried by every Neopets page for nothing.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'icons/icon.svg'), 'utf8');
const SIZES = [16, 48, 128];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 256, height: 256 }, deviceScaleFactor: 1 });

for (const size of SIZES) {
  // At 16px the fine detail turns to mud, so the smallest size drops it and
  // keeps only the shapes that still read: the ring, the handle, the coin.
  const simplify = size <= 16 ? '.detail{display:none}' : '';
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;background:transparent}
     svg{display:block;width:${size}px;height:${size}px}${simplify}</style>${svg}`,
  );
  const el = await page.$('svg');
  const buf = await el.screenshot({ omitBackground: true });
  writeFileSync(join(root, `icons/icon-${size}.png`), buf);
  console.log(`  icons/icon-${size}.png  ${buf.length} bytes`);
}

// Neopets draws this one at 160 px; the launcher draws it at 20, so render it
// at 2x that for a retina screen and no more.
const SSW_PX = 40;
const sswSvg = readFileSync(join(root, 'icons/ssw-icon.svg'), 'utf8');
await page.setContent(
  `<!doctype html><style>html,body{margin:0;background:transparent}
   svg{display:block;width:${SSW_PX}px;height:${SSW_PX}px}</style>${sswSvg}`,
);
const sswEl = await page.$('svg');
const sswBuf = await sswEl.screenshot({ omitBackground: true });
writeFileSync(join(root, 'icons/ssw-icon.png'), sswBuf);
console.log(`  icons/ssw-icon.png  ${sswBuf.length} bytes`);

await browser.close();
