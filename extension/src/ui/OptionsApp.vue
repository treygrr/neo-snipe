<script setup>
import { onMounted, reactive, ref } from 'vue';
import { mdiCheckCircle, mdiAlertCircle, mdiContentSave } from '@mdi/js';
import { DEFAULTS, getSettings } from '../lib/messages.js';
import { writeSettings } from '../lib/ext-api.js';

const form = reactive({ ...DEFAULTS });
const saved = ref(false);
const test = reactive({ state: null, message: '' });

onMounted(async () => Object.assign(form, await getSettings()));

async function save() {
  await writeSettings({ ...form });
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 1800);
}

async function testConnection() {
  test.state = 'pending';
  try {
    const res = await fetch(`${form.backendUrl.replace(/\/$/, '')}/health`);
    const body = await res.json();
    test.state = body.ok ? 'ok' : 'error';
    test.message = body.ok
      ? `Server reachable. Browser ${body.browserUp ? 'running' : 'idle'}, ${body.cacheSize} cached items.`
      : 'Server responded but reported a problem.';
  } catch {
    test.state = 'error';
    test.message = 'Could not reach the server. Is it running?';
  }
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="opts">
        <h1 class="text-h5 mb-1">neo-snipe</h1>
        <p class="text-body-2 text-medium-emphasis mb-6">
          Prices come from your local scraper, not from Neopets. Start the server, then set the
          matching token below.
        </p>

        <v-text-field
          v-model="form.backendUrl"
          label="Server URL"
          hint="Where the neo-snipe server is listening"
          persistent-hint
          variant="outlined"
          density="comfortable"
          class="mb-4"
        />

        <v-text-field
          v-model="form.token"
          label="Server token"
          type="password"
          hint="Must match NEOSNIPE_TOKEN in the server's .env"
          persistent-hint
          variant="outlined"
          density="comfortable"
          class="mb-4"
        />

        <v-switch
          v-model="form.hoverOnly"
          label="Only show badges on hover"
          color="primary"
          density="compact"
          hide-details
          class="mb-4"
        />

        <div class="d-flex ga-2">
          <v-btn color="primary" :prepend-icon="mdiContentSave" @click="save">Save</v-btn>
          <v-btn variant="tonal" :loading="test.state === 'pending'" @click="testConnection">
            Test connection
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
