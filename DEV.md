# neo-snipe — development

Everything about building, testing and changing neo-snipe. For what it does, see the
[README](README.md).

## Architecture

```
neopets.com page
  └─ content script  ── finds items, injects plain-DOM badges and the bar
        └─ on click: mounts the Vue + Vuetify panel/popover into a shadow root
        │ runtime.sendMessage
  └─ service worker  ── cache (storage.local) → dedupe → rate limit
        └─ fetch items.jellyneo.net, parse with linkedom
              search page → item page → (on demand) trading post history
```

Jelly Neo serves complete server-rendered HTML to a plain fetch, so no browser engine is needed to
read it. `host_permissions` for `items.jellyneo.net` is what exempts the service worker's requests
from CORS; content scripts cannot fetch cross-origin in MV3, which is why the worker does it.

Everything that talks to Neopets itself (Shop Wizard, SSW, Food Club, Quest Log, Magma Pool,
auctions) runs from the content script or the panel, which live in the Neopets page: same-origin,
carrying your session, with no host permission for neopets.com needed.

Each source folder has a `FEATURE.md` mapping its files; keep those current when you change code.

## Releases

```bash
cd extension
npm run release
```

Builds the Chrome extension into `extension/release/chrome/`, with install instructions inside,
plus a zip of it. Releases are Chrome only, and the release does not run tests — run them yourself
before cutting one.

Pushing a `v*` tag runs the same thing in CI (`.github/workflows/release.yml`) and attaches the
zip to a GitHub release. The version lives in `extension/package.json` and
`extension/package-lock.json`.

## Building from source

### Chrome

```bash
cd extension
npm install
npm run build
```

`chrome://extensions` → enable Developer mode → **Load unpacked** → pick `extension/dist`. The
options page has a **Test a lookup** button to confirm it can reach Jelly Neo.

### Working on it

You should not have to install the extension by hand every time:

```bash
npm run fixture                  # offline test page, no login and no network
npm run dev:browser              # real neopets.com, login persists between runs
npm run dev:browser -- --fresh   # wipe the saved profile
npm run dev                      # Vite with hot reload, run alongside
```

`npm run fixture` is the fast loop for UI work: it builds if needed, then opens a browser with the
extension loaded on the same saved markup the tests use — every item surface on one page, the Food
Club bet form and the daily sets, with Jelly Neo answered from fixtures. The routes are shared with
the end-to-end tests (`test/routes.mjs`) so the two cannot drift.

`dev:browser` launches Chromium with the built extension side-loaded and a persistent profile, so
your Neopets login survives between runs. It reports whether the extension actually loaded, and
clears a stale profile lock left by an uncleanly closed window. `--fresh` starts clean.

Recent Google Chrome refuses `--load-extension`, so this uses Playwright's bundled Chromium.
Firefox cannot side-load from Playwright; use `npm run test:firefox`, or load
`dist-firefox/manifest.json` through `about:debugging`.

### Firefox

```bash
cd extension
npm run build:firefox
```

`about:debugging` → **This Firefox** → **Load Temporary Add-on** → pick any file in
`extension/dist-firefox`. Then open the extension's options and click **Grant access to Jelly Neo**:
Firefox treats MV3 host permissions as opt-in, so lookups fail until you do. Temporary add-ons are
removed when Firefox restarts; a permanent install needs signing through addons.mozilla.org. The
build declares a fixed add-on ID (`neo-snipe@treygrr`), so storage survives reloading it.

### Safari

Safari extensions have to ship inside a macOS app, so this needs Xcode:

```bash
cd extension
npm run build:safari-app
```

That builds `dist-safari/`, generates the Xcode wrapper into `safari/neo-snipe/`, and compiles the
app. Then:

1. `open safari/build/Build/Products/Debug/neo-snipe.app` once to register the extension, then quit it.
2. Safari → Settings → Advanced → **Show features for web developers**.
3. Safari → Develop → **Allow Unsigned Extensions** (resets every time Safari restarts).
4. Safari → Settings → Extensions → enable **neo-snipe**, and set neopets.com to **Always Allow**.

Set `SAFARI_BUNDLE_ID` to use your own bundle identifier; changing it makes macOS treat it as a
different extension, with empty storage.

The generated Xcode project is checked in. `build:safari-app` deletes and recreates it each run, so
`project.pbxproj` shows up rewritten every time. Xcode's derived data under `safari/build/` stays
out of git. The project's file references point at `../../../extension/dist-safari/`, so rebuilding
with `npm run build:safari` is enough to change what the app loads.

## How it finds items

Neopets renders items several different ways, so there is no single selector. The captured markup
lives in `extension/test/fixtures/neopets-*.html` and the detection tests run against it.

