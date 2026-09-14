<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  mdiContentCopy, mdiDownload, mdiUpload, mdiFileUpload, mdiRestore, mdiMinus, mdiPlus,
} from '@mdi/js';
import {
  state, setSetting, exportSettings, importSettings, isPremium,
  resetPanelPosition, resetLauncherPosition, resetPopoverTabOrder, resetLauncherOrder,
} from './store.js';
import { api } from '../lib/ext-api.js';
import { nextPoolOpening, cleanPoolTimes } from '../lib/magma.js';
import { formatCountdown } from '../lib/daily-visits.js';
import { ICON_STEPS, DEFAULT_ICON_STEP, cleanIconStep, iconPx } from '../lib/launcher-size.js';

// --- icon size ---------------------------------------------------------------
// One control, for whichever way up the bar is: each orientation keeps its own
// size, so the one you are looking at is the one that changes.
const iconOrientation = computed(() => (state.settings.verticalLauncher ? 'vertical' : 'horizontal'));
const iconKey = computed(() => (iconOrientation.value === 'vertical' ? 'verticalIconStep' : 'launcherIconStep'));
const iconStep = computed(() => cleanIconStep(
  state.settings[iconKey.value],
  DEFAULT_ICON_STEP[iconOrientation.value],
));
function stepIcons(by) {
  const next = Math.min(ICON_STEPS, Math.max(1, iconStep.value + by));
  if (next !== iconStep.value) setSetting(iconKey.value, next);
}

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
      <h4 class="ns-set-title">App settings</h4>
      <p class="ns-set-hint">What neo-snipe shows you, and on which pages.</p>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.premiumAuto"
          @change="setSetting('premiumAuto', $event.target.checked)"
        >
        <span>
          <strong>Detect Premium</strong>
          <em>
            Reads whether this account has Neopets Premium from the site's navigation on each page,
            so the Super Shop Wizard and the premium-only dailies appear only when you can use them.
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
          <strong>I have Premium</strong>
          <em v-if="state.settings.premiumAuto">Turn off Detect Premium to set this yourself.</em>
          <em v-else>
            Shows the Super Shop Wizard button and popover tab, and the premium-only dailies. Off
            hides them all.
          </em>
        </span>
      </label>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.hoverOnly"
          @change="setSetting('hoverOnly', $event.target.checked)"
        >
        <span>
          <strong>Hover badges</strong>
          <em>
            Keeps the 🔍 badge on each item hidden until your pointer is over the item. Off shows
            every badge all the time, which is easier on a touch screen.
          </em>
        </span>
      </label>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.trackDailyVisits"
          @change="setSetting('trackDailyVisits', $event.target.checked)"
        >
        <span>
          <strong>Track dailies</strong>
          <em>
            Ticks a daily off in the Dailies panel when you visit its page, however you got there.
            Each clears on its own schedule: most at midnight Neopets time, Coltzan's thirteen hours
            after you go, the Snowager when its next window opens, the freebies on the first of the
            month. Places with no cooldown, like the stock market, are never ticked.
          </em>
        </span>
      </label>

      <label class="ns-set-row ns-set-row--field">
        <span>
          <strong>Buy margin (NP)</strong>
          <input
            class="ns-set-num"
            inputmode="numeric"
            :value="state.settings.minMargin"
            @input="setSetting('minMargin', Math.max(0, Number($event.target.value.replace(/[^\d]/g, '')) || 0))"
          >
          <em>
            In a shop, the price popover turns its margin line green when Jelly Neo's estimate is
            above the asking price by at least this much. It compares against an estimate, so green
            means the spread clears your bar, not that the item will sell for it.
          </em>
        </span>
      </label>
    </section>

    <section class="ns-set-block">
      <h4 class="ns-set-title">Layout</h4>
      <p class="ns-set-hint">
        Always on: drag any bar button to reorder the bar, drag this panel by its title bar, and
        drag an item popover's tabs to reorder them. Positions are remembered on this device only,
        since a spot that suits one screen is off the edge of another. The bar's button order and
        the popover's tab order ride with your other settings, so they follow you.
      </p>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.verticalLauncher"
          @change="setSetting('verticalLauncher', $event.target.checked)"
        >
        <span>
          <strong>Vertical mode</strong>
          <em>
            Stands the bar up as a column of bigger buttons, docked flush against the left or right
            edge of the window — whichever you drag it nearer. It starts tucked away behind its
            arrow and stays that way until you press it. Panels still open in the same place.
          </em>
        </span>
      </label>

      <div class="ns-set-size">
        <span class="ns-set-size-title">
          {{ state.settings.verticalLauncher ? 'Vertical bar icon size' : 'Bar icon size' }}
        </span>
        <div class="ns-set-size-controls">
          <v-btn
            :icon="mdiMinus"
            size="x-small"
            variant="tonal"
            class="ns-set-size-down"
            :disabled="iconStep <= 1"
            aria-label="Smaller bar icons"
            title="Smaller bar icons"
            @click="stepIcons(-1)"
          />
          <span class="ns-set-size-value" aria-live="polite">{{ iconPx(iconStep) }}px</span>
          <v-btn
            :icon="mdiPlus"
            size="x-small"
            variant="tonal"
            class="ns-set-size-up"
            :disabled="iconStep >= ICON_STEPS"
            aria-label="Bigger bar icons"
            title="Bigger bar icons"
            @click="stepIcons(1)"
          />
        </div>
        <em>
          The bar's icons, from 20px to 36px in 4px steps. The horizontal and vertical bars each
          keep their own size, so this changes the one you are using now.
        </em>
      </div>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.movableLauncher"
          @change="setSetting('movableLauncher', $event.target.checked)"
        >
        <span>
          <strong>Move bar</strong>
          <em>
            Adds a handle to the bar so you can drag it anywhere on the page. Off puts it back in
            the bottom-right corner (or halfway down the right edge in vertical mode) without
            forgetting where you had it. Its buttons work either way.
          </em>
        </span>
      </label>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.rememberPopoverTab"
          @change="setSetting('rememberPopoverTab', $event.target.checked)"
        >
        <span>
          <strong>Remember tab</strong>
          <em>
            Opens every item's popover on the tab you were last on. Off always opens the first tab
            in the order. A remembered tab that has since been hidden falls back to the first.
          </em>
        </span>
      </label>

      <div class="ns-set-actions">
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiRestore"
               :disabled="!state.panelPos" @click="resetPanelPosition">Reset panel</v-btn>
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiRestore"
               @click="resetLauncherPosition">Reset bar</v-btn>
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiRestore"
               title="Put the bar's buttons back in their original order"
               @click="resetLauncherOrder">Reset bar order</v-btn>
        <v-btn size="x-small" variant="tonal" :prepend-icon="mdiRestore"
               title="Reset the price popover's tab order"
               @click="resetPopoverTabOrder">Reset tabs</v-btn>
      </div>
    </section>

    <section class="ns-set-block">
      <h4 class="ns-set-title">Cache settings</h4>
      <p class="ns-set-hint">
        How long a wizard search is reused before another is spent on the same item. Both wizards
        are rate-limited by Neopets.
      </p>

      <label class="ns-set-row ns-set-row--field">
        <span>
          <strong>Shop Wizard cache (minutes)</strong>
          <input
            class="ns-set-num"
            inputmode="numeric"
            :value="state.settings.wizCacheMinutes"
            @input="setSetting('wizCacheMinutes', minutes($event))"
          >
          <em>
            Minutes the Shop Wizard tab shows a saved result before searching the same item again.
            Keep this high unless fresh prices matter more than your search limit. 0 searches every
            time you open the tab.
          </em>
        </span>
      </label>

      <label class="ns-set-row ns-set-row--field">
        <span>
          <strong>Super Shop Wizard cache (minutes)</strong>
          <input
            class="ns-set-num"
            inputmode="numeric"
            :value="state.settings.sswCacheMinutes"
            @input="setSetting('sswCacheMinutes', minutes($event))"
          >
          <em>
            The same for the SSW tab. It returns every shop at once, so its results go stale
            faster — a lower number suits it. 0 searches every time.
          </em>
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
          <strong>Find pool time</strong>
          <em>
            Loads the Magma Pool every 10 minutes while a Neopets page is open until it catches the
            guard away, and records that time. Adds a volcano button to the bar that turns into a
            checkmark once your time is found.
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
      <h4 class="ns-set-title">Backup</h4>
      <p class="ns-set-hint">
        Your settings, favourites, favourited dailies and Magma Pool times, to copy to another
        browser or keep safe.
      </p>

      <label class="ns-set-row">
        <input
          type="checkbox"
          :checked="state.settings.exportIncludeCache"
          @change="setSetting('exportIncludeCache', $event.target.checked)"
        >
        <span>
          <strong>Export cache</strong>
          <em>
            Adds the Jelly Neo prices and trading post histories looked up in the last day, so
            another browser starts with them instead of looking them up again. The file gets much
            bigger. Press Export again after changing this.
          </em>
        </span>
      </label>

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
.ns-set-block + .ns-set-block { padding-top: 10px; border-top: 1px solid rgba(0, 0, 0, .08); }
.ns-set-title { font-size: 11.5px; margin: 0 0 3px; }
.ns-set-hint { font-size: 10.5px; opacity: .6; margin: 0 0 7px; }

