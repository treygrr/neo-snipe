#!/usr/bin/env node
// Builds all three browser targets into release/<browser>/, each with install
// instructions for that browser, and zips them.
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

const TARGETS = [
  // `smoke` runs against the assembled release folder, not the build directory:
  // shipping an artifact nobody has loaded is how broken releases happen.
  { browser: 'chrome', script: 'build', dist: 'dist', smoke: ['node', ['test/e2e.mjs']] },
  { browser: 'firefox', script: 'build:firefox', dist: 'dist-firefox', smoke: ['node', ['test/bundle.mjs'], { NS_TARGET: 'firefox' }] },
  { browser: 'safari', script: 'build:safari', dist: 'dist-safari', smoke: ['node', ['test/bundle.mjs'], { NS_TARGET: 'safari' }] },
];

const skipSmoke = process.argv.includes('--no-verify');

const SHARED_TAIL = `
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
- **Food Club** — the day's bets by risk level, with **Fill** and **Place** buttons.

The cog holds the settings, including exporting them to a JSON file and importing it back.

## Notes

- Nothing else to install and nothing to run. The extension fetches prices from
  [Jelly Neo](https://items.jellyneo.net) itself.
- Prices are Jelly Neo's estimates, not live Neopets data.
- One click, one lookup: nothing is fetched until you ask about an item. Please keep it that way —
  Jelly Neo is a small fan site.

Version ${version}.
`;

const READMES = {
  chrome: `# neo-snipe for Chrome

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
${SHARED_TAIL}`,

  firefox: `# neo-snipe for Firefox

Jelly Neo prices on every Neopets item.

## Install

1. Open \`about:debugging#/runtime/this-firefox\` in Firefox.
2. Click **Load Temporary Add-on…**.
3. Select **\`manifest.json\`** in this folder.
4. **Then grant access:** open the extension's options (\`about:addons\` → neo-snipe → Preferences)
   and click **Grant access to Jelly Neo**.

Step 4 is not optional. Firefox treats Manifest V3 host permissions as opt-in, so every lookup
fails until you allow it.

## Keeping it

**A temporary add-on is removed when Firefox restarts**, and you will have to load it again. That
is a Firefox restriction on unsigned extensions, not a bug here. A permanent install requires the
package to be signed through [addons.mozilla.org](https://addons.mozilla.org).
${SHARED_TAIL}`,

  safari: `# neo-snipe for Safari

Jelly Neo prices on every Neopets item.

## Before you start

Safari extensions have to ship inside a macOS app, so unlike Chrome and Firefox this folder is not
directly installable. You need **macOS and Xcode** (free from the Mac App Store) to wrap it.

If you do not have Xcode, use the Chrome or Firefox build instead.

## Install

1. Wrap this folder in an app — run this in a terminal, from the directory containing this folder:

   \`\`\`bash
   xcrun safari-web-extension-converter safari \\
     --app-name "neo-snipe" \\
     --bundle-identifier com.example.neo-snipe \\
     --macos-only --no-prompt
   \`\`\`

   Xcode will open the generated project.

2. Press **▶ Run** in Xcode. The app launches; quit it once it has.
3. Safari → Settings → **Advanced** → tick **Show features for web developers**.
4. Safari → **Develop** → tick **Allow Unsigned Extensions**.
5. Safari → Settings → **Extensions** → enable **neo-snipe**.
6. Still under Extensions, set **neopets.com** and **items.jellyneo.net** to **Always Allow**.

## Keeping it

**Step 4 resets every time Safari restarts**, and the extension is disabled until you re-tick it.
Avoiding that requires signing the app with a paid Apple Developer account.
${SHARED_TAIL}`,
};

console.log(`\nneo-snipe ${version} — building release\n`);
rmSync(outRoot, { recursive: true, force: true });
mkdirSync(outRoot, { recursive: true });

for (const { browser, script, dist } of TARGETS) {
  console.log(`==> ${browser}`);
  run('npm', ['run', script]);

  const distPath = join(root, dist);
  if (!existsSync(join(distPath, 'manifest.json'))) {
    throw new Error(`${dist}/manifest.json is missing — the ${browser} build did not produce an extension`);
  }

  const dest = join(outRoot, browser);
  cpSync(distPath, dest, { recursive: true });
  writeFileSync(join(dest, 'README.md'), READMES[browser]);

  if (!skipSmoke) {
    const [cmd, args, env] = TARGETS.find((t) => t.browser === browser).smoke;
    console.log(`    verifying release/${browser}/ ...`);
    run(cmd, args, { env: { ...process.env, ...env, NS_DIST: dest } });
  }

  // zip is available on macOS and on GitHub's runners; skip rather than fail.
  try {
    run('zip', ['-qr', join(outRoot, `neo-snipe-${version}-${browser}.zip`), browser], { cwd: outRoot });
  } catch {
    console.warn(`    (zip unavailable — ${browser}/ folder written without an archive)`);
  }
}

writeFileSync(join(outRoot, 'README.md'), `# neo-snipe ${version}

Pick the folder for your browser and follow the README inside it:

| Browser | Folder | Notes |
|---|---|---|
| Chrome | [\`chrome/\`](chrome/README.md) | Easiest. Load unpacked, done. |
| Firefox | [\`firefox/\`](firefox/README.md) | Needs a permission granted, and reloading after each restart. |
| Safari | [\`safari/\`](safari/README.md) | Needs macOS and Xcode to wrap it in an app. |

There is no server to run and nothing else to install.
`);

console.log(`\nRelease built in ${outRoot}\n`);
for (const { browser } of TARGETS) console.log(`  release/${browser}/`);
console.log('');