| Surface | Element | Image URL from | Name from |
|---|---|---|---|
| Inventory | `div.item-img` | `data-src` (lazy-loaded) | `data-itemname` |
| Main shops | `div.item-img` | inline `background-image` | `data-name` |
| Safety deposit box | `img.sdb-item-img` | `src` | `alt` |
| Auctions | `img.ah2_thumb` | `src` | a link in the sibling `<td>` |
| Trading post | `img` | `src` | `p.item-name-text` |

Neopets' `obj_info_id` is **not** used: it is Neopets' item id and has nothing to do with Jelly
Neo's (Potion of Concealment is 8668 on Neopets and 2243 on Jelly Neo, whose 8668 is a White
Chocolate Aisha). Every lookup resolves by name and image hash.

An item is not necessarily an `<img>`, and image URLs are often protocol-relative. `detect.js`
resolves the image from `src`, `data-src`, `data-image`, or an inline background, then the name in
order of reliability: data attributes, a labelled name node nearby, `alt`, then a link in the row.
On the grid surfaces **`alt` and `title` hold the item description, not its name**, so `alt` is
only consulted on a real `<img>`. When no name can be resolved the element is skipped — a wrong name
is worse than no badge.

## Implementation notes

**Shop Wizard.** An endpoint that answers with an HTML fragment (`wizard.js` parses markup). It
refuses requests that did not come from the wizard page, so the fetch sets the `referrer` option
(allowed, unlike the `Referer` header) to the wizard page. It returns about twenty shops, a
different slice each time, so repeated searches merge: one row per owner, the newer price winning.
Both wizards search only when their tab or panel asks, and cache per item for
`wizCacheMinutes`/`sswCacheMinutes`.

**Super Shop Wizard.** A JSON endpoint (`/np-templates/views/shops/ssw/ssw_query.php`) that only
answers Premium accounts; its own `error` field is shown as-is.

**Premium detection.** Read from the site navigation, which carries `/premium/…` links and the SSW
icon only for subscribers. A page without the nav returns *unknown* rather than *no*, so the last
answer stands. Probing the SSW endpoint would also work but spends a request every time.

