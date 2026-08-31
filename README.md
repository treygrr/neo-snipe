# neo-snipe

Jelly Neo prices on every Neopets item, without leaving the page.

A browser extension (Chrome, Firefox and Safari) puts a small 🔍 badge in the bottom-right corner of every
item on neopets.com. Clicking it looks the item up on Jelly Neo and shows the price, its history,
and trading post activity in a popover.

Install it and it works: the extension fetches and parses Jelly Neo itself.

```
neopets.com page
  └─ content script  ── finds items, injects plain-DOM badges
        └─ on click: mounts the Vue + Vuetify popover into a shadow root
        │ runtime.sendMessage
  └─ service worker  ── cache (storage.local) → dedupe → rate limit
        └─ fetch items.jellyneo.net, parse with linkedom
              search page → item page → (on demand) trading post history
```

Jelly Neo serves complete server-rendered HTML to a plain fetch, so no browser engine is needed to
read it. `host_permissions` for `items.jellyneo.net` is what exempts the service worker's requests
from CORS; content scripts cannot fetch cross-origin in MV3, which is why the worker does it.

## Releases

```bash
cd extension
npm run release          # add --no-verify to skip the load-test
```

Builds all three targets into `extension/release/`, one folder per browser with install
instructions for that browser inside, plus a zip of each. Every folder is verified by loading it in
the engine that ships it — Chrome, Gecko, WebKit — before it is zipped, so a broken artifact fails
the build rather than reaching anyone.

Pushing a `v*` tag runs the same thing in CI (`.github/workflows/release.yml`) and attaches the
zips to a GitHub release.

## Updating, and moving to another browser

There is no auto-update: these are unpacked builds, so a new version is a new folder you load
yourself. Whether your favourites survive that depends on whether the browser thinks it is the
same extension, which is worth knowing before you overwrite anything.

**Back up first, every time.** Panel → **cog** → **Backup** → **Save file** writes
`neo-snipe-settings-<date>.json` to your downloads: your settings, your favourite items and your
favourited dailies. It takes a second and it is the only copy that does not depend on the browser
keeping your storage.

### Updating in place

| Browser | Keeps your data if… |
|---|---|
| Chrome | You unpack the new version **over the same folder** and press **Reload** on `chrome://extensions`. An unpacked extension's ID comes from its absolute path, so a folder in a new location is a *different* extension with empty storage. |
| Firefox | Always — the build declares a fixed add-on ID (`neo-snipe@treygrr`), so storage follows it even though the add-on itself has to be re-loaded after every restart. |
| Safari | You rebuild the app with the **same bundle identifier**. Change it and macOS treats it as a different extension. |

So on Chrome, either keep the folder path stable, or take the backup and import it after loading
the new one. `chrome://extensions` (and `about:debugging` on Firefox) shows the version currently
loaded, if you are not sure whether an update took.

### Moving to another browser

Settings do not travel by themselves — `storage.sync` syncs within one browser account, never
between two different browsers.

1. In the old browser: panel → cog → **Save file**.
2. Install the new browser's build (see the README in its release folder).
3. In the new browser: panel → cog → **Load file**, pick the JSON, press **Import**.

The same file works for moving between profiles or machines, and a file from an older version
still imports — it carries a version number, and a build reads anything up to its own rather than
requiring an exact match. It will refuse a file written by a *newer* build instead of applying half
of it.

Two things to expect. **Import replaces your lists rather than merging them**, so the new browser
ends up with exactly what the file holds. And cached prices and Food Club done-marks are
deliberately not in the file — the first comes back on its own, and the second belongs to a round
that will be over by the time you import.

## Building from source

### Chrome

```bash
cd extension
npm install
npm run build
```

`chrome://extensions` → enable Developer mode → **Load unpacked** → pick `extension/dist`. That is
the whole install. The options page has a **Test a lookup** button if you want to confirm it can
reach Jelly Neo.

### Working on it

You should not have to install the extension by hand every time:

