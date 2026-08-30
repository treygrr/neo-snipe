import { createApp } from 'vue';
// A normal page, so styles are imported the ordinary way — none of the shadow
// DOM workarounds the content script needs apply here.
import 'vuetify/styles';
import OptionsApp from '../ui/OptionsApp.vue';
import { makeVuetify } from '../ui/vuetify.js';
import { VContainer, VMain, VSwitch, VTextField } from 'vuetify/components';

const app = createApp(OptionsApp);
const vuetify = makeVuetify(false);
app.use(vuetify);
// Components the options page uses that the popover does not.
for (const [name, c] of Object.entries({ VContainer, VMain, VSwitch, VTextField })) {
  app.component(name, c);
}
app.mount('#app');
