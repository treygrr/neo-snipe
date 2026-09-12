# extension — the build system: one source tree, three browser packages

Everything here turns `src/` into a loadable extension. `vite.config.js` picks a target from
`--mode`, `manifest.config.js` generates the MV3 manifest for that target, and
`vite-plugin-neosnipe.js` rewrites the finished output so Vuetify's CSS never reaches the Neopets
page — and, for Safari/Firefox, so nothing depends on dynamic `import()` at runtime.

## Map

| File | What it does |
|---|---|
| `vite.config.js` | Default export: a `defineConfig(({ mode }) => …)` that maps mode → `target` (chrome/safari/firefox) and `outDir` (`dist`, `dist-safari`, `dist-firefox`), wires `vue()` + `crx({ manifest: makeManifest(target) })` + `neosnipe({ target, outDir })`, and forces `cssCodeSplit: false` and `modulePreload: false`. |
| `manifest.config.js` | `makeManifest(target)` → the MV3 manifest: `storage` permission, `host_permissions` for `items.jellyneo.net`, `background.service_worker: src/background.js`, an `action` with no popup, and the per-target content entry (`src/content/index.js` for Chrome, `index.safari.js` otherwise). Adds the Gecko add-on id for Firefox; drops `options_ui.open_in_tab` for Safari. |
| `vite-plugin-neosnipe.js` | Default export `neosnipe({ target, outDir })`, a `closeBundle` plugin. Deletes `content_scripts[].css` from the manifest, concatenates the emitted stylesheets, then either `packageForChrome` (write `neosnipe-content.css`, add it to `web_accessible_resources`) or `packageFlattened` (`flatten()` each CRXJS loader into one esbuild IIFE, substitute the CSS into `/*__NEOSNIPE_CSS__*/`, switch Firefox to `background.scripts`, drop `web_accessible_resources`, then `pruneUnreachable()`). |
| `package.json` | Version (the manifest reads it), deps, and the scripts: `build` / `build:firefox` / `build:safari` / `build:all`, `build:safari-app`, `dev`, `dev:browser`, `fixture`, `release`, `icons`, and the `test:*` suites. |
| `package-lock.json` | npm lockfile. Untracked at the time of writing. |

## Subfolders

| Folder | See |
|---|---|
| `src/` | `src/FEATURE.md` — background worker, content scripts, lib parsers, Vue UI, options page. |
| `test/` | `test/FEATURE.md` — `node --test` unit suites, the Chrome e2e run, the WebKit/Gecko bundle harness, fixtures. |
| `scripts/` | `scripts/FEATURE.md` — release packaging, dev browser launcher, Safari app generator, icon rendering. |
| `icons/` | `icon.svg` plus the 16/48/128 PNGs the manifest names; `npm run icons` regenerates the PNGs; `npm run test:icons` checks their declared sizes and RGBA (it does not re-render and compare). |

## Rules a future editor must know

- `cssCodeSplit` and `modulePreload` must stay off: Vite emits those URLs page-relative, so a
  content script would fetch chunks from `neopets.com`.
- The flattened builds fail hard if `/*__NEOSNIPE_CSS__*/` is missing from the content bundle, and
  `pruneUnreachable` throws rather than shipping a dangling reference — both are load-bearing.
- `manifest.config.js` always declares `background.service_worker` so CRXJS bundles the entry; the
  plugin is what rewrites it to an event page for Firefox.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
