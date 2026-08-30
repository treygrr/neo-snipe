#!/usr/bin/env bash
# Builds the Safari-flavoured extension, wraps it in the macOS app Safari
# requires, and compiles that app. Requires Xcode.
set -euo pipefail
cd "$(dirname "$0")/.."

BUNDLE_ID="${SAFARI_BUNDLE_ID:-com.gilbertrogers.neo-snipe}"
APP_NAME="neo-snipe"
PROJECT_DIR="../safari"

echo "==> Building the Safari extension bundle"
npm run build:safari

echo "==> Generating the Xcode wrapper ($BUNDLE_ID)"
rm -rf "$PROJECT_DIR"
xcrun safari-web-extension-converter dist-safari \
  --project-location "$PROJECT_DIR" \
  --app-name "$APP_NAME" \
  --bundle-identifier "$BUNDLE_ID" \
  --macos-only --no-open --no-prompt --force

echo "==> Compiling the app"
cd "$PROJECT_DIR"
xcodebuild -project "$APP_NAME/$APP_NAME.xcodeproj" -scheme "$APP_NAME" \
  -configuration Debug -derivedDataPath build \
  CODE_SIGN_IDENTITY="-" CODE_SIGN_STYLE=Manual \
  DEVELOPMENT_TEAM="" PROVISIONING_PROFILE_SPECIFIER="" build \
  | grep -E "BUILD|error:" || true

APP="$(pwd)/build/Build/Products/Debug/$APP_NAME.app"
echo
echo "App built: $APP"
echo
echo "To load it in Safari:"
echo "  1. open '$APP'          (registers the extension, then quit it)"
echo "  2. Safari > Settings > Advanced > tick 'Show features for web developers'"
echo "  3. Safari > Develop > tick 'Allow Unsigned Extensions'   (resets each Safari restart)"
echo "  4. Safari > Settings > Extensions > enable neo-snipe, and Always Allow on neopets.com"
echo "  5. Open the extension's options and enter your server token"
