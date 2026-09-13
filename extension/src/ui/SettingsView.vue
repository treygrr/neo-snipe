<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { mdiContentCopy, mdiDownload, mdiUpload, mdiFileUpload, mdiRestore } from '@mdi/js';
import {
  state, setSetting, exportSettings, importSettings, isPremium,
  resetPanelPosition, resetLauncherPosition, resetTabOrder,
} from './store.js';
import { api } from '../lib/ext-api.js';
import { nextPoolOpening, cleanPoolTimes } from '../lib/magma.js';
import { formatCountdown } from '../lib/daily-visits.js';

const detectedText = computed(() => {
  if (state.premiumDetected === null) return 'Not checked yet — open a Neopets page.';
  return state.premiumDetected ? 'Detected: you have Premium.' : 'Detected: no Premium on this account.';
});

const fileInput = ref(null);

// A day is already far longer than either wizard's results stay useful, and it
// keeps a stray keystroke from parking a cache somewhere unreachable.
const MAX_CACHE_MINUTES = 1440;
const minutes = (event) => Math.min(
  MAX_CACHE_MINUTES,
  Math.max(0, Number(event.target.value.replace(/[^\d]/g, '')) || 0),
);

// --- Magma Pool ------------------------------------------------------------
// The account the checker last saw logged in, which it keeps in local storage.
// Watched rather than read once, so a time found while this view is open shows.
const MAGMA_ACCOUNT = 'magmaAccount';
const poolAccount = ref(null);

async function readPoolAccount() {
  const { [MAGMA_ACCOUNT]: cached } = await api.storage.local.get(MAGMA_ACCOUNT).catch(() => ({}));
  poolAccount.value = cached?.name ?? null;
}

function onStorageChange(changes) {
  if (MAGMA_ACCOUNT in changes) readPoolAccount();
  if ('magmaPoolTimes' in changes) state.settings.magmaPoolTimes = changes.magmaPoolTimes.newValue ?? {};
}

onMounted(() => {
  readPoolAccount();
  api.storage.onChanged.addListener(onStorageChange);
});
onBeforeUnmount(() => api.storage.onChanged.removeListener(onStorageChange));

const poolRows = computed(() => Object.entries(cleanPoolTimes(state.settings.magmaPoolTimes))
  .map(([account, time]) => ({
    account,
    time,
    current: account === poolAccount.value,
    opensIn: formatCountdown(nextPoolOpening(time, state.now) - state.now),
  }))
  // This account first, then the rest by name.
  .sort((a, b) => Number(b.current) - Number(a.current) || a.account.localeCompare(b.account)));

const poolStatus = computed(() => {
  const account = poolAccount.value;
  const times = cleanPoolTimes(state.settings.magmaPoolTimes);
  if (account && times[account]) return null;
  if (!state.settings.magmaPoolCheck) return 'Switched off. Any times already found are kept, and exported with your settings.';
  if (!account) return 'Open a Neopets page while logged in to start checking.';
  return `Looking for ${account}'s time: the pool is checked every 10 minutes while Neopets is open.`;
});

