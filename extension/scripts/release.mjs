#!/usr/bin/env node
// Builds the Chrome extension into release/chrome/, with install instructions,
// and zips it. Tests are run by hand before a release is cut, so this only
// builds and packages.
//
//   npm run release
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const outRoot = join(root, 'release');

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: root, stdio: 'inherit', ...opts });

const README = `# neo-snipe for Chrome

Jelly Neo prices on every Neopets item.

## Install

1. Open \`chrome://extensions\` in Chrome.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select **this folder** (the one containing \`manifest.json\`).
4. Done — open neopets.com.

Chrome grants the extension access to items.jellyneo.net at install, so there is nothing else to
approve.

## Keeping it

An unpacked extension stays installed across restarts, but Chrome forgets it if you move or delete
this folder — so put it somewhere permanent before loading it. Chrome may also show a "Disable
developer mode extensions" warning on startup; dismissing it is fine.

## Using it

Browse to any page on neopets.com with items on it — inventory, a shop, the safety deposit box,
auctions, the trading post. Each item gets a small 🔍 badge in its bottom-right corner (by default
it only appears when you hover the item). Click the badge to look the item up.

The popover shows the current Jelly Neo price, icons to open the item on the trading post and in
auctions, and four tabs:

- **Price** — Jelly Neo's price history.
- **TP** — recent trading post lots.
- **SW** — the Shop Wizard. It returns about twenty shops and a different slice each time, so the
  *again* button adds to the list rather than replacing it.
- **SSW** — the Super Shop Wizard, for Premium accounts.

Nothing in a tab is fetched until you open that tab, since Neopets limits how often you may search.
Wizard results are kept for 15 minutes per item; Jelly Neo prices for a day.

## The panel

The button at the bottom right opens a panel with three tabs:

- **Favourites** — items you have hearted in a popover. Drag to reorder; opening one always fetches
  a fresh price.
- **Dailies** — quick links to the wheels, bargain stocks, lab rays and the rest. Heart the ones you
  use to pin them to a group at the top, also drag-reorderable. Premium-only dailies are hidden
  unless the account has Premium.
- **Food Club** — the day's bets by risk level, each placed with one **Place** button, plus
  links to your current bets and to collecting winnings.

The cog holds the settings, including exporting them to a JSON file and importing it back.

## Updating

This is an unpacked build, so there is no auto-update — a new version is a new folder you load
yourself.

**Back up first, every time:** panel → **cog** → **Backup** → **Save file** saves your settings,
favourite items and favourited dailies as a JSON file. To restore them, use **Load file** and then
**Import**. Import replaces your lists rather than merging them, and an older file still imports
into a newer build.

Updating in place keeps your data only if you unpack over the same folder and press Reload: an
unpacked extension's ID comes from its path, so a folder in a new location starts empty.

## Notes

- Prices come from [Jelly Neo](https://items.jellyneo.net), fetched by the extension itself.
- Prices are Jelly Neo's estimates, not live Neopets data.
- One click, one lookup: nothing is fetched until you ask about an item. Please keep it that way —
  Jelly Neo is a small fan site.

Version ${version}.
`;

console.log(`\nneo-snipe ${version} — building release\n`);
rmSync(outRoot, { recursive: true, force: true });
mkdirSync(outRoot, { recursive: true });

run('npm', ['run', 'build']);

const distPath = join(root, 'dist');
if (!existsSync(join(distPath, 'manifest.json'))) {
  throw new Error('dist/manifest.json is missing — the build did not produce an extension');
}

const dest = join(outRoot, 'chrome');
cpSync(distPath, dest, { recursive: true });
writeFileSync(join(dest, 'README.md'), README);

// zip is available on macOS and on GitHub's runners; skip rather than fail.
try {
  run('zip', ['-qr', join(outRoot, `neo-snipe-${version}-chrome.zip`), 'chrome'], { cwd: outRoot });
} catch {
  console.warn('    (zip unavailable — chrome/ folder written without an archive)');
}

console.log(`\nRelease built in ${dest}\n`);
