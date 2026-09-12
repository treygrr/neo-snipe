# lib — the shared, mostly-pure logic layer: site scrapers, state modules, and extension plumbing

Scrapers/parsers here own one external site or endpoint each and are pure given a parsed document
or JSON (fetching is injectable, so tests feed saved fixtures from `test/fixtures/`). State modules
wrap `storage.local`/`storage.sync` through `ext-api.js`. Nothing here touches the DOM of a Neopets
page or a Vue component — callers in the service worker, content script and panel do that.

## Map

| File | What it does |
|---|---|
| `ext-api.js` | Cross-browser `browser`/`chrome` alias `api`, plus `sendMessage`, `getURL`, `hasJellyNeoAccess`/`requestJellyNeoAccess` (Firefox opt-in host perms), and `readSettings`/`writeSettings` (sync with local fallback for Safari). |
| `messages.js` | Message type constants (`LOOKUP`, `TP_LOOKUP`, `HELLO`, `OPEN_PANEL`), the settings `DEFAULTS` object, `getSettings()`, and `ERROR_TEXT` for each worker error code. |
| `queue.js` | Politeness for Jelly Neo fetches: `schedule(fn)` (one in flight, 700 ms floor) and `dedupe(key, fn)` coalescing concurrent callers. |
| `jellyneo.js` | **items.jellyneo.net.** `URLS`/`SELECTORS`, extractors (`extractSearchResults`, `extractItemPage`, `extractTradingPost`), pure normalisers (`normalizeItem`, `normalizeTradingPost`, `parseNp`, `parseRarity`, `imageHashOf`, `pickResult`), and `lookupItem`/`lookupTradingPost` over `fetchDoc` (linkedom — the MV3 worker has no DOM). |
| `wizard.js` | **neopets.com/np-templates/ajax/wizard.php.** `WIZARD_URL`, `WIZARD_REFERRER`, `wizardBody(name)`, `parseWizardResponse(doc)`, `mergeListings()`, `WizardError`. |
| `ssw.js` | **Super Shop Wizard JSON endpoint** (`ssw_query.php`, Premium only). `sswQueryUrl(name, opts)`, `parseSswResponse(json)`, `SswError`. |
| `foodclub.js` | **neopets.com/pirates/foodclub.phtml + ~Shrmsh.** Parsers (`parseBetPage`, `parseRound`, `parseSets`, `parseCurrentBets`, `placementRefusal`, `wasPlaced`), bet maths (`resolveBet`, `payout`, `WINNINGS_CAP`, `betId`, `betNameKey`) and `placeBetUrl`. |
| `neopets-search.js` | Link builders only: `SEARCHES` (Trading Post, Auction House) and `searchesFor(name)`. |
| `premium.js` | `detectPremium(doc)` — reads the site nav for `/premium/` links or SSW widgets; returns `null` (unknown) when no nav is present. |
| `dailies.js` | The curated daily link table `DAILIES` (grouped label/url), `DAILY_COUNT`, `isPremiumDaily`, and `dailiesFor({ premium })`. |
| `reset-rules.js` | NST clock helpers (`nstDay`, `nextNstMidnight`, `nextNstMonth`, `nextWindow`, `DAY_MS`), rule constructors (`every`/`hours`/`minutes`/`days`, `windows`, `MONTHLY`, `ANYTIME`, `NST_MIDNIGHT`), the per-URL `resetRuleFor`, `nextResetAfter`, `isTracked`, `describeRule`. |
| `daily-visits.js` | Storage-backed tick state: `dailyUrlFor(pageUrl)` matching, `expiryOf`, `listVisits`, `markVisited`, `toggleVisited`, `clearVisits`, `formatCountdown`; re-exports the reset-rule helpers. |
| `favorites.js` | `storage.local` lists: item favourites (`favouriteId`, `listFavourites`, `toggleFavourite`, `saveFavourites`, `removeFavourite`), Food Club done marks (`listDoneBets`, `setDoneBets`), daily favourites (`listDailyFavourites`, `saveDailyFavourites`, `toggleDailyFavourite`). |
| `positions.js` | Device-local panel/launcher positions (`PANEL`, `LAUNCHER`, `readPosition`, `writePosition`, `clearPosition`), plus `clamp` and the shared `startDrag` pointer handler with `DRAG_THRESHOLD`. |
| `tab-order.js` | Canonical `PANEL_TABS`/`POPOVER_TABS` and order maths: `fullOrder(saved, known)`, `visibleOrder`, `moveInOrder`. |
| `settings-io.js` | Backup/restore: `EXPORT_VERSION`, `collectSettings()`, `toJson`, `parseExport(text)` (validating, throws `ImportError`), `applyImport(parsed)`. |

## Rules worth knowing

- **Two unrelated item-id schemes.** A Jelly Neo item id (`jellyNeoId`) is not a Neopets `obj_info_id`
  (`neopetsItemId` from SSW). Never pass one where the other is expected.
- **Settings live in `storage.sync` (local fallback); favourites, visits and positions in `storage.local`.**
  Positions are deliberately local — screen sizes differ per device.
- **Stored tab orders cover every known tab, including hidden ones** (the SSW tab without Premium), so
  repair through `fullOrder` and move through `moveInOrder` rather than splicing the visible list.
- **`detectPremium` can return `null`** — unknown, not "no premium".
- **`reset-rules.js` lists only the exceptions**; any daily URL absent from its table resets at midnight NST.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