**Dailies.** Every URL is taken verbatim from [Jelly Neo's](https://www.jellyneo.net/?go=dailies)
and [The Daily Neopets'](https://thedailyneopets.com/dailies) guides, and `src/lib/dailies.js` is
generated from them. Premium-only links are identified by URL path (`/premium/…`), not by hand.

**Food Club.** The round is read from `/pirates/foodclub.phtml?type=bet`, the daily sets from
[~Shrmsh](https://www.neopets.com/~Shrmsh). **Place** requests `process_foodclub.phtml` with the
whole bet on the query string — the URL shape is [neofood.club's](https://neofood.club), read from
its bundle. A placed bet is a 302 to `?type=current_bets`; a refusal is a 200 carrying Neopets'
error block, whose wording goes into the toast (captured in `test/fixtures/foodclub/refused.html`).
Placed bets are matched against `?type=current_bets` by arena-and-name pairs, since the two pages
share no id; that table's `<br>`-separated lines run together under `textContent`, and its last row
is a totals row. Done-marks are stored against the round number. The e2e suite cannot fulfil a
redirect a `fetch` follows, so the success rule is unit-tested over `wasPlaced()`.

**Quest Log.** `retrieveQuests.php` and `claimRewards.php` take FormData with the page's `_ref_ck`.
Runners use the fishing POST, the wheels' `getResult.php`, the inventory's item-use endpoints
(`inventory.php` needs `X-Requested-With`), the customisation API
(`custompeteditordata`/`custompetsavedata`), and a `no-cors` load of the NC Mall. The Purchase an
Item helper only marks the shop's cheapest item and fills the haggle offer; buying stays the
user's click. Captured replies and endpoints are in `test/fixtures/questlog/`.

**Fast Relist.** The inventory's auction form posts `obj_id`, `start_price`, `min_increment`,
`duration`, `neofriends_only` and `guild_members_only` (`on`/`off`) to `/add_auction.phtml`. Saved
relists are keyed by item name in storage.local (`fastRelist`), since an object id belongs to one
copy of an item; Make auction reads the current copy's id from the inventory grid. The reply to a
created auction has not been captured yet, so success is currently read as "no refusal wording".

**Toolbar button.** Disabled everywhere except Neopets. Rather than take the `tabs` permission, it
starts disabled and each content script enables it for its own tab.

## Notes on the design

**Why lookups happen in the service worker.** MV3 service workers have no DOM, so parsing uses
`linkedom` rather than `DOMParser`.

**Why trading post history is a second request.** It lives on its own Jelly Neo page, generated on
demand, which can take ~20s for a heavily traded item. It is fetched only when that tab is opened.
An empty lot list is not always "no activity": Jelly Neo withholds TP history for low-value items,
and the popover says so.

**Why badges and the bar are plain DOM.** A safety deposit box page can show 100+ items, and the
bar is on every page. There is one Vue app, mounted lazily on first use; in the Chrome build the
Vuetify bundle is not downloaded until then.

**Why Safari and Firefox get a different build.** Safari can neither `fetch()` a web-accessible
resource nor dynamically `import()` one from a content script, and Firefox has trouble with dynamic
import there too. So `--mode safari` and `--mode firefox` use a statically bundled content entry
(`src/content/index.safari.js`), inline the stylesheet, and flatten CRXJS's dynamic-import loaders
into classic scripts. Firefox's background becomes an event page (`background.scripts`). The cost
is a ~660KB content script on every page instead of on first click. Extension APIs go through
`src/lib/ext-api.js`, which prefers `browser` over `chrome` and falls back from `storage.sync` to
`storage.local`, since Safari can refuse sync without iCloud.

**Why the CSS takes a detour.** Vuetify's component modules each `import "./X.css"`, which would
get wired into `manifest.content_scripts.css` and injected into the Neopets page.
`vite-plugin-neosnipe.js` strips that wiring and routes the stylesheet into the shadow root instead.
Module preload and CSS code splitting are off, because Vite emits those URLs page-relative. Vuetify
components are registered explicitly in `src/ui/vuetify.js` — add new ones there.

**Why `:root` gets rewritten to `:host`.** Vuetify puts real defaults in a `:root` block, including
`--v-theme-overlay-multiplier`, which its hover rules multiply by. Inside a shadow root `:root`
matches nothing, the `calc()` goes invalid and every hover renders as a solid black wash.
`mount.js` rewrites `:root` to `:host`, and copies Vuetify's generated theme colours in from
`document.head`.

**Icons are `@mdi/js` SVGs, not the MDI webfont** — `@font-face` inside a shadow root does not
resolve in Chrome.

## Being a good neighbour

Jelly Neo is a small fan site. **One click, one lookup** — no batch or prefetch, so a page showing
100 items costs Jelly Neo nothing until you ask about one. Requests are serialised with a ~700ms
floor between them, identical lookups in flight are coalesced, and results are cached for 24h.
Keep it that way if you extend this. The same goes for Neopets: nothing scans shops, and actions
that spend or list things (bets, auctions, quest runners, purchases) run only from a click.

## Tests

```bash
cd extension
npm run test:unit                              # every parser suite — no network, no browser
npm run test:jellyneo                          # or one at a time: Jelly Neo parsing
npm run test:detect                            # detection against real Neopets markup
npm run test:foodclub                          # Food Club odds, sets, bet resolution and placing
npm run test:wizard                            # Shop Wizard parsing and result merging
npm run test:ssw                               # Super Shop Wizard responses
npm run test:premium                           # reading Premium out of the site nav
npm run test:settings                          # settings export and import
npm run test:search                            # trading post and auction search URLs
npm run test:icons                             # the shipped PNGs match icons/icon.svg
npm run build   && npm run test:e2e              # the real thing, in real Chrome
npm run build:safari  && npm run test:safari     # the Safari bundle, in WebKit
npm run build:firefox && npm run test:firefox    # the Firefox bundle, in Gecko
```

Nothing touches the network: the end-to-end suites serve Neopets and Jelly Neo from saved pages.
Run the browser suites one after another, not in parallel.

`test:e2e` loads the built extension into Chrome, serves a fake Neopets page from the neopets.com
origin, and drives the badges, popover, bar, panels and settings. `test:safari` and `test:firefox`
run the flattened bundles in WebKit and Gecko behind a stubbed extension runtime
(`test/bundle.mjs`); they cannot exercise a real extension host.

`npx web-ext lint --source-dir extension/dist-firefox` validates the Firefox package.

## Layout

| Path | What it is |
|---|---|
| `extension/src/lib/jellyneo.js` | Every Jelly Neo selector and URL, plus fetching and parsing. Start here when the site changes. |
| `extension/src/background.js` | Lookups: cache, dedupe, error mapping. |
| `extension/src/lib/queue.js` | Rate limit and request coalescing. |
| `extension/src/lib/` | Parsers and pure logic for every Neopets feature (Food Club, wizards, Quest Log, Magma Pool, Fast Relist, settings IO…). |
| `extension/src/content/` | Detection, badges, the bar, and the per-page helpers. `run.js` is shared; `index.js` / `index.safari.js` are the per-browser entries. |
| `extension/src/lib/ext-api.js` | `browser` / `chrome` shim and storage fallback. |
| `extension/src/ui/` | Vue components, Vuetify config, and the store behind the popover and panel. |
| `extension/vite-plugin-neosnipe.js` | Keeps Vuetify's CSS out of the Neopets page; flattens and prunes the Safari and Firefox bundles. |
| `extension/scripts/` | Release packaging, the dev browser, icon rendering, the Safari app build. |
| `extension/test/` | Unit suites, captured fixtures and the Playwright harnesses. |
| `extension/icons/icon.svg` | The icon's source. `npm run icons` renders the PNGs. |
