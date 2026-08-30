# neo-snipe

Jelly Neo prices on every Neopets item, without leaving the page.

A browser extension (Chrome and Safari) puts a small 🔍 badge in the bottom-right corner of every item image on
neopets.com. Clicking it asks a local server for that item's Jelly Neo data; the server drives a
headless Playwright browser (WebKit, presenting as desktop Safari), caches the result, and returns
a card the extension renders in a popover.

```
neopets.com page
  └─ content script  ── finds item <img>, injects plain-DOM badges
        └─ on click: mounts the Vue + Vuetify popover into a shadow root
        │ chrome.runtime.sendMessage
  └─ service worker  ── in-flight dedupe + chrome.storage.local cache → fetch()
        │ POST http://127.0.0.1:8787/api/price   (X-NeoSnipe-Token)
  server/
     ├─ SQLite cache (hit → return immediately)
     ├─ rate limiter + in-flight dedupe
     └─ Playwright WebKit, persistent browser, Desktop-Safari context
            └─ items.jellyneo.net search → item page → parse
```

## Setup

### 1. Server

```bash
cd server
npm install                 # also downloads the Playwright WebKit build
cp .env.example .env        # then set NEOSNIPE_TOKEN to something of your own
npm start
```

`NEOSNIPE_TOKEN` is required. Without it every `/api` request is refused — otherwise any site you
visited could drive your local browser pool through `127.0.0.1:8787`.

### 2a. Extension — Chrome

```bash
cd extension
npm install
npm run build
```

`chrome://extensions` → enable Developer mode → **Load unpacked** → pick `extension/dist`. Open the
extension's options, enter the same token, and hit **Test connection**.

`npm run dev` runs Vite with HMR if you're iterating on the UI.

### 2b. Extension — Safari

Safari extensions have to ship inside a macOS app, so this needs Xcode:

```bash
cd extension
npm run build:safari-app
```

That builds `dist-safari/`, generates the Xcode wrapper into `safari/` (regenerated each run — it
is not checked in), and compiles the app. Then:

1. `open safari/build/Build/Products/Debug/neo-snipe.app` once to register the extension, then quit it.
2. Safari → Settings → Advanced → **Show features for web developers**.
3. Safari → Develop → **Allow Unsigned Extensions** (this resets every time Safari restarts; a real
   signing identity avoids it).
4. Safari → Settings → Extensions → enable **neo-snipe**, and set neopets.com to **Always Allow**.
5. Open the extension's options and enter the same server token.

Set `SAFARI_BUNDLE_ID` to use your own bundle identifier.

## How it finds items

Neopets renders items three different ways, so there is no single selector. All of this was
verified against the live site; the captured markup lives in `extension/test/fixtures/neopets-*.html`
and the detection tests run against it.

| Surface | Element | Image URL from | Name from |
|---|---|---|---|
| Inventory | `div.item-img` | `data-src` (lazy-loaded) | `data-itemname` |
| Main shops | `div.item-img` | inline `background-image` | `data-name` |
| Safety deposit box | `img.sdb-item-img` | `src` | `alt` |
| Auctions | `img.ah2_thumb` | `src` | a link in the sibling `<td>` |
| Trading post | `img` | `src` | `p.item-name-text` |

So an item is **not necessarily an `<img>`**, and image URLs are often protocol-relative
(`//images.neopets.com/items/...`). `detect.js` resolves the image from `src`, `data-src`,
`data-image`, or an inline background, then resolves the name in order of reliability: data
attributes first, then a labelled name node nearby, then `alt`, then a link in the listing row.

The one trap worth knowing: on the grid surfaces **`alt` and `title` hold the item description,
not its name** ("This mystical codestone is used for training pets..."). Trusting `alt` there
sends Jelly Neo a whole sentence, so `alt` is only consulted on a real `<img>`. When no name can
be resolved the element is marked and skipped — a wrong name is worse than no badge.

## Notes on the design

**Why WebKit rather than Chromium with a spoofed UA.** WebKit is Safari's actual engine, so the
whole fingerprint is consistent — a Safari UA string on Chromium still ships Chromium-only
`Sec-CH-UA` client-hint headers underneath. `playwright.devices['Desktop Safari']` supplies the UA
and viewport; `npm run probe` in `server/` prints what a server actually sees.

**Why trading post history is a second request.** The popover has two tabs: price history (which
comes with the item lookup) and TP history, which lives on its own Jelly Neo page. That page is
generated on demand and can take ~20s for a heavily traded item before their cache warms —
longer than the extension's own request timeout. Making every price lookup wait on that would be
a bad trade, so `POST /api/trading-post` is separate and the extension calls it only when someone
opens that tab. Items nobody asks about never cost Jelly Neo the page at all.

Note that an empty lot list is not always "no activity": Jelly Neo declines to publish TP history
for low-value items, and the popover shows that explanation rather than an empty table.