// A new object, never an edit in place: the default map is shared.
function forgetPoolTime(account) {
  const kept = { ...cleanPoolTimes(state.settings.magmaPoolTimes) };
  delete kept[account];
  setSetting('magmaPoolTimes', kept);
}

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
          :checked="state.settings.premiumAuto"
          @change="setSetting('premiumAuto', $event.target.checked)"
        >
        <span>
          <strong>Detect Neopets Premium automatically</strong>
          <em>
            Reads it from the site navigation.
            <template v-if="state.settings.premiumAuto">{{ detectedText }}</template>
          </em>
        </span>
      </label>

      <label class="ns-set-row" :class="{ 'ns-set-row--off': state.settings.premiumAuto }">
        <input
          type="checkbox"
          :checked="isPremium()"
          :disabled="state.settings.premiumAuto"
          @change="setSetting('premium', $event.target.checked)"
        >
        <span>
          <strong>I have Neopets Premium</strong>
          <em v-if="state.settings.premiumAuto">Turn detection off to set this yourself.</em>
          <em v-else>Shows the Super Shop Wizard and premium dailies.</em>
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

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.trackDailyVisits"
          @change="setSetting('trackDailyVisits', $event.target.checked)"
        >
        <span>
          <strong>Tick off dailies as you visit them</strong>
          <em>
            Each one clears on its own schedule: most at midnight Neopets time, but Coltzan's
            thirteen hours after you go, the Snowager when its next window opens, the freebies
            on the first of the month. Places with no cooldown at all, like the stock market,
            are not ticked.
          </em>
        </span>
      </label>

      <label class="ns-set-row ns-set-row--field">
        <input
          class="ns-set-num"
          inputmode="numeric"
          :value="state.settings.minMargin"
          @input="setSetting('minMargin', Math.max(0, Number($event.target.value.replace(/[^\d]/g, '')) || 0))"
        >
        <span>
          <strong>Worth-buying margin</strong>
          <em>
            In a shop, the popover marks an item green when Jelly Neo's estimate beats the asking
            price by this much.
          </em>
        </span>
      </label>

      <label class="ns-set-row ns-set-row--field">
        <input
          class="ns-set-num"
          inputmode="numeric"
          :value="state.settings.wizCacheMinutes"
          @input="setSetting('wizCacheMinutes', minutes($event))"
        >
        <span>
          <strong>Shop Wizard cache (minutes)</strong>
          <em>
            How long the Shop Wizard tab reuses a result before spending another search on the
            same item. Searches are rate-limited, so keep this high unless prices matter more.
            Zero searches every time you open the tab.
          </em>
        </span>
      </label>

      <label class="ns-set-row ns-set-row--field">
        <input
          class="ns-set-num"
          inputmode="numeric"
          :value="state.settings.sswCacheMinutes"
          @input="setSetting('sswCacheMinutes', minutes($event))"
        >
        <span>
          <strong>Super Shop Wizard cache (minutes)</strong>
          <em>The same, for the SSW tab. It returns a whole shop list at once, so it goes stale faster.</em>
        </span>
      </label>
    </section>

    <section class="ns-set-block ns-pool">
      <h4 class="ns-set-title">Magma Pool</h4>
      <p class="ns-set-hint">
        Each account's guard naps for ten minutes at the same Neopets time every day. Once found,
        the time is kept for that account.
      </p>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.magmaPoolCheck"
          @change="setSetting('magmaPoolCheck', $event.target.checked)"
        >
        <span>
          <strong>Find my Magma Pool time</strong>
          <em>
            Checks the pool every 10 minutes while a Neopets page is open, and adds a volcano
            button to the bar that turns into a checkmark once your time is found.
          </em>
        </span>
      </label>

      <p v-if="poolStatus" class="ns-pool-status">{{ poolStatus }}</p>

      <div v-if="poolRows.length" class="ns-pool-list">
        <div
          v-for="row in poolRows"
          :key="row.account"
          class="ns-pool-row"
          :class="{ 'ns-pool-row--current': row.current }"
        >
          <span class="ns-pool-account">
            {{ row.account }}<em v-if="row.current"> · this account</em>
          </span>
          <span class="ns-pool-time">{{ row.time }} NST</span>
          <span class="ns-pool-in">opens in {{ row.opensIn }}</span>
          <v-btn size="x-small" variant="text" class="ns-pool-forget" @click="forgetPoolTime(row.account)">
            Forget
          </v-btn>
        </div>
      </div>
    </section>

    <section class="ns-set-block">
      <h4 class="ns-set-title">Layout</h4>
      <p class="ns-set-hint">
        Positions are remembered on this device only, since a spot that suits one screen is off
        the edge of another. Tab order rides with your other settings instead, so it follows you.
      </p>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.movablePanel"
          @change="setSetting('movablePanel', $event.target.checked)"
        >
        <span>
          <strong>Move this panel by dragging its title bar</strong>
          <em>Off puts it back above the neo-snipe button, without forgetting where it was.</em>
        </span>
      </label>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.movableLauncher"
          @change="setSetting('movableLauncher', $event.target.checked)"
        >
        <span>
          <strong>Move the neo-snipe button by dragging it</strong>
          <em>Off returns it to the bottom-right corner. Clicking still opens the panel.</em>
        </span>
      </label>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.rememberPopoverTab"
          @change="setSetting('rememberPopoverTab', $event.target.checked)"
        >
        <span>
          <strong>Reopen an item on the tab you were last on</strong>
          <em>
            Off opens every item on whichever tab comes first in the order. A remembered tab that
            has since been hidden falls back to the first one.
          </em>
        </span>
      </label>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.movableTabs"
          @change="setSetting('movableTabs', $event.target.checked)"
        >
        <span>
          <strong>Drag the tabs to reorder them</strong>
          <em>
            Works in this panel and in an item's price popover. The order is kept for tabs that
            are hidden too, so the SSW tab returns to where you put it.
          </em>
        </span>
      </label>

      <div class="ns-set-actions">
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiRestore"
               :disabled="!state.panelPos" @click="resetPanelPosition">Reset panel</v-btn>
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiRestore"
               @click="resetLauncherPosition">Reset button</v-btn>
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiRestore"
               @click="resetTabOrder">Reset tabs</v-btn>
      </div>
    </section>

    <section class="ns-set-block">
      <h4 class="ns-set-title">Backup</h4>
      <p class="ns-set-hint">
        Your settings, favourites, favourited dailies and Magma Pool times. Cached prices are left
        out — they come back on their own.
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
/* Shown but not editable while detection is doing the deciding. */
/* A number field, not a 13px checkbox, so it overrides the rule above. */
.ns-set-row--field input.ns-set-num {
  width: 64px; height: auto; flex: 0 0 auto; cursor: text;
  font: inherit; font-size: 11px; text-align: right;
  padding: 2px 5px; border: 1px solid rgba(0, 0, 0, .25); border-radius: 4px;
}
.ns-set-row--off { opacity: .55; cursor: default; }
.ns-set-row--off input { cursor: not-allowed; }
.ns-set-row strong { display: block; font-size: 11.5px; font-weight: 600; }
.ns-set-row em { display: block; font-size: 10px; opacity: .6; font-style: normal; margin-top: 1px; }

.ns-pool-status { font-size: 10.5px; margin: -2px 0 6px 21px; opacity: .7; }
.ns-pool-list { margin-left: 21px; border: 1px solid rgba(0, 0, 0, .1); border-radius: 6px; overflow: hidden; }
.ns-pool-row {
  display: grid; grid-template-columns: minmax(0, 1fr) auto auto auto; align-items: center; gap: 10px;
  padding: 3px 4px 3px 9px; font-size: 11px;
}
.ns-pool-row + .ns-pool-row { border-top: 1px solid rgba(0, 0, 0, .07); }
.ns-pool-row--current { background: rgba(194, 65, 12, .06); }
.ns-pool-account { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.ns-pool-account em { font-style: normal; font-weight: 400; opacity: .6; }
.ns-pool-time, .ns-pool-in { font-variant-numeric: tabular-nums; white-space: nowrap; }
.ns-pool-in { opacity: .65; }
.ns-pool-forget { text-transform: none; letter-spacing: 0; }

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