```bash
npm run fixture                  # offline test page, no login and no network
npm run dev:browser              # real neopets.com, login persists between runs
npm run dev:browser -- --fresh   # wipe the saved profile
npm run dev                      # Vite with hot reload, run alongside
```

`npm run fixture` is the fast loop for UI work: it builds if needed, then opens a browser with the
extension loaded on the same saved markup the tests use — all five item surfaces on one page, the
Food Club bet form and the daily sets, with Jelly Neo answered from fixtures. No Neopets account,
no network.

The routes are shared with the end-to-end tests (`test/routes.mjs`) so the two cannot drift: the
Food Club tab worked in the tests and was broken in the dev browser once, because only the tests
had those routes.

`dev:browser` launches Chromium with the built extension side-loaded and a persistent profile, so
your Neopets login survives between runs. It reports whether the extension actually loaded rather
than silently opening a browser without one, and clears a stale profile lock left by an uncleanly
closed window — otherwise every run after the first fails with "Opening in existing browser
session". If a dev browser is genuinely still open it says so; `--fresh` starts clean. `--fixture` serves the same saved markup the tests use —
all five item surfaces on one page, with Jelly Neo answered from fixtures — so you can work on the
UI with no login and no network.

Note that recent Google Chrome refuses `--load-extension`, so this uses Playwright's bundled
Chromium. Firefox cannot side-load at all from Playwright; use `npm run test:firefox`, or load
`dist-firefox/manifest.json` through `about:debugging` in your own Firefox.

### Firefox

```bash
cd extension
npm run build:firefox
```

`about:debugging` → **This Firefox** → **Load Temporary Add-on** → pick any file in
`extension/dist-firefox`. Then open the extension's options and click **Grant access to Jelly Neo**:
Firefox treats MV3 host permissions as opt-in, so lookups fail until you do.

Temporary add-ons are removed when Firefox restarts. A permanent install needs the package signed
through addons.mozilla.org.

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
3. Safari → Develop → **Allow Unsigned Extensions** (this resets every time Safari restarts; a real
   signing identity avoids it).
4. Safari → Settings → Extensions → enable **neo-snipe**, and set neopets.com to **Always Allow**.
5. That's it — the options page has a **Test a lookup** button if you want to confirm it works.

Set `SAFARI_BUNDLE_ID` to use your own bundle identifier.

The generated Xcode project is checked in, so the repo holds everything the three builds need and
you can open it without running the generator first. Two things follow from it being generated:
`build:safari-app` deletes and recreates it each run, and the new `project.pbxproj` carries fresh
object identifiers, so expect that one file to show up rewritten after every run even when nothing
about the app changed. Xcode's derived data under `safari/build/` stays out — 180MB of module
caches that rebuild themselves.

Its file references reach back out to `../../../extension/dist-safari/`, so the app is a wrapper
around the built extension rather than a copy of it: rebuilding with `npm run build:safari` is
enough to change what the app loads.

## The bar

A small **neo-snipe** bar sits in the bottom-right of every Neopets page. Clicking it opens a panel
with three tabs:

Under the item information sit two icons: **⇄ Trading Post** and **⚖ Auction House**, each opening
a search for that exact item in a new tab. Those URL shapes are taken verbatim from the "Find This
Item" links on a Jelly Neo item page rather than written from memory. Both shop wizards are tabs
rather than icons, since neither has a page a link can reach.

The popover's **SW** tab runs the regular Shop Wizard. Neopets limits how often you may search, so
both wizard tabs run **only when you open them** — never on opening a popover — and keep their
result for 15 minutes per item, with an *again* button to force a fresh search.

The regular wizard returns only about twenty shops, and a different slice each time, so searching
again **adds** to the list rather than replacing it: one row per shop owner, a shop seen twice
keeping its newer price, still sorted cheapest first. The header says how many searches the list
came from — as one line that ellipsizes rather than a set of chips, which at 10px in a 340px card
wrapped onto three rows and pushed the button off on its own. The *again* button doubles as the
freshness readout, showing `now` or `12m`. Being told to slow down is reported as that, rather than
as an empty shop list.

