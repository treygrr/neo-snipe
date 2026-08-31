#!/usr/bin/env node
// Renders icons/icon.svg to the PNG sizes the manifest asks for.
// The SVG is the source of truth; the PNGs are build output that happens to be
// checked in, because the extension manifest cannot point at an SVG.
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

await browser.close();
