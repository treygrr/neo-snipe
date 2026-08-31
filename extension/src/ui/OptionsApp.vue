<script setup>
import { onMounted, reactive, ref } from 'vue';
import { mdiCheckCircle, mdiAlertCircle, mdiDeleteSweep } from '@mdi/js';
import { DEFAULTS, getSettings } from '../lib/messages.js';
import { writeSettings, sendMessage, hasJellyNeoAccess, requestJellyNeoAccess } from '../lib/ext-api.js';

const form = reactive({ ...DEFAULTS });
const saved = ref(false);
const test = reactive({ state: null, message: '' });

const granted = ref(true);

onMounted(async () => {
  Object.assign(form, await getSettings());
  granted.value = await hasJellyNeoAccess();
});

/**
 * Firefox treats MV3 host permissions as opt-in, so a fresh install cannot
 * reach Jelly Neo until this is granted. The request must come from a click.
 */
async function grantAccess() {
  granted.value = await requestJellyNeoAccess();
  if (granted.value) { test.state = 'ok'; test.message = 'Access granted — lookups will work now.'; }
}

async function save() {
  await writeSettings({ ...form });
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 1800);
}

/** A real lookup end to end — nothing else proves the whole path works. */
async function testLookup() {
  test.state = 'pending';
  test.message = '';
  const res = await sendMessage({ type: 'neosnipe:lookup', item: { name: 'Faerie Paint Brush' } });

  if (res?.ok) {
    test.state = 'ok';
    test.message = `Jelly Neo reachable — Faerie Paint Brush is ${res.data.priceText}`
      + `${res.data.cached ? ' (from cache)' : ''}.`;
  } else {
    test.state = 'error';
    test.message = res?.error === 'offline'
      ? 'Could not reach Jelly Neo. Check your connection.'
      : `Lookup failed: ${res?.detail || res?.error || 'unknown error'}`;
  }
}

async function clearCache() {
  await sendMessage({ type: 'neosnipe:clear-cache' });
  test.state = 'ok';
  test.message = 'Cached prices cleared.';
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="opts">
        <h1 class="text-h5 mb-1">neo-snipe</h1>
        <p class="text-body-2 text-medium-emphasis mb-6">
          Prices come from <a href="https://items.jellyneo.net" target="_blank" rel="noopener">Jelly Neo</a>,
          fetched by the extension itself. Nothing else to install and nothing to run — each item is
          looked up the first time you click its badge, then cached for a day.
        </p>

        <v-alert v-if="!granted" type="info" variant="tonal" density="compact" class="mb-4">
          <div class="mb-2">This extension needs permission to read prices from items.jellyneo.net.</div>
          <v-btn size="small" color="primary" @click="grantAccess">Grant access to Jelly Neo</v-btn>
        </v-alert>

        <v-switch
          v-model="form.hoverOnly"
          label="Only show badges on hover"
          color="primary"
          density="compact"
          hide-details
          class="mb-4"
          @update:model-value="save"
        />

        <div class="d-flex ga-2 flex-wrap">
          <v-btn color="primary" :loading="test.state === 'pending'" @click="testLookup">
            Test a lookup
          </v-btn>
          <v-btn variant="tonal" :prepend-icon="mdiDeleteSweep" @click="clearCache">
            Clear cached prices
          </v-btn>
        </div>

        <v-alert v-if="saved" type="success" variant="tonal" density="compact" class="mt-4">
          Settings saved.
        </v-alert>

        <v-alert
          v-if="test.state === 'ok' || test.state === 'error'"
          :type="test.state === 'ok' ? 'success' : 'error'"
          :icon="test.state === 'ok' ? mdiCheckCircle : mdiAlertCircle"
          variant="tonal"
          density="compact"
          class="mt-4"
        >{{ test.message }}</v-alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.opts { max-width: 560px; padding-top: 32px; }
</style>
