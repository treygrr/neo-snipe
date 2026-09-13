<script setup>
import { computed, onMounted } from 'vue';
import {
  mdiCheckCircle, mdiOpenInNew, mdiRefresh, mdiFish, mdiFerrisWheel, mdiStar,
  mdiBookOpenPageVariant, mdiFoodApple, mdiTeddyBear, mdiBrush, mdiStorefront, mdiTshirtCrew,
} from '@mdi/js';
import { state, loadQuests, claimQuest, claimBonus, runQuest, isQuestBusy } from './store.js';
import { formatCountdown } from '../lib/daily-visits.js';
import { QUESTLOG_URL } from '../lib/questlog.js';
import { USES } from '../lib/item-use.js';

// Read fresh each time the view opens: the list changes as you play, and a
// quest done in another tab is only claimable once Neopets says so.
onMounted(() => { loadQuests(); });

const slot = computed(() => state.quests);
const quests = computed(() => slot.value.list ?? []);

const expiresIn = computed(() => {
  if (!slot.value.expiresAt) return '';
  return formatCountdown(Math.max(0, slot.value.expiresAt - state.now));
});

// What each runner's button says and shows. One runner covers all four item
// quests, so it takes its words from the quest.
const USE_ICONS = { read: mdiBookOpenPageVariant, feed: mdiFoodApple, play: mdiTeddyBear, groom: mdiBrush };
const RUNNERS = {
  fishing: () => ({ label: 'Fish', icon: mdiFish, title: 'Reel in your line at Ye Olde Fishing Vortex' }),
  wheel: (q) => ({
    label: 'Spin',
    icon: mdiFerrisWheel,
    title: `Spin the Wheel of ${q.wheel?.name} for you — the wheel charges its usual NP`,
  }),
  use: (q) => ({
    label: USES[q.kind].label,
    icon: USE_ICONS[q.kind],
    title: `Use your least valuable ${USES[q.kind].noun} on your active pet — it may be used up`,
  }),
  visit: () => ({
    label: 'Visit',
    icon: mdiOpenInNew,
    title: "Load the NC Mall's popular items page for you — nothing is bought",
  }),
  shop: () => ({
    label: 'Shop',
    icon: mdiStorefront,
    title: 'Open a random shop with stock and mark its cheapest item — you click to buy it',
  }),
  customise: () => ({
    label: 'Customise',
    icon: mdiTshirtCrew,
    title: 'Add a random wearable to your active pet, save, then put their outfit back as it was',
  }),
};
const runner = (quest) => RUNNERS[quest.runner](quest);

const progress = (quest) => quest.tasks
  .filter((t) => t.need)
  .map((t) => `${t.have}/${t.need}`)
  .join(' · ');

// Nothing is loaded and nothing is wrong: the first read is still on its way.
const firstLoad = computed(() => slot.value.loading && !slot.value.list);
</script>

