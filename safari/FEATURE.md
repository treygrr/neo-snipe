# safari — the generated macOS wrapper app that lets Safari load the extension

Safari only loads a web extension that ships inside a signed macOS app, so this folder is that app.
It is **generated, not hand-written**: `extension/scripts/build-safari-app.sh` runs `npm run build:safari`,
`rm -rf`s this whole folder, and re-creates it by running `xcrun safari-web-extension-converter dist-safari`
from `extension/` with `--project-location ../safari --app-name neo-snipe --bundle-identifier "$BUNDLE_ID"
--macos-only --no-open --no-prompt --force`, then `xcodebuild`s it unsigned (`CODE_SIGN_IDENTITY="-"`)
into `safari/build/Build/Products/Debug/neo-snipe.app`.

## Map

| File | What it does |
|---|---|
| `neo-snipe/neo-snipe.xcodeproj/project.pbxproj` | Two targets: app `com.gilbertrogers.neo-snipe` and appex `…​.Extension`. The web-extension payload is *referenced in place* — `background.js`, `content.js`, `manifest.json`, `icons/`, `assets/`, `src/` all have `path = ../../../extension/dist-safari/…`, so a stale `dist-safari` ships silently. |
| `neo-snipe/neo-snipe.xcodeproj/project.xcworkspace/contents.xcworkspacedata` | One-line workspace pointing at `self:`. |
| `neo-snipe/neo-snipe/AppDelegate.swift` | `@main` `AppDelegate`; only override is `applicationShouldTerminateAfterLastWindowClosed → true`. |
| `neo-snipe/neo-snipe/ViewController.swift` | Loads `Main.html` into the `webView` outlet; on `didFinish` calls `SFSafariExtensionManager.getStateOfSafariExtension` and injects `show(isEnabled, macOS13+)`; on the `controller` script message `"open-preferences"` calls `SFSafariApplication.showPreferencesForExtension` then terminates. Top-level `let extensionBundleIdentifier = "com.gilbertrogers.neo-snipe.Extension"`. |
| `neo-snipe/neo-snipe/Base.lproj/Main.storyboard` | Main menu, window, and the `ViewController` scene wiring the `webView` (`wkWebView`) outlet. |
| `neo-snipe/neo-snipe/Info.plist` | Only key is `SFSafariWebExtensionConverterVersion = 26.2`; the rest is generated (`GENERATE_INFOPLIST_FILE = YES` plus `INFOPLIST_KEY_*`). |
| `neo-snipe/neo-snipe/Assets.xcassets/` | `AppIcon` set (16/32/128/256/512 @1x/@2x `mac-icon-*.png`), empty `AccentColor` colorset and `LargeIcon` imageset. |
| `neo-snipe/neo-snipe/Resources/Base.lproj/Main.html` | The app's single page: `Icon.png`, the mutually-exclusive `state-unknown`/`state-on`/`state-off` paragraphs, and `button.open-preferences`. |
| `neo-snipe/neo-snipe/Resources/Script.js` | `show(enabled, useSettingsInsteadOfPreferences)` toggles `state-on`/`state-off` on `body` and rewrites the copy to say "Settings" on macOS 13+; `openPreferences()` posts to `webkit.messageHandlers.controller`. |
| `neo-snipe/neo-snipe/Resources/Style.css` | Centres the page, `color-scheme: light dark`, hides whichever state paragraphs don't apply. |
| `neo-snipe/neo-snipe/Resources/Icon.png` | 128pt icon shown on that page. |
| `neo-snipe/neo-snipe Extension/SafariWebExtensionHandler.swift` | `beginRequest(with:)` — the converter stub: `os_log`s the `SFExtensionMessageKey` payload and profile UUID, then replies `["echo": message]`. The extension does not use native messaging. |
| `neo-snipe/neo-snipe Extension/Info.plist` | Declares the appex as `com.apple.Safari.web-extension` with principal class `SafariWebExtensionHandler`. |

## Rules

- **Do not edit anything here by hand.** The next `build-safari-app.sh` deletes the folder. Extension changes belong in `extension/`; wrapper changes belong in the converter flags in that script.
- **Keep the bundle identifier.** macOS treats a changed id as a different extension, so users lose their stored data (README, "Updating in place"). `SAFARI_BUNDLE_ID` overrides the default in the build script.
- The built app is unsigned, so Safari needs Develop → Allow Unsigned Extensions, which resets on every Safari restart.

---
**Keep this file current.** When you change anything in this folder, update this file in the same commit.
