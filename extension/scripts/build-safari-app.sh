#!/usr/bin/env bash
# Builds the Safari-flavoured extension, wraps it in the app Safari requires,
# and compiles that app. Requires Xcode.
#
# NS_PLATFORM=macos (default) | ios | all
#   macos  the macOS app, signed ad-hoc, for loading via "Allow Unsigned Extensions"
#   ios    the iPhone/iPad app; needs a signing team, so pass NS_TEAM_ID
#   all    one project holding both, so the iOS app can be built from Xcode
set -euo pipefail
cd "$(dirname "$0")/.."

BUNDLE_ID="${SAFARI_BUNDLE_ID:-com.gilbertrogers.neo-snipe}"
PLATFORM="${NS_PLATFORM:-macos}"
TEAM_ID="${NS_TEAM_ID:-}"
APP_NAME="neo-snipe"
PROJECT_DIR="../safari"

case "$PLATFORM" in
  macos) CONVERT_FLAG=(--macos-only); SCHEME="$APP_NAME" ;;
  ios)   CONVERT_FLAG=(--ios-only);   SCHEME="$APP_NAME" ;;
  # Both platforms in one project means two schemes, suffixed by the converter.
  all)   CONVERT_FLAG=();             SCHEME="$APP_NAME (macOS)" ;;
  *) echo "NS_PLATFORM must be macos, ios or all (got '$PLATFORM')" >&2; exit 1 ;;
esac

echo "==> Building the Safari extension bundle"
npm run build:safari

echo "==> Generating the Xcode wrapper ($BUNDLE_ID, $PLATFORM)"
rm -rf "$PROJECT_DIR/$APP_NAME"
xcrun safari-web-extension-converter dist-safari \
  --project-location "$PROJECT_DIR" \
  --app-name "$APP_NAME" \
  --bundle-identifier "$BUNDLE_ID" \
  ${CONVERT_FLAG[@]+"${CONVERT_FLAG[@]}"} --no-open --no-prompt --force

cd "$PROJECT_DIR"

# iOS cannot be built unsigned: an app only reaches a device through a
# provisioning profile, so the build needs a real team even for a personal one.
if [ "$PLATFORM" = ios ]; then
  if [ -z "$TEAM_ID" ]; then
    echo
    echo "Project generated at $(pwd)/$APP_NAME/$APP_NAME.xcodeproj"
    echo "Set NS_TEAM_ID to build it, or open it in Xcode and pick a team under"
    echo "Signing & Capabilities. See the iOS section of the README."
    exit 0
  fi
  echo "==> Compiling the iOS app (team $TEAM_ID)"
  xcodebuild -project "$APP_NAME/$APP_NAME.xcodeproj" -scheme "$SCHEME" \
    -configuration Debug -derivedDataPath build \
    -destination 'generic/platform=iOS' \
    DEVELOPMENT_TEAM="$TEAM_ID" CODE_SIGN_STYLE=Automatic build \
    | grep -E "BUILD|error:" || true
  echo
  echo "Built. Run it on a device from Xcode: open the project, pick your iPhone, press Run."
  exit 0
fi

echo "==> Compiling the app"
xcodebuild -project "$APP_NAME/$APP_NAME.xcodeproj" -scheme "$SCHEME" \
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
echo "     and on items.jellyneo.net"
