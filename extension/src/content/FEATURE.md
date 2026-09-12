# content — the script that runs on every neopets.com page

Scans the page for item art, hangs a plain-DOM 🔍 badge on each one, and shows a bottom-right launcher.
Vue + Vuetify load only on first use — a badge click, the launcher, or the toolbar's `OPEN_PANEL`
message — and that mounts the popover into a shadow root so none of the extension's CSS reaches Neopets.

Sequence: `run()` calls `scan()` → `findItemElements` + `describeItem` (detect.js) → `addBadge` (badge.js)
→ on click `activate()` → `ui()` loads the bundle and calls `mountPopover` (mount.js) → `store.openFor`.

## Map

| File | What it does |
|---|---|
| `index.js` | Chrome entry. Calls `run()` with a loader that dynamically `import()`s `mount.js` + `ui/store.js` the first time the UI is needed. |
| `index.safari.js` | Safari entry. Same `run()`, but statically imports mount/store — Safari cannot dynamically import an extension resource. |
| `run.js` | `run(loadUi)`: the shared body. Lazy `ui()` bootstrap, `activate()`, `openPanel()`, `scan()`, the 150 ms-debounced MutationObserver, the `hoverOnly`/`movableLauncher`/`trackDailyVisits` settings read, the `HELLO` ping and the `OPEN_PANEL` listener. |
| `detect.js` | Item recognition: `findItemElements`, `isItemElement`, `itemImageUrl`, `itemNameFor`, `itemPriceFor`, `imageHashOf`, `describeItem`, and the `MARK` dataset flag. Six surfaces; the name strategies run most-authoritative first, ending in `nameFromCaption` for unlabelled grids. |
| `badge.js` | `addBadge(el, item, onActivate)` anchors/wraps the element and appends the magnifier button; `setBadgeState(btn, state)` drives the loading/error styling. Injects its own scoped `<style>`. |
| `launcher.js` | The bottom-right bar: `addLauncher(onActivate)`, `setLauncherOpen`, `setLauncherDraggable`, `resetLauncherPosition`. Two children — `-main` (opens the panel, carries the drag) and `-inv` (a plain link to `INVENTORY_URL`). Clamping and saved position via `lib/positions.js`. |
| `mount.js` | `mountPopover()`: creates the one full-viewport shadow host, adopts the scoped stylesheet, mounts `ui/App.vue` with Vuetify into it. |
| `npanchor.js` | `linkNpAnchorToInventory()` — points the header's `#npanchor` NP counter at the inventory. Rewrites `href` on a link, falls back to a click handler otherwise; marked so repeat scans are free. |
| `popover.css` | Styles for `.ns-root` inside the shadow root: resets inherited Neopets typography and leaves everything but `.v-overlay__content` click-through. |

## Rules worth knowing

- **Never use Neopets' `obj_info_id`** as a Jelly Neo id — the two numbering schemes are unrelated and
  produce confidently wrong items. Always resolve by name + image hash.
- `itemNameFor` returns `null` rather than guessing; `scan()` then marks the element `skip` so it is not
  re-examined on every mutation.
- Inside a shadow root `:root` matches nothing, so `mount.js` rewrites it to `:host` and also steals
  Vuetify's theme `<style>` out of `document.head` — skip either and hovers render as a black wash.
- Badges, the launcher and the NP counter rewrite must stay plain DOM: they run on every page, so
  nothing here may import Vue.
- Drag hangs off `.neosnipe-launcher-main`, not the bar. A pointer capture retargets the ending
  click to whatever took the capture, so capturing on the bar swallows its buttons' clicks — and
  leaving the inventory link uncaptured is what keeps ctrl-click and middle-click working.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