Like the SSW it is an endpoint rather than a page, but it answers with an HTML fragment instead of
JSON, so `wizard.js` parses markup where `ssw.js` reads fields.

It also refuses any request that did not come from the wizard page — *"you have been directed to
this page from the wrong place"*. `Referer` is a forbidden header for `fetch`, but the `referrer`
option is not, and setting it to the wizard page satisfies the check. That was found by calling the
endpoint from an inventory page against a live session and reading the refusal, not by guessing;
without it the tab would have returned nothing on every item.

The **Super Shop Wizard** has no page you can link to with a query — it is a JSON endpoint the SSW
interface calls (`/np-templates/views/shops/ssw/ssw_query.php`). It is the **SSW tab**, querying that endpoint from
the content script, same-origin with your session. Hidden unless *I have Neopets Premium* is on in settings — off by default, since the
endpoint only answers for Premium accounts and a tab that always errors is worse than no tab. Rows are listed cheapest first with stock counts, each linking straight into that
shop with the item selected. Premium is not detected or configured: the endpoint's own `error`
field says whether it will answer, and that message is shown as-is.

- **Favourites** — click the ♥ on any item's price popover to save it here, and drag the rows to
  reorder them. Opening a favourite **always re-fetches**, ignoring the cache: a saved item is one
  you are watching, so a day-old price is the wrong answer. It uses the same popover as a badge
  click.
