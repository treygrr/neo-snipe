# options — the standalone options page: HTML entry + Vue bootstrap

The extension's `options_ui` page (`src/options/index.html`, opened in a tab everywhere but Safari).
It is an ordinary page, not a shadow root, so it just mounts `../ui/OptionsApp.vue` into `#app`
with a Vuetify instance. All real behaviour lives in `OptionsApp.vue`; this folder is only wiring.

## Map

| File | What it does |
|---|---|
| `index.html` | Page shell: `<div id="app">` plus a module `<script>` for `./main.js`. Referenced by `options_ui.page` in `extension/manifest.config.js`. |
| `main.js` | `createApp(OptionsApp)`, installs `makeVuetify(false)` from `../ui/vuetify.js`, registers `VContainer`/`VMain`/`VSwitch`, mounts on `#app`. |

## Things to know

- `makeVuetify(attach)` is called with **`false`** here: overlays teleport to `document.body`,
  which is correct on a real page. The content-script popover passes its shadow root instead.
- Styles are imported normally (`import 'vuetify/styles'`). The extracted-stylesheet /
  `adoptedStyleSheets` / `:root`→`:host` workarounds in `content/mount.js` do not apply here —
  do not copy them in.
- `makeVuetify`'s component list is tuned for the popover; components only the options page uses
  must be registered by hand in `main.js` (currently `VContainer`, `VMain`, `VSwitch`). Adding a
  Vuetify component to `OptionsApp.vue` without adding it here fails at runtime, not at build.
- This is **not** `../ui/SettingsView.vue`. `SettingsView` is the cog panel inside the popover
  (layout, favourites, backup/export-import, driven by `ui/store.js`). `OptionsApp.vue` is the
  separate browser-level page: the `hoverOnly` switch, the Firefox host-permission grant, a live
  "Test a lookup", and clear-cache — it talks to `lib/messages.js` and `lib/ext-api.js` directly.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
