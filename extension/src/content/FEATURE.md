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
| `run.js` | `run(loadUi)`: the shared body. Collects every named item on the page for the search panels (`setPageItems`). Lazy `ui()` bootstrap, `activate()`, `openPanel()`, `scan()`, the 150 ms-debounced MutationObserver, the `hoverOnly`/`movableLauncher`/`trackDailyVisits` settings read, the `HELLO` ping and the `OPEN_PANEL` listener. |
| `detect.js` | Item recognition: `findItemElements`, `isItemElement`, `itemImageUrl`, `itemNameFor`, `itemPriceFor`, `imageHashOf`, `describeItem`, and the `MARK` dataset flag. Seven surfaces; the name strategies run most-authoritative first — `nameFromCell` (gallery `<b>` under the art, own cell only, before the row link) and `nameFromCaption` for unlabelled grids come last. |
| `badge.js` | `addBadge(el, item, onActivate)` anchors/wraps the element and appends the magnifier button; `setBadgeState(btn, state)` drives the loading/error styling. Injects its own scoped `<style>`. |
| `launcher.js` | The bottom-right bar: `addLauncher(onActivate)`, `setLauncherOpen`, `setLauncherDraggable`, `resetLauncherPosition`. Five children — `-grip` (the drag handle, leftmost, hidden when `movableLauncher` is off), `-main` (panel), `-sw`/`-ssw` (each opens its search panel; SSW hidden without Premium via `setLauncherPremium`) and `-inv` (a plain link to `INVENTORY_URL`). Clamping and saved position via `lib/positions.js`. |
| `mount.js` | `mountPopover()`: creates the one full-viewport shadow host, adopts the scoped stylesheet, mounts `ui/App.vue` with Vuetify into it. |
| `npanchor.js` | `linkNpAnchorToInventory()` — points the header's `#npanchor` NP counter at the inventory. Rewrites `href` on a link, falls back to a click handler otherwise; marked so repeat scans are free. |
| `popover.css` | Styles for `.ns-root` inside the shadow root: resets inherited Neopets typography, restores `box-sizing: border-box`, and leaves everything but `.v-overlay__content` click-through. |

## Rules worth knowing

- **Never use Neopets' `obj_info_id`** as a Jelly Neo id — the two numbering schemes are unrelated and
  produce confidently wrong items. Always resolve by name + image hash.
- `itemNameFor` returns `null` rather than guessing; `scan()` then marks the element `skip` so it is not
  re-examined on every mutation.
- Inside a shadow root `:root` matches nothing, so `mount.js` rewrites it to `:host` and also steals
  Vuetify's theme `<style>` out of `document.head` — skip either and hovers render as a black wash.
- The same gap bites `box-sizing`: Vuetify's reset is `* { box-sizing: inherit }` under an `html` set to
  border-box, and no `html` exists in a shadow root. Without `.ns-root { box-sizing: border-box }` every
  component inherits the page's content-box — compact fields come out 16px tall, `width: 100%` overflows.
- Badges, the launcher and the NP counter rewrite must stay plain DOM: they run on every page, so
  nothing here may import Vue.
- The launcher's artwork is inlined from `icons/` at build time, never hot-linked: Neopets moving an
  asset path would leave the buttons blank, and the SSW vector is rendered down to a 40 px PNG first
  so every page is not carrying 49 kB of detail drawn at 20.
- Drag hangs off `.neosnipe-launcher-grip`, not the bar or a button. A pointer capture retargets the ending
  click to whatever took the capture, so capturing on the bar swallows its buttons' clicks — and
  leaving the inventory link uncaptured is what keeps ctrl-click and middle-click working.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
