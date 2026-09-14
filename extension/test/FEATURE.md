# test — the whole test suite: node:test parser units, saved-site fixtures, and the Playwright harnesses

`*.test.mjs` are `node:test` files run against captured fixtures with no network; the HTML parsers use
`linkedom`, except `detect.test.mjs`, which needs real DOM/layout and launches Chromium. `bundle.mjs`
and `e2e.mjs` are standalone scripts that drive a built extension in Playwright, with Neopets served
from `fixtures/` via `page.mjs` (and `routes.mjs` in `e2e.mjs`); each routes Jelly Neo itself.

Run from `extension/`: `npm run test:unit` (`node --test test/*.test.mjs`) runs every unit suite;
`test:detect`, `test:jellyneo`, `test:foodclub`, `test:wizard`, `test:ssw`, `test:premium`,
`test:settings`, `test:search`, `test:icons` run one each. `npm run build && npm run test:e2e` runs
the Chrome end-to-end; `build:safari && test:safari` and `build:firefox && test:firefox` run
`bundle.mjs` in WebKit and Gecko.

## Map

| File | What it does |
|---|---|
| `page.mjs` | `buildPage()` stitches the seven `neopets-*.html` fixtures into one stand-in page (plus a late-inserted lazy item); exports `ITEM_COUNT` (20). |
| `routes.mjs` | `installNeopetsRoutes(ctx)` fulfils neopets.com, Food Club bet/current-bets/sets, the SSW endpoint and images from fixtures; also exports `jellyNeoFixture` and `JELLYNEO_PAGES`. Shared with `npm run fixture` so dev browser and tests cannot drift. |
| `bundle.mjs` | Loads the flattened `dist-safari`/`dist-firefox` `content.js`+`background.js` into WebKit/Gecko behind a stubbed `browser` runtime; checks badges, no page CSS, popover mount without dynamic import, adopted inline stylesheets, theme vars, overlay containment. Selected by `NS_TARGET`, dir by `NS_DIST`. |
| `e2e.mjs` | Loads the real Chrome build (`NS_DIST` or `dist`) in a persistent context; ~320 checks over badge injection, the Magma Pool button already on the bar (and already found) before the account page answers, popover tabs (price, TP, Wiz, Shops; order, open-on-first, a real tab drag that reorders and saves, Settings' Reset tabs restoring the shipped order, remembered tab, drag + viewport clamping), the launcher bar (its order; the Favourites/Dailies/Food Club/Settings buttons each opening their titled view, switching without a second panel, closing on a second click, and marking the open view's button with `aria-pressed`; the collapse arrow hiding all but grip and arrow with `aria-expanded` to match, restoring exactly what showed, working from Enter/Space with focus kept, a 400px window, a moved bar not drifting over repeated toggles and re-clamped on expand without saving, and starting expanded after a reload) and its inventory link, the Quest Log panel (read on open, Fish, Spin and Read runners, Claim, each request counted against a small model of the server) and the bar's ready-to-claim count, the Purchase an Item helper (plan saved, shop opened with its cheapest item marked, haggle offer filled in, buy counted once, never a haggle sent), Customise a Pet (wardrobe loaded, one wearable added with nothing dropped, the original outfit saved back), the `#npanchor` rewrite, the wizard search panels (suggestions on click, outer search button, clear, sorts, layout budget, cross-wizard fold-out), panel, favourites, dailies groups, Food Club (loaded when its view opens) place/refuse, settings export/import, Premium gating, toolbar button (opens Favourites at the top), hover-only, and the Jelly-Neo-offline path. |
| `magma.test.mjs` | `lib/magma.js`: open/closed/unknown from the pool page's own text (both guard spellings), the NST minute recorded and the next opening across DST, the account from `#flag_username` or, on the settings page as fetched (no rendered div), the header's Welcome link / `appInsightsUserName`, and `cleanPoolTimes` on malformed imports. |
| `questlog.test.mjs` | `lib/questlog.js` over the captured replies: request bodies, `readRefCk`, today's list (kinds, rewards, tasks, Premium, bonus markers, expiry), a claimable card, runners and links per kind, every wheel by name, refused lists, and the claim, fishing and wheel replies. |
| `item-use.test.mjs` | `lib/item-use.js`: inventory data attributes, candidates per kind (cheapest, no NC), the header's active pet, exact pet actions from an item popup, the use request body, and the captured Read to reply. |
| `shops.test.mjs` | `lib/shops.js`: the shop list, shop URLs, stock cards with haggle ids, sold-out pages, cheapest pick, random untried shops, finding a shop with stock (and giving up), the haggle and accepted pages, plan lifetime, buys left. |
| `customise.test.mjs` | `lib/customise.js` over the captured editor data and save reply: load and save bodies, what is worn, wearable candidates (other pets, worn zones, unknown items, restricting zones), adding an item without dropping any, the random pick, and `parseSave`. |
| `detect.test.mjs` | Runs `src/content/detect.js` inside a browser (Chromium; `NS_ENGINE=firefox` or `webkit` for the others) against each surface fixture: `findItemElements`, `describeItem`, `itemImageUrl`, `itemNameFor`, `imageHashOf`; asserts no `obj_info_id` leaks. |
| `jellyneo.test.mjs` | `URLS`/`SELECTORS`, `extractSearchResults`/`extractItemPage`/`extractTradingPost`, `parseNp`/`parseDate`/`parseRarity`, `itemIdFromUrl`, `pickResult`, `lookupItem`/`lookupTradingPost`, `NotFoundError`. |
| `foodclub.test.mjs` | `parseBetPage`, `parseSets`, `resolveBet`, `payout`, `placeBetUrl`, `WINNINGS_CAP`, `wasPlaced`, `placementRefusal`, `parseCurrentBets`, `betNameKey`, `FoodClubError`, and `parseCollectPage`/`collectBody` over the captured collect page (`foodclub/collect-page.html`). |
| `wizard.test.mjs` | `wizardBody`, `WIZARD_URL`, `parseWizardResponse`, `WizardError`, `mergeListings` (add-not-replace, dedupe by owner, newer price wins). |
| `ssw.test.mjs` | `sswQueryUrl` parameter shape and `parseSswResponse`/`SswError` over the captured JSON, including the non-Premium `error` message. |
| `premium.test.mjs` | `detectPremium` over nav fixtures: true / false / `unknown` when no nav renders. |
| `settings-io.test.mjs` | `toJson`/`parseExport`/`ImportError`/`EXPORT_VERSION` version rules (a retired `panelTabOrder` in an old export is ignored; `popoverTabOrder` still imports), the `exportIncludeCache` switch and cached entries in a backup (current version, inside their day, well-formed, capped), plus `DAILIES`/`DAILY_COUNT`/`dailiesFor`/`isPremiumDaily` premium filtering from `dailies.js`. |
| `daily-visits.test.mjs` | `nstDay`, `formatCountdown`, `dailyUrlFor`, `expiryOf` and `reset-rules.js` (`nextNstMidnight`, `nextWindow`, `resetRuleFor`, `isTracked`) across DST. |
| `tab-order.test.mjs` | `fullOrder`, `visibleOrder`, `moveInOrder` over `POPOVER_TABS` — saved orders, new tabs, hidden tabs. |
| `neopets-search.test.mjs` | `SEARCHES`/`searchesFor` produce exactly Jelly Neo's trading post and auction "Find This Item" URLs. |
| `icons.test.mjs` | Reads the PNG IHDR of `icons/icon-{16,48,128}.png`: declared size, RGBA for transparent corners, `icon.svg` present as source. |
| `fixtures/` | Markup and JSON captured off the live sites: `neopets-*.html` (inventory, mainshop, sdb, auctions row, trading post row, caption grid, gallery row); `jellyneo/` (search hit/miss, item page, TP history, withheld TP); `foodclub/` (bet page, sets page, current bets, refusal, collect page); `wizard/`, `ssw/`, `premium/` (one or two captured responses each); `questlog/` (a daily `retrieveQuests` reply, a claimable card, the claim and wheel-spin replies, the fishing result page, and a `README.md` of the endpoints). |

## Rules

- Nothing here touches the network. New parser coverage means a new captured fixture, not a live fetch.
- `page.mjs` is shared by `e2e.mjs` and `bundle.mjs`; `routes.mjs` by `e2e.mjs` and
  `scripts/dev-browser.mjs --fixture`. Changing an item fixture means updating `ITEM_COUNT`.
- `bundle.mjs`/`e2e.mjs` are plain scripts, not `node:test`: they print `ok`/`FAIL` lines and `process.exit(1)` on any failure. All paths resolve relative to `extension/`, so run them from there.
- `e2e.mjs` runs `channel: 'chromium'` with `--headless=new`: Playwright's headless shell does not run content scripts.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
