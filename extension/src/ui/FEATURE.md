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
| `Panel.vue` | The bottom-right/top panel: draggable title bar (`startDrag` from `lib/positions.js` → `setPanelPos`/`savePanelPos`) showing the current view's title, plus close. One body per `panelView`, each opened by its bar button: Favourites (drag-reorder, click opens the popover), Dailies (grouped, collapsible, ♥ pin, done-ticks + countdowns), `FoodClub`, `SettingsView`, `WizardSearch` (wiz/ssw), `QuestLog`. Plus the toast. |
| `FoodClub.vue` | The round loads when its view opens (`openPanelView`). Round readout: stake input, risk-level buttons over `RISK_LEVELS`, `currentBets()` rows with odds/payout, Place (`placeBet`), done-tick (`toggleBetDone`), already-placed marks (`isBetPlaced`), a link to your bets, and a Collect button naming the NP waiting on the collect page (read with the round) that collects it (`collectWinnings`), then reads the collect page and your bets again — disabled as "Nothing to collect" at 0, a plain link to the collect page if that page could not be read. |
| `SettingsView.vue` | The settings view, opened by the bar's cog button (includes the Magma Pool section: `magmaPoolCheck` toggle, per-account times with a `nextPoolOpening` countdown, Forget; it reads the checker's cached `magmaAccount` and listens to `storage.onChanged`): checkboxes wired to `setSetting` (premium auto/manual, hover-only badges, daily tracking, movable panel/bar/popover tabs), worth-buying margin, position and popover tab-order resets, and export/import (clipboard, file download, file pick → `importSettings`), with an "Include cached prices in the export" switch (`exportIncludeCache`). |
| `OptionsApp.vue` | Standalone options page: hover-only switch, Firefox "Grant access to Jelly Neo" (`requestJellyNeoAccess`), "Test a lookup" (a real `neosnipe:lookup`), clear-cache. |
| `WizardSearch.vue` | Both search panels (`kind` = `wiz`/`ssw`). A `v-combobox` whose menu lists the page's items with inline art only once clicked; clear × inside, search button in the outer append. Results: name/summary/refresh and a `v-btn-toggle` sort on one row, a budgeted-height table, and the other wizard's cache folded to one line. Searches start only from a pick, Enter or the button — single-mode VCombobox writes its model on every keystroke. |
| `QuestLog.vue` | The `quests` panel view: reads the list on open (`loadQuests`), bonus count and reset countdown, one row per quest with its reward, a Claim button once finished (`claimQuest`), a Fish/Spin/Read/Feed/Play/Groom/Visit button for quests a runner can do, and Shop for Purchase an Item (finds a random shop with stock and its cheapest item, saves the plan and opens the shop — the buying stays your click), and Customise (adds a random wearable to the active pet, saves, then saves the original outfit back) (`runQuest`; the item quests use your least valuable suitable item on your active pet, checked against that item's own action list), and a link to do it by hand. |
| `store.js` | The single reactive `state` + all actions. See below. |
| `useTabDrag.js` | `useTabDrag(move, enabled)` — HTML5 drag-reorder for a tab strip; returns handlers plus `wasDragged`/`isDragging`/`isOver`. Used by `HistoryTabs` (the popover's strip). |
| `vuetify.js` | `makeVuetify(attach)` and `THEME`: explicit component imports (no auto-import), `mdi-svg` icon set, and a global `attach` default. |

## store.js

Owns: popover (`open`, `anchor`, `item`, `data`, `error`, `loading`, `tab`, `refreshing`) and its
lazy per-tab slices `tp` / `ssw` / `wiz`; Food Club `fc` (round, arenas, sets, level, amount, done,
placed, placing); `toast`; panel (`panelOpen`, `panelAnchor`, `panelView`, `panelPos`);
`settings`, `premiumDetected`, `io`; `favourites`, `dailyFavourites`, `visits`, `nstDay`, `now`;
`popoverPos` (the dragged popover's target point, cleared on every open); `pageItems`, and one
`search` slot per wizard (query, name, listings, sort, `fromCache`).
Search: `openPanelView`, `setPageItems`, `setSearchQuery`/`setSearchSort`, `runSearch`,
`searchPageItem`, `clearSearch`, `sortedListings`, `crossCached`. Main actions: `openFor`/`openFavourite`/`close`/`retry`; `selectTab`, `loadTradingPost`,
`loadWizard`/`retryWizard`, `loadShops`/`retryShops`; `shopMargin`; `loadSettings`, `setSetting`,
`detectPremiumFromPage`, `isPremium`, `exportSettings`/`importSettings`; favourites
(`toggleCurrentFavourite`, `removeFavouriteAt`, `moveFavourite`, `toggleDaily`, `moveDailyFavourite`);
daily visits (`visitDaily`, `toggleDailyVisited`, `clearVisitedDailies`, `readyIn`, `nextReadyIn`);
panel (`togglePanel`, `closePanel`, `watchPanel` (`fn(open, view)`), `watchLauncher`, panel-position and
`popoverTabs`/`movePopoverTab`/`resetPopoverTabOrder`; `openPanelView` also enters the view — settings
resets `io` and reloads, Food Club loads); Food Club (`loadFoodClub`, `setFoodClubLevel`,
`setFoodClubAmount`, `currentBets`, `placeBet`, `toggleBetDone`, `showToast`/`dismissToast`); Quest Log
`quests` (list, bonus, expiresAt, busy) via `loadQuests`, `claimQuest`, `claimBonus` (the header's Claim once the bonus carries a `claimId`), `runQuest`, `isQuestBusy` — each
posts same-origin with the page's `_ref_ck` and re-reads the list afterwards; each read also stores the
ready-to-claim count (`questReady`) the bar shows. The `visit` runner loads the NC Mall's popular items
`no-cors` — another subdomain, so its reply is unreadable and the re-read list is the confirmation.

## Rules

- `openingTab()` decides where a popover opens: the last tab selected when `rememberPopoverTab` is
  on and still available, else `popoverTabs()[0]`. That tab is fetched once the lookup lands — every
  tab but price needs the name/id it returns. Otherwise Wizard, SSW and TP fetch **only on tab
  selection**, searches being rate-limited; both paths go through `loadTab` so they cannot drift.
- Wizard/SSW results are reused per item for `wizCacheMinutes`/`sswCacheMinutes` (`cacheMs()`, 15
  min, 0 = never); TP is fetched once per open. Within one open `state.wiz.data`/`state.ssw.data`
  short-circuit first, so the window only bites across opens.
- A dragged popover targets a bare `[x, y]` point with `location` switched to `bottom start`, so
  Vuetify puts the card's **left** edge on it and its top `OFFSET` below — `pointFor` depends on that.
  With the badge's `bottom end`, a point lines up the card's **right** edge and only flips when that
  overflows the left, so a card dragged anywhere with room on its left jumped its own width left. The e2e
  drag checks pin the movement on both sides of the window. Clamp to Vuetify's own `viewportMargin` (12) or our idea of where it landed drifts.
- `wasDragged()` guards exist so a popover tab reorder never counts as opening a tab. Food Club
  fetches when its view opens, not on a click.
- One panel exists, wearing whichever `panelView` is up
  (`favourites`/`dailies`/`foodclub`/`settings`/`wiz`/`ssw`/`quests`), so every view shares its
  position, drag and toggle: the open view's bar button closes it, another switches it. `askWizard`/`askSsw` and the two caches are
  shared with the popover tabs, which is what lets either panel show the other's find.
- Never add Vuetify components via auto-import: each pulls a CSS side-effect that Vite would inject
  into the Neopets page. Register them in `vuetify.js` and keep icons as `@mdi/js` SVG paths.
- Overlays must stay in the shadow root — hence the `attach` prop threaded `App → PricePopover` and
  the global `attach` default.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
