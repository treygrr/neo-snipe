import { createApp } from 'vue';
// Imported normally so Vuetify's per-component CSS side effects are collected
// into the content script's stylesheet. The build's shadow-css plugin then
// keeps that stylesheet out of the manifest and we adopt it here instead, so
// the Neopets page never receives any of it.
import './popover.css';

import PricePopover from '../ui/PricePopover.vue';
import { makeVuetify, THEME } from '../ui/vuetify.js';
import { getURL } from '../lib/ext-api.js';

const CSS_FILE = 'neosnipe-content.css';
const THEME_STYLE_ID = 'vuetify-theme-stylesheet';

// The Safari build replaces this placeholder with the stylesheet itself:
// Safari cannot fetch a web-accessible resource from a content script, so the
// CSS has to travel inside the bundle. Chrome leaves it alone and fetches.
const INLINE_CSS = '/*__NEOSNIPE_CSS__*/';

function stylesheetText() {
  if (INLINE_CSS.length > 32) return Promise.resolve(INLINE_CSS);
  return fetch(getURL(CSS_FILE)).then((r) => r.text());
}

/**
 * `:root` matches the document element, so a `:root` rule inside a shadow root
 * matches nothing at all. Vuetify puts real defaults there — notably
 * `--v-theme-overlay-multiplier: 1`, which its hover rules use as
 * `opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier))`.
 * Lose it and that calc is invalid, opacity falls back to 1, and every hover
 * and ripple renders as a solid black wash.
 *
 * `:host` is the shadow-root equivalent, and custom properties set there
 * inherit to everything inside.
 */
function scopeToShadow(css) {
  return css.replace(/(^|[\s,}])(:root\b)/g, '$1:host');
}

/**
 * Vuetify also generates per-theme colours into a <style> in document.head.
 * Document stylesheets do not apply inside a shadow root, so take a copy in
 * and drop it from the page.
 */
function takeThemeCss() {
  const el = document.getElementById(THEME_STYLE_ID)
    || [...document.head.querySelectorAll('style')].find((s) => s.textContent.includes('--v-theme-'));
  if (!el) return '';

  const css = el.textContent;
  el.remove();
  return css;
}

let mounted = null;

/** Creates the single shadow-DOM host and mounts the one Vue app into it. */
export async function mountPopover() {
  if (mounted) return mounted;

  const css = await stylesheetText();

  const host = document.createElement('div');
  host.dataset.neosnipe = 'popover-host';
  // Spans the viewport so overlays can position anywhere, but passes clicks
  // through; only the popover surface itself re-enables pointer events.
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483000;pointer-events:none';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(scopeToShadow(css));
  shadow.adoptedStyleSheets = [sheet];

  const root = document.createElement('div');
  // The theme class must be on the element overlays attach to, or Vuetify's
  // hover/ripple overlays resolve their variables outside any theme and render
  // as a solid black wash.
  root.className = `ns-root v-theme--${THEME}`;
  shadow.appendChild(root);

  const app = createApp(PricePopover, { attach: root });
  app.use(makeVuetify(root));
  app.mount(root);

  // Only available once Vuetify has installed and mounted.
  const themeCss = takeThemeCss();
  if (themeCss) {
    const themeSheet = new CSSStyleSheet();
    themeSheet.replaceSync(scopeToShadow(themeCss));
    shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, themeSheet];
  }

  mounted = { host, shadow, root, app };
  return mounted;
}
