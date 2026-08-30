import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json' with { type: 'json' };

/**
 * @param {'chrome'|'safari'} target
 * Safari needs the statically-bundled content entry; everything else is shared.
 */
export default function makeManifest(target = 'chrome') {
  return defineManifest({
    manifest_version: 3,
    name: 'neo-snipe',
    description: 'Jelly Neo price lookups on every Neopets item.',
    version: pkg.version,
    icons: { 16: 'icons/icon-16.png', 48: 'icons/icon-48.png', 128: 'icons/icon-128.png' },
    permissions: ['storage'],
    // The service worker does the fetching, but it still needs host access.
    host_permissions: ['http://127.0.0.1:8787/*', 'http://localhost:8787/*'],
    background: { service_worker: 'src/background.js', type: 'module' },
    content_scripts: [
      {
        matches: ['*://*.neopets.com/*'],
        js: [target === 'safari' ? 'src/content/index.safari.js' : 'src/content/index.js'],
        run_at: 'document_idle',
        all_frames: true, // some Neopets pages still render inside frames
      },
    ],
    options_ui: {
      page: 'src/options/index.html',
      // Safari does not support open_in_tab and warns about it at conversion.
      ...(target === 'safari' ? {} : { open_in_tab: true }),
    },
  });
}
