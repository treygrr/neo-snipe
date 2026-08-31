import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json' with { type: 'json' };

/**
 * @param {'chrome'|'safari'|'firefox'} target
 *
 * Safari and Firefox both need the statically-bundled content entry: neither
 * reliably supports dynamic import() from a content script. The build keeps
 * `service_worker` here so CRXJS bundles the background entry; the packaging
 * plugin rewrites it to `background.scripts` for Firefox, which has no
 * service-worker support in MV3.
 */
export default function makeManifest(target = 'chrome') {
  return defineManifest({
    manifest_version: 3,
    name: 'neo-snipe',
    description: 'Jelly Neo price lookups on every Neopets item.',
    version: pkg.version,
    icons: { 16: 'icons/icon-16.png', 48: 'icons/icon-48.png', 128: 'icons/icon-128.png' },
    permissions: ['storage'],
    // The service worker fetches Jelly Neo directly. Host permission here is
    // what exempts those requests from CORS; content scripts cannot do this.
    host_permissions: ['https://items.jellyneo.net/*'],
    background: { service_worker: 'src/background.js', type: 'module' },
    // No default_popup: the click opens the panel in the page instead.
    action: {
      default_title: 'neo-snipe — favourites, dailies and Food Club',
      default_icon: { 16: 'icons/icon-16.png', 48: 'icons/icon-48.png', 128: 'icons/icon-128.png' },
    },
    content_scripts: [
      {
        matches: ['*://*.neopets.com/*'],
        js: [target === 'chrome' ? 'src/content/index.js' : 'src/content/index.safari.js'],
        run_at: 'document_idle',
        all_frames: true, // some Neopets pages still render inside frames
      },
    ],
    options_ui: {
      page: 'src/options/index.html',
      // Safari does not support open_in_tab and warns about it at conversion.
      ...(target === 'safari' ? {} : { open_in_tab: true }),
    },
    // Firefox needs a stable id to be installable and signable.
    ...(target === 'firefox'
      ? { browser_specific_settings: { gecko: { id: 'neo-snipe@treygrr', strict_min_version: '128.0' } } }
      : {}),
  });
}
