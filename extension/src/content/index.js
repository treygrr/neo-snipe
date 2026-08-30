import { run } from './run.js';

// Chrome entry: the Vue + Vuetify bundle is fetched only once a badge is
// actually clicked, so pages full of items stay cheap.
run(async () => {
  const [mount, store] = await Promise.all([import('./mount.js'), import('../ui/store.js')]);
  return { mount, store };
});