**Why badges are plain DOM.** A safety deposit box page can show 100+ items. There is exactly one
Vue app — the popover — mounted lazily on the first badge click and reused after that. In the
Chrome build the Vuetify bundle isn't even downloaded until you click something.

**Why Safari gets a different build.** Safari can neither `fetch()` a web-accessible resource nor
dynamically `import()` one from a content script — both fail on the `safari-web-extension://` URL.
The Chrome build relies on both. So `vite build --mode safari` uses a statically-bundled content
entry (`src/content/index.safari.js`), inlines the stylesheet into the bundle rather than fetching
it, and flattens CRXJS's dynamic-import loaders into self-contained classic scripts. The cost is a
~660KB content script that loads on every Neopets page instead of on first click; the Chrome build
keeps the lazy path. Extension APIs go through `src/lib/ext-api.js`, which prefers Safari's
standard `browser` namespace and falls back to `chrome`, and falls back from `storage.sync` to
`storage.local` since Safari can refuse sync when iCloud is unavailable.

**Why the CSS takes a detour.** Vuetify's component modules each `import "./X.css"`, so a content
script that touches Vuetify gets CSS wired into `manifest.content_scripts.css`, which the browser
injects directly into the host page — restyling Neopets and defeating the shadow root.
`vite-plugin-neosnipe.js` strips that wiring and routes the stylesheet into the shadow root
instead (web-accessible file for Chrome, inlined for Safari). Related: module preload and CSS code
splitting are both off, because Vite emits those URLs page-relative, which means the browser would
fetch every chunk from `neopets.com` as well.

**Why `:root` gets rewritten to `:host`.** Vuetify puts real defaults in a `:root` block —
including `--v-theme-overlay-multiplier: 1`, which its hover and ripple rules consume as
`opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier))`. Inside a shadow root
`:root` matches nothing, so that variable goes undefined, the `calc()` becomes invalid, `opacity`
falls back to its initial value of `1`, and every hover renders as a solid black wash.
`mount.js` rewrites `:root` to `:host` in both adopted stylesheets. Vuetify's generated theme
colours are copied in from `document.head` for the same reason: document stylesheets do not apply
inside a shadow root, only inherited custom properties cross the boundary.

**Icons are `@mdi/js` SVGs, not the MDI webfont** — `@font-face` declared inside a shadow root
doesn't resolve in Chrome.

## Being a good neighbour

Jelly Neo is a small fan site. **One click, one lookup** — there is deliberately no batch or
prefetch endpoint, so a page showing 100 items costs Jelly Neo nothing until you actually ask
about one. Lookups are capped at 2 concurrent with a ~1s floor between page loads, and cached for
24h in SQLite plus 24h in the extension. Please keep it that way if you extend this, and check
their robots.txt and terms before taking it further than personal use.

## Tests

```bash
cd server    && npm test                             # parser tests against saved fixtures, offline
cd extension && npm run test:detect                  # detection against real Neopets markup
cd extension && npm run build  && npm run test:e2e   # the real thing, in real Chrome
cd extension && npm run build:safari && npm run test:safari   # the Safari bundles, in WebKit
```

Both extension suites need the server running.

`test:e2e` loads the built extension into Chrome and serves a fake Neopets page from the
neopets.com origin so the content script matches, then checks badge injection, that no extension
CSS reaches the page, that Vuetify overlays stay inside the shadow root, hover-only badges, a live
priced popover, and the server-unreachable error path.

`test:safari` runs the Safari bundles in WebKit — Safari's own engine — with a stubbed extension
runtime. It covers what the Safari build changes: that the popover mounts with no dynamic import
and no fetched stylesheet, that the inlined CSS is adopted, and that Vuetify renders under
JavaScriptCore. It cannot exercise Safari's extension host (permission prompts, the real service
worker); that part needs the manual steps above.

## Layout

| Path | What it is |
|---|---|
| `server/src/jellyneo.js` | Every Jelly Neo selector and URL, plus the parsing. Start here when the site changes. |
| `server/src/browser.js` | Playwright lifecycle and the Safari context pool. |
| `server/src/cache.js`, `queue.js` | SQLite cache; concurrency cap, rate limit, request coalescing. |
| `extension/src/content/` | Detection, badge injection, shadow-root mount. `run.js` is shared; `index.js` / `index.safari.js` are the per-browser entries. |
| `extension/src/lib/ext-api.js` | `browser` / `chrome` shim and storage fallback. |
| `extension/src/ui/` | Vue components, Vuetify config, popover state. |
| `extension/vite-plugin-neosnipe.js` | Keeps Vuetify's CSS out of the Neopets page; flattens the Safari bundles. |
| `extension/scripts/build-safari-app.sh` | Safari bundle → Xcode wrapper → compiled app. |
