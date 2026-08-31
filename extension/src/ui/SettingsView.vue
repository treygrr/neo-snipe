<script setup>
import { ref } from 'vue';
import { mdiContentCopy, mdiDownload, mdiUpload, mdiFileUpload } from '@mdi/js';
import { state, setSetting, exportSettings, importSettings } from './store.js';

const fileInput = ref(null);

async function copyExport() {
  if (!state.io.text) await exportSettings();
  try {
    await navigator.clipboard.writeText(state.io.text);
    state.io.message = 'Copied to the clipboard.';
  } catch {
    state.io.message = 'Could not copy — select the text and copy it manually.';
  }
}

async function downloadExport() {
  if (!state.io.text) await exportSettings();
  const blob = new Blob([state.io.text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neo-snipe-settings-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  state.io.message = 'Saved to your downloads.';
}

async function pickFile(event) {
  const file = event.target.files?.[0];
  if (file) await importSettings(await file.text());
  event.target.value = '';
}
</script>

<template>
  <div class="ns-settings">
    <section class="ns-set-block">
      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.premium"
          @change="setSetting('premium', $event.target.checked)"
        >
        <span>
          <strong>I have Neopets Premium</strong>
          <em>Shows the Super Shop Wizard, which only answers for Premium accounts.</em>
        </span>
      </label>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.hoverOnly"
          @change="setSetting('hoverOnly', $event.target.checked)"
        >
        <span>
          <strong>Only show badges on hover</strong>
          <em>Keeps the 🔍 out of the way until you go looking for it.</em>
        </span>
      </label>
    </section>

    <section class="ns-set-block">
      <h4 class="ns-set-title">Backup</h4>
      <p class="ns-set-hint">
        Your settings, favourites and favourited dailies. Cached prices are left out — they come
        back on their own.
      </p>

      <div class="ns-set-actions">
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiUpload" @click="exportSettings">Export</v-btn>
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiContentCopy" @click="copyExport">Copy</v-btn>
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiDownload" @click="downloadExport">Save file</v-btn>
        <v-spacer />
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiFileUpload" @click="fileInput.click()">
          Load file
        </v-btn>
        <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="pickFile">
      </div>

      <textarea
        v-model="state.io.text"
        class="ns-set-box"
        spellcheck="false"
        placeholder="Export puts your settings here. To restore, paste an export and press Import."
      />

      <div class="ns-set-actions">
        <v-btn size="x-small" variant="flat" color="primary" :disabled="!state.io.text"
               @click="importSettings(state.io.text)">Import</v-btn>
        <v-spacer />
        <span v-if="state.io.message" class="ns-set-msg" :class="{ 'ns-set-msg--bad': state.io.status === 'error' }">
          {{ state.io.message }}
        </span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ns-settings { padding: 10px 12px 12px; }
.ns-set-block { margin-bottom: 14px; }
.ns-set-title { font-size: 11.5px; margin: 0 0 3px; }
.ns-set-hint { font-size: 10.5px; opacity: .6; margin: 0 0 7px; }

.ns-set-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 9px; cursor: pointer; }
.ns-set-row input { margin: 1px 0 0; width: 13px; height: 13px; flex: 0 0 auto; cursor: pointer; }
.ns-set-row strong { display: block; font-size: 11.5px; font-weight: 600; }
.ns-set-row em { display: block; font-size: 10px; opacity: .6; font-style: normal; margin-top: 1px; }

.ns-set-actions { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; margin: 6px 0; }
.ns-set-box {
  width: 100%; height: 120px; resize: vertical; box-sizing: border-box;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; line-height: 1.35;
  padding: 6px; border: 1px solid rgba(0, 0, 0, .2); border-radius: 4px;
  background: #fff; color: inherit;
}
.ns-set-msg { font-size: 10px; opacity: .7; text-align: right; }
.ns-set-msg--bad { color: #c62828; opacity: 1; }
</style>
