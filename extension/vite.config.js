import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import makeManifest from './manifest.config.js';
import neosnipe from './vite-plugin-neosnipe.js';

// `vite build`               → Chrome,  in dist/
// `vite build --mode safari`  → Safari,  in dist-safari/ (wrapped by safari/)
// `vite build --mode firefox` → Firefox, in dist-firefox/
export default defineConfig(({ mode }) => {
  const target = ['safari', 'firefox'].includes(mode) ? mode : 'chrome';
  const outDir = target === 'chrome' ? 'dist' : `dist-${target}`;

  return {
    plugins: [vue(), crx({ manifest: makeManifest(target) }), neosnipe({ target, outDir })],
    build: {
      outDir,
      emptyOutDir: true,
      target: 'esnext',
      // With code-split CSS, Vite injects a <link> at runtime for the async
      // popover chunk using a page-relative URL — another request that would hit
      // neopets.com. One bundled stylesheet avoids the runtime injection entirely.
      cssCodeSplit: false,
      // Preload links are emitted as page-relative URLs, so in a content script
      // the browser would fetch every chunk from neopets.com as well as from the
      // extension origin. The real imports resolve correctly without them.
      modulePreload: false,
    },
  };
});