- **Dailies** — 110 quick links in nine groups: money makers, all seven wheels, free stuff, games
  of chance, the daily prize spots, both lab rays, training schools, contests and the quest givers.
  Groups collapse, with a chevron showing their state. Premium-only links are hidden unless *I have
  Neopets Premium* is on — including one you favourited while it was — since a link to a page you
  cannot use is just noise. That is decided by the URL path (`/premium/…`) rather than by tagging
  entries by hand, so a premium link added later is caught without anyone remembering to flag it. Hovering a daily reveals a ♥ — favourited
  ones are pinned to a group at the top, draggable to reorder, while staying in their original
  group so the list does not reshuffle under you as you star things.

  Every URL is taken verbatim from a published guide — [Jelly Neo's](https://www.jellyneo.net/?go=dailies)
  and [The Daily Neopets'](https://thedailyneopets.com/dailies) — and generated from those pages
  rather than typed. The second is curated, since it also lists its own games nav and site sections.
  Where they disagreed, the conflict was resolved by checking: TDN gives the Lab Ray as
  `lab2.phtml`, Jelly Neo as `lab.phtml`, and `lab2.phtml` redirects to `destination=/lab.phtml`.

Every daily URL is taken verbatim from [Jelly Neo's dailies guide](https://www.jellyneo.net/?go=dailies)
and `src/lib/dailies.js` is generated from that page rather than written from memory — the same
discipline as the Neopets selectors, and for the same reason.

- **Food Club** — reads the current round straight off `/pirates/foodclub.phtml?type=bet`: your
  per-bet maximum, every arena's pirates and their odds. It shows the four daily sets published on
  [~Shrmsh](https://www.neopets.com/~Shrmsh) — Beginner, Standard, Aggressive, Adventurous — each
  bet resolved against this round's odds with its payout at your chosen stake.

  Each bet has one button. **Place** places it without leaving the page:
  `process_foodclub.phtml` takes a whole bet on the query string, so the panel requests that URL
  directly and reports the result in a toast. The URL shape is
  [neofood.club's](https://neofood.club) own, read out of its bundle rather than guessed —
  `winner<n>` and `matches[]` for the arenas being bet on, then the stake, the odds, and the
  winnings capped at the 1M NP Neopets will pay on one bet.

  The request goes from the panel, not the service worker: the panel lives in the Neopets page, so
  it is same-origin and already carries your session, where the worker would need host access to
  all of neopets.com — a far broader permission than placing one bet is worth.

  A placed bet is marked done **only once Neopets has accepted it**, so a refused bet stays on the
  list to try again, with the reason in the toast. While a bet is in flight its button spins and
  the others are disabled, so a slow response cannot become two bets. Marks are stored against the
  round number, so they clear when a new round opens rather than carrying over onto different bets;
  you can tick or untick one yourself.

  The handler's success page has not been captured, so the code does not claim to recognise
  success — it recognises Neopets' refusals and treats anything else as placed. **Your bets** and
  **Collect winnings** sit at the bottom of the tab, and the toast links to the first, so a placed
  bet can always be confirmed at the source.

  A pirate whose name is not in the current round is shown struck through and its bet cannot be
  placed, rather than being guessed at. The sets come from someone's personal pet page: if they
  change its layout the tab says so instead of showing nothing.

A **cog** beside the panel's close button opens settings: Premium detection, the hover-only badge
toggle, and **export/import**.

Premium is **detected from the site navigation**, which carries links to `/premium/…` and the Super
Shop Wizard icon only for subscribers. Verified on one account before and after subscribing: the
same pages went from zero premium links to nine. A page that does not render the nav returns
*unknown* rather than *no*, so the last answer stands instead of being overwritten. Turn detection
off and the manual toggle takes over.

Detection could also be done by probing the SSW endpoint — it answers `"Access denied."` without
Premium — but that spends a request every time, and reading the nav costs nothing.

Export writes your settings, favourites and favourited dailies as JSON — to the clipboard, a file,
or a box you can copy from. Import reads one back. Cached prices and Food Club done-marks are
deliberately left out: the first is a throwaway copy of Jelly Neo, the second is scoped to a round
that will be over by the time anyone imports it. The file carries a version, so a build refuses one
written by something newer rather than half-applying it, and ignores keys it does not recognise.

The panel opens two ways: from the bar, where it sits above it, and from the **toolbar button**,
where it drops under the button at the top right. That button is disabled everywhere except
Neopets — and rather than take the broad `tabs` permission just to read each tab's URL, it starts
disabled and each content script enables it for its own tab as it loads.

Like the badges, the bar itself is plain DOM. It appears on every page, so it must not pull in Vue
or Vuetify; clicking it is what loads the panel.

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

Note what is **not** used: Neopets' `obj_info_id`, which appears in shop `data-link` attributes and
wizard links. That is Neopets' item id and has nothing to do with Jelly Neo's — Potion of
Concealment is `obj_info_id` 8668 on Neopets and item 2243 on Jelly Neo, while Jelly Neo's 8668 is
a White Chocolate Aisha. Feeding one to the other skips the search and returns a confidently wrong
item, so every lookup resolves by name and image hash.

So an item is **not necessarily an `<img>`**, and image URLs are often protocol-relative
(`//images.neopets.com/items/...`). `detect.js` resolves the image from `src`, `data-src`,
`data-image`, or an inline background, then resolves the name in order of reliability: data
attributes first, then a labelled name node nearby, then `alt`, then a link in the listing row.

The one trap worth knowing: on the grid surfaces **`alt` and `title` hold the item description,
not its name** ("This mystical codestone is used for training pets..."). Trusting `alt` there
sends Jelly Neo a whole sentence, so `alt` is only consulted on a real `<img>`. When no name can
be resolved the element is marked and skipped — a wrong name is worse than no badge.

## Notes on the design

**Why lookups happen in the service worker.** Jelly Neo serves complete HTML to a plain fetch, so
a page is all it takes to get a price — no browser engine has to render anything. MV3 service
workers have no DOM, though, so parsing uses `linkedom` rather than `DOMParser`.

**Why trading post history is a second request.** The popover has two tabs: price history (which
comes with the item lookup) and TP history, which lives on its own Jelly Neo page. That page is
generated on demand and can take ~20s for a heavily traded item before their cache warms. Making
every price lookup wait on that would be a bad trade, so it is fetched only when someone opens
that tab — and items nobody asks about never cost Jelly Neo the page at all.

Note that an empty lot list is not always "no activity": Jelly Neo declines to publish TP history
for low-value items, and the popover shows that explanation rather than an empty table.

**Why badges are plain DOM.** A safety deposit box page can show 100+ items. There is exactly one
Vue app — the popover — mounted lazily on the first badge click and reused after that. In the
Chrome build the Vuetify bundle isn't even downloaded until you click something.

**Why Safari and Firefox get a different build.** Safari can neither `fetch()` a web-accessible
resource nor dynamically `import()` one from a content script, and Firefox has long-standing
trouble with dynamic import there too. The Chrome build relies on both. So `--mode safari` and
`--mode firefox` use a statically-bundled content entry (`src/content/index.safari.js`), inline the
stylesheet rather than fetching it, and flatten CRXJS's dynamic-import loaders into self-contained
classic scripts. Firefox additionally has no MV3 service worker, so its background becomes an event
page (`background.scripts`), and its host permissions are opt-in — hence the **Grant access** button
in the options. The cost is a ~660KB content script on every Neopets page instead of on first
click; the Chrome build keeps the lazy path. Extension APIs go through `src/lib/ext-api.js`, which prefers Safari's
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
prefetch, so a page showing 100 items costs Jelly Neo nothing until you actually ask about one.
Requests are serialised with a ~700ms floor between them, identical lookups in flight are
coalesced, and results are cached for 24h. Please keep it that way if you extend this, and check
their robots.txt and terms before taking it further than personal use.

## Tests

```bash
cd extension
npm run test:jellyneo                        # Jelly Neo parsing, from saved pages — no network
npm run test:detect                          # detection against real Neopets markup
npm run test:foodclub                        # Food Club odds, sets and bet resolution
npm run test:icons                           # the shipped PNGs match icons/icon.svg
npm run build   && npm run test:e2e            # the real thing, in real Chrome
npm run build:safari  && npm run test:safari   # the Safari bundle, in WebKit
npm run build:firefox && npm run test:firefox  # the Firefox bundle, in Gecko
```

Nothing touches the network: both end-to-end suites serve Jelly Neo from saved pages, so they are
deterministic and never reach the live site.

`test:e2e` loads the built extension into Chrome and serves a fake Neopets page from the
neopets.com origin so the content script matches, then checks badge injection, that no extension
CSS reaches the page, that Vuetify overlays stay inside the shadow root, hover-only badges, a live
priced popover, and the Jelly-Neo-unreachable error path.

`test:safari` and `test:firefox` run the flattened bundles in the engine that actually ships them —
WebKit and Gecko — with a stubbed extension runtime (`test/bundle.mjs`, one harness, two targets).
They cover what those builds change: the popover mounts with no dynamic import and no fetched
stylesheet, the inlined CSS is adopted, and Vue and Vuetify run under JavaScriptCore and
SpiderMonkey rather than V8. They cannot exercise a real extension host (permission prompts, the
real background page); that part needs the manual steps above.

`npx web-ext lint --source-dir extension/dist-firefox` validates the Firefox package with Mozilla's
own linter.

## Layout

| Path | What it is |
|---|---|
| `extension/src/lib/jellyneo.js` | Every Jelly Neo selector and URL, plus fetching and parsing. Start here when the site changes. |
| `extension/src/background.js` | Lookups: cache, dedupe, error mapping. |
| `extension/src/lib/queue.js` | Rate limit and request coalescing. |
| `extension/src/content/` | Detection, badge injection, shadow-root mount. `run.js` is shared; `index.js` / `index.safari.js` are the per-browser entries. |
| `extension/src/lib/ext-api.js` | `browser` / `chrome` shim and storage fallback. |
| `extension/src/ui/` | Vue components, Vuetify config, popover state. |
| `extension/vite-plugin-neosnipe.js` | Keeps Vuetify's CSS out of the Neopets page; flattens and prunes the Safari and Firefox bundles. |
| `extension/scripts/build-safari-app.sh` | Safari bundle → Xcode wrapper → compiled app. |
| `extension/icons/icon.svg` | The icon's source. `npm run icons` renders the PNGs the manifest needs; the 16px drops anything marked `.detail`. |