/* Every setting reads top to bottom: its title, the control under it, then what
   it does. The span holding title and description steps out of the way
   (display: contents), so `order` can put the control between them whichever
   side of the span it sits in the markup. */
.ns-set-row {
  display: flex; flex-direction: column; align-items: flex-start;
  margin-bottom: 11px; cursor: pointer;
}
.ns-set-row > span { display: contents; }
.ns-set-row strong { order: 0; display: block; font-size: 11.5px; font-weight: 600; }
.ns-set-row input { order: 1; margin: 4px 0 3px; flex: 0 0 auto; cursor: pointer; }
.ns-set-row em { order: 2; display: block; font-size: 10px; opacity: .6; font-style: normal; }

/* Checkboxes drawn as small switches, which sit better on a line of their own. */
.ns-set-row input[type="checkbox"] {
  appearance: none; -webkit-appearance: none; position: relative;
  width: 30px; height: 16px; border-radius: 8px;
  background: rgba(0, 0, 0, .25); transition: background .15s ease;
}
.ns-set-row input[type="checkbox"]::before {
  content: ''; position: absolute; top: 2px; left: 2px;
  width: 12px; height: 12px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, .3); transition: transform .15s ease;
}
.ns-set-row input[type="checkbox"]:checked { background: #1f6feb; }
.ns-set-row input[type="checkbox"]:checked::before { transform: translateX(14px); }
.ns-set-row input[type="checkbox"]:focus-visible { outline: 2px solid #1f6feb; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .ns-set-row input[type="checkbox"], .ns-set-row input[type="checkbox"]::before { transition: none; }
}

/* A number field: text, not a switch. */
.ns-set-row--field { cursor: default; }
.ns-set-row--field input.ns-set-num {
  width: 96px; height: auto; cursor: text;
  font: inherit; font-size: 11px; text-align: left;
  padding: 3px 6px; border: 1px solid rgba(0, 0, 0, .25); border-radius: 4px;
}
/* Shown but not editable while detection is doing the deciding. */
.ns-set-row--off { opacity: .55; cursor: default; }

/* The icon size stepper: laid out like a setting row, with −, the size and +. */
.ns-set-size { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 11px; }
.ns-set-size-title { display: block; font-size: 11.5px; font-weight: 600; }
.ns-set-size-controls { display: flex; align-items: center; gap: 6px; margin: 4px 0 3px; }
.ns-set-size-value { min-width: 34px; text-align: center; font-size: 11px; font-variant-numeric: tabular-nums; }
.ns-set-size em { display: block; font-size: 10px; opacity: .6; font-style: normal; }
.ns-set-row--off input { cursor: not-allowed; }

.ns-pool-status { font-size: 10.5px; margin: -2px 0 6px; opacity: .7; }
.ns-pool-list { border: 1px solid rgba(0, 0, 0, .1); border-radius: 6px; overflow: hidden; }
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
