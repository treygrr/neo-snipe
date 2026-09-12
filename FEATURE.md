# neo-snipe — Jelly Neo prices on every Neopets item, without leaving the page

A Chrome/Firefox/Safari MV3 extension: a content script badges every item on neopets.com, the
service worker fetches and parses items.jellyneo.net, and a Vue popover shows the price, its
history, Shop Wizard/SSW listings and trading post lots — plus a panel for favourites, dailies
and Food Club. One source tree (`extension/src/`), three packaged targets.

## Where things live

| FEATURE.md | Go here for |
|---|---|
| `extension/FEATURE.md` | Building and packaging: Vite config, the generated manifest, the plugin that keeps Vuetify's CSS off the page and flattens the Safari/Firefox bundles. |
| `extension/src/FEATURE.md` | The service worker (`background.js`): the lookup pipeline, the `storage.local` result cache, and `runtime.onMessage` routing. |
| `extension/src/lib/FEATURE.md` | Shared, mostly-pure logic: site scrapers (Jelly Neo, Wizard, SSW, Food Club), storage-backed state (settings, favourites, dailies, positions, tab order), the `browser`/`chrome` shim. Reusable code belongs here. |
| `extension/src/content/FEATURE.md` | What runs on every neopets.com page: item detection, plain-DOM badges and launcher, the shadow-root mount of the Vue app. |
| `extension/src/ui/FEATURE.md` | Vue 3 + Vuetify: popover, panel, options components, and the single reactive `store.js` that owns all in-page state. |
| `extension/src/options/FEATURE.md` | The standalone options page's HTML shell and Vue bootstrap — wiring only; its behaviour lives in `ui/OptionsApp.vue`. |
| `extension/test/FEATURE.md` | Tests and captured fixtures: `node:test` parser units, the Chrome e2e run, the WebKit/Gecko bundle harness, how to run each. |
| `extension/scripts/FEATURE.md` | Release packaging, the dev-browser launcher, icon rendering, the Safari app generator. |
| `safari/FEATURE.md` | The generated macOS wrapper app Safari needs in order to load the extension. Generated output — never hand-edit. |

## Request path

1. `src/content/detect.js` finds item art on the page; `src/content/badge.js` hangs a 🔍 button on it.
2. Click → `src/content/run.js` `activate()` → first use lazily mounts the Vue app via `content/mount.js` `mountPopover()` into a shadow root → `ui/store.js` `openFor(anchor, item)`.
3. `store.js` sends `{ type: LOOKUP, item }` (`lib/messages.js`, `lib/ext-api.js`) to `src/background.js` `lookup()` — the worker is the only context with `items.jellyneo.net` host permission.
4. `background.js`: `storage.local` cache → `hasJellyNeoAccess()` → `dedupe()` (`lib/queue.js`; one fetch in flight, 700 ms floor) → `lib/jellyneo.js` `lookupItem()`.
5. `lookupItem()` fetches the search page, then the item page, parses both with linkedom and normalises; `background.js` caches the result and replies (`asFailure()` on a throw).
6. `store.js` fills `state.data`; `ui/PricePopover.vue` + `PriceCard.vue` render it. TP history loads only on tab selection via `TP_LOOKUP`; Wizard/SSW/Food Club are fetched same-origin by `store.js` itself.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
**Convention:** every folder's `FEATURE.md` is updated in the same commit as the code changes in that folder — a change to `extension/src/lib/` updates `extension/src/lib/FEATURE.md`, not just this map.
