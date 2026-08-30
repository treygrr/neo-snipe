import { createVuetify } from 'vuetify';
// Explicit imports, not the auto-import plugin: auto-import adds per-component
// CSS side effects, which Vite would inject into the Neopets page. Everything
// here is JS only; all styling comes from the ?inline sheet we adopt ourselves.
import {
  VApp, VAlert, VBtn, VCard, VCardActions, VCardText, VChip,
  VDivider, VImg, VMenu, VProgressCircular, VSpacer, VTab, VTable, VTabs,
} from 'vuetify/components';
// SVG icons, not the webfont: @font-face declared inside a shadow root does not
// resolve in Chrome, and we don't want to leak a font-face rule into the page.
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

// Vuetify scopes its theme variables to `.v-theme--<name>` (and `:root`).
// Overlays are attached to our shadow root rather than to <v-app>, so the root
// has to carry this class or they resolve outside any theme.
export const THEME = 'light';

export function makeVuetify(attach) {
  return createVuetify({
    components: {
      VApp, VAlert, VBtn, VCard, VCardActions, VCardText, VChip,
      VDivider, VImg, VMenu, VProgressCircular, VSpacer, VTab, VTable, VTabs,
    },
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    // Keeps menus/tooltips/dialogs inside the shadow root instead of teleporting
    // them to document.body, where they'd be unstyled and inherit Neopets' CSS.
    defaults: { global: { attach } },
    theme: { defaultTheme: THEME },
  });
}
