# ui — the Vue 3 + Vuetify layer: in-page popover, in-page panel, and the options page

Two mount points. `App.vue` is mounted once into the content script's shadow root and renders both
in-page surfaces (the badge-anchored price popover and the bottom-right panel); `OptionsApp.vue` is
its own app on the options page, sharing only `lib/` and `vuetify.js`. Everything in-page reads
and writes one reactive `state` in `store.js`, which talks to the service worker via
`sendMessage` and fetches Neopets pages itself (same-origin, carries your session).

## Map

| File | What it does |
|---|---|
| `App.vue` | Shadow-root root: `<v-app>` wrapping `Panel` + `PricePopover`; passes the `attach` target down. |
| `PricePopover.vue` | The badge popover: a `v-menu` targeting `state.anchor` or, once dragged, the `state.popoverPos` point. Grip strip (`onGripPointerDown`), `keepOnScreen` clamping, spinner, error alert + `retry()`, or `PriceCard` + `HistoryTabs`. |
| `PriceCard.vue` | Item head, rarity/category chips, price, the shop-margin line from `shopMargin()`, description, TP/Auction search links (`searchesFor`), heart via `toggleCurrentFavourite`. |
| `HistoryTabs.vue` | The popover's tab strip (Price / TP / SW / SSW) in `popoverTabs()` order: price-history table, Shop Wizard results with age + *again*, `ShopsList`, trading-post lots. Drag-reorders via `movePopoverTab`. |
| `ShopsList.vue` | Super Shop Wizard rows from `state.ssw` (owner link, price, stock), summary line, `retryShops`. `limit` prop caps rows. |
| `Panel.vue` | The bottom-right/top panel: draggable title bar (`startDrag` from `lib/positions.js` → `setPanelPos`/`savePanelPos`), cog → `SettingsView`, tabs in `panelTabs()` order — Favourites (drag-reorder, click opens the popover), Dailies (grouped, collapsible, ♥ pin, done-ticks + countdowns), `FoodClub` — plus the toast. |
| `FoodClub.vue` | Round readout: stake input, risk-level buttons over `RISK_LEVELS`, `currentBets()` rows with odds/payout, Place (`placeBet`), done-tick (`toggleBetDone`), already-placed marks (`isBetPlaced`), links to your bets and collect. |
| `SettingsView.vue` | The cog panel: checkboxes wired to `setSetting` (premium auto/manual, hover-only badges, daily tracking, movable panel/launcher/tabs), worth-buying margin, position/tab-order resets, and export/import (clipboard, file download, file pick → `importSettings`). |
| `OptionsApp.vue` | Standalone options page: hover-only switch, Firefox "Grant access to Jelly Neo" (`requestJellyNeoAccess`), "Test a lookup" (a real `neosnipe:lookup`), clear-cache. |
| `WizardSearch.vue` | Both search panels (`kind` = `wiz`/`ssw`): search box, the page's own items as one-click starting points with inline art, sortable result rows, and whatever the other wizard has cached for the same item. |
| `store.js` | The single reactive `state` + all actions. See below. |
| `useTabDrag.js` | `useTabDrag(move, enabled)` — HTML5 drag-reorder for a tab strip; returns handlers plus `wasDragged`/`isDragging`/`isOver`. Shared by `Panel` and `HistoryTabs`. |
| `vuetify.js` | `makeVuetify(attach)` and `THEME`: explicit component imports (no auto-import), `mdi-svg` icon set, and a global `attach` default. |

## store.js

Owns: popover (`open`, `anchor`, `item`, `data`, `error`, `loading`, `tab`, `refreshing`) and its
lazy per-tab slices `tp` / `ssw` / `wiz`; Food Club `fc` (round, arenas, sets, level, amount, done,
placed, placing); `toast`; panel (`panelOpen`, `panelAnchor`, `panelView`, `panelTab`, `panelPos`);
`settings`, `premiumDetected`, `io`; `favourites`, `dailyFavourites`, `visits`, `nstDay`, `now`;
`popoverPos` (the dragged popover's target point, cleared on every open); `pageItems`, and one
`search` slot per wizard (query, name, listings, sort, `fromCache`).
Search: `openPanelView`, `setPageItems`, `setSearchQuery`/`setSearchSort`, `runSearch`,
`searchPageItem`, `sortedListings`, `crossCached`. Main actions: `openFor`/`openFavourite`/`close`/`retry`; `selectTab`, `loadTradingPost`,
`loadWizard`/`retryWizard`, `loadShops`/`retryShops`; `shopMargin`; `loadSettings`, `setSetting`,
`detectPremiumFromPage`, `isPremium`, `exportSettings`/`importSettings`; favourites
(`toggleCurrentFavourite`, `removeFavouriteAt`, `moveFavourite`, `toggleDaily`, `moveDailyFavourite`);
daily visits (`visitDaily`, `toggleDailyVisited`, `clearVisitedDailies`, `readyIn`, `nextReadyIn`);
panel (`togglePanel`, `closePanel`, `showSettings`, `watchPanel`, `watchLauncher`, panel-position and
`panelTabs`/`popoverTabs`/`move*Tab`/`resetTabOrder`); Food Club (`loadFoodClub`, `setFoodClubLevel`,
`setFoodClubAmount`, `currentBets`, `placeBet`, `toggleBetDone`, `showToast`/`dismissToast`).

## Rules

- `openingTab()` decides where a popover opens: the last tab selected when `rememberPopoverTab` is
  on and still available, else `popoverTabs()[0]`. That tab is fetched once the lookup lands — every
  tab but price needs the name/id it returns. Otherwise Wizard, SSW and TP fetch **only on tab
  selection**, searches being rate-limited; both paths go through `loadTab` so they cannot drift.
- Wizard/SSW results are reused per item for `wizCacheMinutes`/`sswCacheMinutes` (`cacheMs()`, 15
  min, 0 = never); TP is fetched once per open. Within one open `state.wiz.data`/`state.ssw.data`
  short-circuit first, so the window only bites across opens.
- Given a bare `[x, y]` point, Vuetify puts the card's **left** edge on it and its top `OFFSET`
  below, whichever way `location` reads — `pointFor` depends on that, and the e2e drag check pins
  the movement. Clamp to Vuetify's own `viewportMargin` (12) or our idea of where it landed drifts.
- `wasDragged()` guards exist so a tab reorder never counts as opening a tab — same for the Food
  Club tab, which fetches on click.
- One panel exists, wearing whichever `panelView` is up (`tabs`/`settings`/`wiz`/`ssw`), so the
  wizard searches share its position, drag and toggle. `askWizard`/`askSsw` and the two caches are
  shared with the popover tabs, which is what lets either panel show the other's find.
- Never add Vuetify components via auto-import: each pulls a CSS side-effect that Vite would inject
  into the Neopets page. Register them in `vuetify.js` and keep icons as `@mdi/js` SVG paths.
- Overlays must stay in the shadow root — hence the `attach` prop threaded `App → PricePopover` and
  the global `attach` default.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