<template>
  <div class="ns-quests">
    <header class="ns-quests-bar">
      <div class="ns-quests-bar-text">
        <span v-if="slot.bonus && slot.bonus.total" class="ns-quests-bonus"
              :title="'Finish every quest but the Premium one for the daily bonus'">
          Bonus {{ slot.bonus.done }}/{{ slot.bonus.total }}
        </span>
        <span v-if="expiresIn" class="ns-quests-expiry">resets in {{ expiresIn }}</span>
      </div>
      <v-btn
        v-if="slot.bonus?.claimId"
        class="ns-quests-bonus-claim"
        size="small"
        variant="flat"
        color="green"
        rounded="lg"
        :loading="slot.busy === 'bonus'"
        :disabled="!!slot.busy && slot.busy !== 'bonus'"
        :title="`Claim the daily bonus${slot.bonus.reward ? ` — ${slot.bonus.reward}` : ''}`"
        @click="claimBonus"
      >Claim {{ slot.bonus.reward || 'bonus' }}</v-btn>
      <a :href="QUESTLOG_URL" target="_blank" rel="noopener" class="ns-quests-open">Quest Log</a>
      <v-btn
        :icon="mdiRefresh"
        size="x-small"
        variant="text"
        class="ns-quests-refresh"
        :loading="slot.loading"
        aria-label="Refresh quests"
        title="Refresh quests"
        @click="loadQuests"
      />
    </header>

    <div v-if="firstLoad" class="ns-quests-state">
      <v-progress-circular indeterminate size="20" width="2" color="primary" />
      <span>Reading your Quest Log…</span>
    </div>

    <v-alert
      v-else-if="slot.error"
      class="ns-quests-error"
      type="warning"
      variant="tonal"
      density="compact"
      rounded="lg"
    >
      {{ slot.error }}
      <template #append>
        <v-btn size="x-small" variant="text" @click="loadQuests">Retry</v-btn>
      </template>
    </v-alert>

    <p v-else-if="slot.list && !quests.length" class="ns-quests-empty">
      Every quest is done and claimed. New ones arrive when the Quest Log resets.
    </p>

    <div
      v-for="quest in quests"
      :key="quest.id"
      class="ns-quest"
      :class="{ 'ns-quest--done': quest.complete, 'ns-quest--busy': isQuestBusy(quest) }"
    >
      <div class="ns-quest-reward" :title="quest.reward.label">
        <img v-if="quest.reward.image" :src="quest.reward.image" alt="" class="ns-quest-reward-img">
        <span v-else class="ns-quest-reward-np">NP</span>
      </div>

      <div class="ns-quest-text">
        <div class="ns-quest-title">
          <v-icon v-if="quest.complete" :icon="mdiCheckCircle" size="13" color="green" class="ns-quest-tick" />
          {{ quest.title }}
          <v-icon v-if="quest.premium" :icon="mdiStar" size="12" class="ns-quest-premium"
                  title="Premium quest" />
        </div>
        <div class="ns-quest-desc" :title="quest.description">{{ quest.description }}</div>
        <div class="ns-quest-meta">
          <span class="ns-quest-prize">{{ quest.reward.label }}</span>
          <span v-if="progress(quest)" class="ns-quest-progress">{{ progress(quest) }}</span>
        </div>
      </div>

      <div class="ns-quest-actions">
        <v-btn
          v-if="quest.claimable"
          class="ns-quest-claim"
          size="small"
          variant="flat"
          color="green"
          rounded="lg"
          :loading="isQuestBusy(quest)"
          :disabled="!!slot.busy && !isQuestBusy(quest)"
          @click="claimQuest(quest)"
        >Claim</v-btn>

        <v-btn
          v-else-if="quest.runner"
          class="ns-quest-run"
          size="small"
          variant="tonal"
          color="primary"
          rounded="lg"
          :prepend-icon="runner(quest).icon"
          :title="runner(quest).title"
          :loading="isQuestBusy(quest)"
          :disabled="!!slot.busy && !isQuestBusy(quest)"
          @click="runQuest(quest)"
        >{{ runner(quest).label }}</v-btn>

        <v-btn
          :href="quest.link"
          target="_blank"
          rel="noopener"
          :icon="mdiOpenInNew"
          size="x-small"
          variant="text"
          class="ns-quest-link"
          :aria-label="`Go to ${quest.title}`"
          :title="`Go and do it yourself`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ns-quests { display: flex; flex-direction: column; }

.ns-quests-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 6px 6px 12px; font-size: 11px;
  border-bottom: 1px solid rgba(0, 0, 0, .06);
}
.ns-quests-bar-text { flex: 1 1 auto; display: flex; gap: 10px; min-width: 0; }
.ns-quests-bonus { font-weight: 600; opacity: .8; font-variant-numeric: tabular-nums; }
.ns-quests-expiry { opacity: .55; font-variant-numeric: tabular-nums; }
.ns-quests-open { color: rgb(var(--v-theme-primary)); text-decoration: none; font-weight: 600; }
.ns-quests-open:hover { text-decoration: underline; }

.ns-quests-state {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 48px 0; font-size: 12px; color: rgba(0, 0, 0, .7);
}
.ns-quests-error { margin: 12px; font-size: 12px; }
.ns-quests-empty { margin: 0; padding: 32px 24px; text-align: center; font-size: 12px; color: rgba(0, 0, 0, .58); }

.ns-quest {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 8px 8px 12px; border-bottom: 1px solid rgba(0, 0, 0, .06);
}
.ns-quest:hover { background: rgba(0, 0, 0, .025); }
.ns-quest--busy { background: rgba(31, 111, 235, .05); }

.ns-quest-reward {
  flex: 0 0 auto; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px; background: #f6f7f9;
}
.ns-quest-reward-img { width: 32px; height: 32px; object-fit: contain; }
.ns-quest-reward-np { font-size: 10px; font-weight: 700; color: #b7791f; }

.ns-quest-text { flex: 1 1 auto; min-width: 0; }
.ns-quest-title { display: flex; align-items: center; gap: 4px; font-size: 12.5px; font-weight: 600; line-height: 1.3; }
.ns-quest-premium { opacity: .55; color: #b7791f; }
.ns-quest-desc {
  font-size: 11px; line-height: 1.35; color: rgba(0, 0, 0, .6);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ns-quest-meta { display: flex; gap: 8px; font-size: 10.5px; line-height: 1.35; color: rgba(0, 0, 0, .5); }
.ns-quest-prize { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ns-quest-progress { flex: 0 0 auto; font-variant-numeric: tabular-nums; }

.ns-quest-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 2px; }
.ns-quest-claim, .ns-quest-run { text-transform: none; letter-spacing: 0; min-width: 64px; }
.ns-quest-link { opacity: .45; }
.ns-quest:hover .ns-quest-link, .ns-quest-link:focus-visible { opacity: .85; }
</style>
