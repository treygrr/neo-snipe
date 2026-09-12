# scripts — the build, dev and release entry points behind `extension/`'s npm scripts

Each file here is a standalone executable driven by an npm script in `extension/package.json`.
They orchestrate Vite (`build`, `build:firefox`, `build:safari`), Playwright and Xcode; nothing in
`src/` imports them. Paths are resolved relative to the script's own location, so they work from
any cwd.

## Map

| File | What it does |
|---|---|
| `release.mjs` | `npm run release`. Wipes `release/`, builds all three targets, copies each `dist*/` to `release/<browser>/` with a per-browser `README.md` (built from the inlined `READMES` + `SHARED_TAIL` templates), runs that browser's smoke test against the copied folder, then zips it. Also writes a top-level `release/README.md`. |
| `dev-browser.mjs` | `npm run dev:browser` (and `npm run fixture` = `--fixture`). Launches Playwright Chromium with a persistent `.dev-profile` and `--load-extension`, builds first if `dist/manifest.json` is missing, clears stale Singleton locks, and reports whether the service worker and content script actually came up. `--fixture` installs `test/routes.mjs` routes and opens `inventory.phtml` offline; `--fresh` deletes the profile; `--firefox` exits with instructions, since Playwright Firefox cannot side-load. |
| `make-icons.mjs` | `npm run icons`. Renders `icons/icon.svg` at 16/48/128 px by screenshotting it in headless Chromium, writing `icons/icon-<size>.png`. The 16 px pass hides every `.detail` element in the SVG, which turns to mud at that size. `test:icons` checks the shipped PNGs' declared sizes and RGBA and that the SVG's `.detail` hook survives. |
| `build-safari-app.sh` | `npm run build:safari-app`. Runs `build:safari`, deletes and regenerates `../safari/` via `xcrun safari-web-extension-converter`, then `xcodebuild`s the app ad-hoc-signed into `safari/build/Build/Products/Debug/neo-snipe.app`, printing the manual Safari enable steps. |

## Gotchas

- `release.mjs` runs each smoke test with `NS_DIST` pointed at `release/<browser>/`, not the build
  directory — verifying the artifact that actually ships. `--no-verify` skips them; a missing `zip`
  binary warns instead of failing.
- `dev-browser.mjs` accepts flags as both `-- --fixture` and `npm_config_fixture`, because npm
  swallows an undashed flag into the environment.
- `build-safari-app.sh` recreates the checked-in Xcode project every run, so `project.pbxproj`
  always shows as modified afterwards. `SAFARI_BUNDLE_ID` overrides the default bundle identifier.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
