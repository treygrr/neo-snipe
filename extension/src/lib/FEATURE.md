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
| `foodclub.js` | **neopets.com/pirates/foodclub.phtml + ~Shrmsh.** Parsers (`parseBetPage`, `parseRound`, `parseSets`, `parseCurrentBets`, `placementRefusal`, `wasPlaced`), bet maths (`resolveBet`, `payout`, `WINNINGS_CAP`, `betId`, `betNameKey`) and `placeBetUrl`, plus collecting: `parseCollectPage(doc)` (the total and each winning bet from the "Collect Winnings" table; no table is a total of 0), `COLLECT_POST_URL` and `collectBody()` (the collect form's POST, `type=collect`). |
| `neopets-search.js` | Link builders only: `SEARCHES` (Trading Post, Auction House), `searchesFor(name)`, and `INVENTORY_URL`. |
| `premium.js` | `detectPremium(doc)` — reads the site nav for `/premium/` links or SSW widgets; returns `null` (unknown) when no nav is present. |
| `dailies.js` | The curated daily link table `DAILIES` (grouped label/url), `DAILY_COUNT`, `isPremiumDaily`, and `dailiesFor({ premium })`. |
| `magma.js` | **neopets.com/magma/pool.phtml + /settings/account.** `MAGMA_POOL_URL`, `MAGMA_CHECK_MS` (10 min, the window's length), `readPoolState(text)` → `open`/`closed`/`unknown`, `ACCOUNT_URL` (`/settings/account/`) + `isAccountPage` + `readAccountName(doc)` (`#flag_username` when the page's script has drawn it, else the header's "Welcome," profile link, else `appInsightsUserName` — a fetch gets only the latter two), `accountKey`, `poolTimeAt` (NST "HH:MM"), `nextPoolOpening`, `isPoolTime`, `cleanPoolTimes`. |
| `questlog.js` | **neopets.com Quest Log + the quests it can finish.** URLs (`QUESTLOG_URL`, `RETRIEVE_URL`, `CLAIM_URL`, `FISHING_URL`, `WHEEL_RESULT_URL`), `readRefCk(doc)` (the page's `_ref_ck`), request bodies (`retrieveBody`/`claimBody` as FormData, `fishingBody`/`wheelBody` URL-encoded), `parseQuestList(json, parse)` → quests (`id`, `kind`, `tasks`, `complete`, `claimable`, `reward`, `premium`, `link`, `runner`, `wheel`) + `bonus` (`done`, `total`, and once all are done `claimId`/`reward`) + `expiresInMs`, `claimBonusBody`, `questKind`, `questLink`, `runnerFor` (`fishing`/`wheel`/`use`/`visit`), `WHEELS`/`wheelFor`, `NC_POPULAR_URL` (what both NC Mall quests visit), `QUEST_READY_KEY`/`QUEST_REFRESH_MS`/`readyCount` (the bar's count), `parseClaim`, `parseFishing`, `parseWheel`, `QuestLogError`. |
| `item-use.js` | **Using an item on a pet** (the Feed, Groom, Play With and Read to quests). `USES` (per kind: the action verb, button label, noun, inventory types), `INVENTORY_ITEMS_URL` + `INVENTORY_AJAX_HEADERS` + `parseInventoryReply` (the inventory page arrives empty; its items come from `inventory.php`, refused without the XHR header), `readInventory(doc)`, `candidatesFor(kind, items)` (least valuable first, never NC), `readActivePet(doc)` (header link), `itemInfoUrl`, `readItemActions(doc)`, `actionFor(kind, actions, pet)` (exact to the pet, never guessed), `USE_OBJECT_URL`, `useBody`, `parseUse`, `ItemUseError`. |
| `shops.js` | **The main Neopian shops** (the Purchase an Item quest). `SHOPS`/`SHOP_IDS` (Jelly Neo's 104 standard `obj_type` shops), `shopUrl`, `shopIdOf`, `isSoldOut`, `readShopStock(doc)` (name, price, stock, `objInfoId`/`stockId`, haggle link), `cheapestItem`, `pickShop` (random, untried), `findShopWithStock(fetchDoc, opts)`, `readHaggle(doc)` (asking price; paid and added once accepted), the plan in storage.local (`SHOPPING_KEY`, `SHOPPING_TTL_MS`, `isLivePlan`) and `purchasesLeft(quest)`. Never submits a purchase — the confirmation is behind Cloudflare Turnstile and stays a person's click. |
| `customise.js` | **Customising a pet** (the Customise a Pet quest), over `/amfphp/services/jss/apiservices.phtml`. `editorBody`/`readEditor` (`custompeteditordata`), `readEquipped` (`{ zone: closet_obj_id }`), `wearableCandidates(editor, pet)` (owned, not on another pet, compatible, in a free zone, neither hiding nor hidden by what is worn), `pickRandom`, `withItem`, `saveBody` (`custompetsavedata`, the **whole** outfit — a zone left out comes off), `parseSave` (`{"updatecount":1}`), `CustomiseError`. |
| `reset-rules.js` | NST clock helpers (`nstDay`, `nextNstMidnight`, `nextNstMonth`, `nextWindow`, `nstClock`, `nextNstTimeOfDay`, `DAY_MS`), rule constructors (`every`/`hours`/`minutes`/`days`, `windows`, `MONTHLY`, `ANYTIME`, `NST_MIDNIGHT`), the per-URL `resetRuleFor`, `nextResetAfter`, `isTracked`, `describeRule`. |
| `daily-visits.js` | Storage-backed tick state: `dailyUrlFor(pageUrl)` matching, `expiryOf`, `listVisits`, `markVisited`, `toggleVisited`, `clearVisits`, `formatCountdown`; re-exports the reset-rule helpers. |
| `favorites.js` | `storage.local` lists: item favourites (`favouriteId`, `listFavourites`, `toggleFavourite`, `saveFavourites`, `removeFavourite`), Food Club done marks (`listDoneBets`, `setDoneBets`), daily favourites (`listDailyFavourites`, `saveDailyFavourites`, `toggleDailyFavourite`). |
| `positions.js` | Device-local panel/launcher positions (`PANEL`, `LAUNCHER`, `readPosition`, `writePosition`, `clearPosition`), plus `clamp` and the shared `startDrag` pointer handler with `DRAG_THRESHOLD`. |
| `tab-order.js` | Canonical `POPOVER_TABS` and order maths: `fullOrder(saved, known)`, `visibleOrder`, `moveInOrder`. |
| `settings-io.js` | Backup/restore: `EXPORT_VERSION`, `collectSettings()` (adds `cache` when `exportIncludeCache` is on), `toJson`, `parseExport(text, { now })` (validating, throws `ImportError`; keeps only fresh current-version cache entries), `applyImport(parsed)` (cache entries added alongside, never replacing). |
| `price-cache.js` | The worker's Jelly Neo cache rules, shared with backup: `CACHE_VERSION`, `PRICE_PREFIX`/`TP_PREFIX`, `CACHE_TTL_MS` (a day), `CACHE_MAX_ENTRIES` (2000), `isCurrentCacheKey`, `isCacheKey`, `isFreshEntry`, `freshCacheEntries(all, now)` (current, fresh, well-formed, newest first, capped). |

## Rules worth knowing

- **Two unrelated item-id schemes.** A Jelly Neo item id (`jellyNeoId`) is not a Neopets `obj_info_id`
  (`neopetsItemId` from SSW). Never pass one where the other is expected.
- **Settings live in `storage.sync` (local fallback); favourites, visits and positions in `storage.local`.**
  Positions are deliberately local — screen sizes differ per device.
- **The stored popover tab order covers every known tab, including hidden ones** (the SSW tab without Premium), so
  repair through `fullOrder` and move through `moveInOrder` rather than splicing the visible list.
- **`detectPremium` can return `null`** — unknown, not "no premium".
- **`reset-rules.js` lists only the exceptions**; any daily URL absent from its table resets at midnight NST.
- **Magma Pool times are per account** (`magmaPoolTimes`, lowercased username → NST "HH:MM") in synced
  settings, so they export whether or not checking is on. Import cleans them pair by pair and skips the
  key when absent, so an older backup cannot wipe times found since. Never mutate the map — replace it.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
