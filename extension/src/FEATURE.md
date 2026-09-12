# src — the extension's source root: service worker, content scripts, UI and options

`background.js` is the extension's only privileged context: it owns the Jelly Neo lookup pipeline
(cache → permission check → dedupe → fetch/parse) and the `runtime.onMessage` routing that the
content script and popover talk to. Everything else lives in the subfolders below.

## Map

| File | What it does |
|---|---|
| `background.js` | MV3 service worker. `lookup()` and `tradingPost()` answer `LOOKUP` / `TP_LOOKUP` messages via `storage.local` cache → `hasJellyNeoAccess()` → `dedupe()` → `lookupItem()` / `lookupTradingPost()`; `asFailure()` maps thrown errors to popover codes; `readCache`/`writeCache`/`trimCache`/`evictStaleVersions` manage the cache; `keepAlive()` stops the worker dying mid-fetch; also handles `HELLO` (enable the toolbar button per tab), `OPEN_PANEL` on toolbar click, and `neosnipe:clear-cache`. |

## Subfolders

| Folder | What it is |
|---|---|
| `lib/` | Shared modules every context imports: Jelly Neo fetch/parse, the rate-limit queue, the `browser`/`chrome` shim, message constants, Food Club, wizards, dailies, favourites, settings I/O. See `lib/FEATURE.md`. |
| `content/` | The script injected into neopets.com: item detection, plain-DOM badges and bar, shadow-root mount of the Vue popover. See `content/FEATURE.md`. |
| `ui/` | Vue + Vuetify components and the reactive `store.js` behind the popover, panel and options page. See `ui/FEATURE.md`. |
| `options/` | The extension's options page (`index.html` + `main.js`, mounting `ui/OptionsApp.vue`). See `options/FEATURE.md`. |

## Cache rules

- Keys are `p2:<name, lowercased and whitespace-collapsed>|<imageHash>` and `tp2:<itemId>`; `CACHE_VERSION` is bumped when a
  change makes old entries *wrong* (v2 dropped entries keyed off Neopets `obj_info_id`), and
  `evictStaleVersions()` deletes any surviving older-prefix keys at worker start.
- 24h TTL, 2000-entry budget, oldest evicted first. A `refresh` lookup skips the read but still
  writes through, and dedupes under a separate `<key>!fresh` key so it cannot join a stale flight.
- One click, one lookup: nothing is fetched until a message asks for a specific item. Do not add
  batching or prefetch.

## Message handler

`onMessage` must `return true` for every async branch, otherwise the channel closes and the popover
never gets its reply. Async work is wrapped in `keepAlive()` — touching an extension API on an
interval is what keeps Chrome from tearing the worker down during a ~20s trading-post fetch.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
