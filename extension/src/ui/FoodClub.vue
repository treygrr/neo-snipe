<script setup>
import { computed } from 'vue';
import { mdiRefresh, mdiOpenInNew, mdiAlertCircleOutline } from '@mdi/js';
import {
  state, loadFoodClub, setFoodClubLevel, setFoodClubAmount, currentBets, fillBet, placeBet,
  isBetDone, toggleBetDone, RISK_LEVELS, BET_URL, SETS_URL,
} from './store.js';

const bets = computed(() => currentBets());
const levels = computed(() => RISK_LEVELS.filter((l) => state.fc.sets[l.id]));
const np = (n) => (n == null ? '—' : n.toLocaleString('en-US'));
</script>

<template>
  <div class="ns-fc">
    <div v-if="state.fc.loading" class="ns-fc-center">
      <v-progress-circular indeterminate size="24" width="2" />
      <span>Reading this round…</span>
    </div>

    <v-alert
      v-else-if="state.fc.error"
      type="warning"
      variant="tonal"
      density="compact"
      class="ns-fc-error"
      :icon="mdiAlertCircleOutline"
    >
      <div>{{ state.fc.error }}</div>
      <v-btn size="x-small" variant="text" :prepend-icon="mdiRefresh" class="mt-1"
             @click="loadFoodClub({ force: true })">Retry</v-btn>
    </v-alert>

    <template v-else-if="state.fc.arenas.length">
      <div class="ns-fc-bar">
        <label class="ns-fc-amount">
          <span>Bet</span>
          <input
            :value="state.fc.amount"
            inputmode="numeric"
            class="ns-fc-input"
            @input="setFoodClubAmount($event.target.value)"
          >
          <span class="ns-fc-max">of {{ np(state.fc.maxBet) }} max</span>
        </label>
        <v-btn :icon="mdiRefresh" size="x-small" variant="text" title="Reload this round"
               @click="loadFoodClub({ force: true })" />
      </div>

      <div class="ns-fc-levels">
        <button
          v-for="level in levels"
          :key="level.id"
          type="button"
          class="ns-fc-level"
          :class="{ 'ns-fc-level--on': state.fc.level === level.id }"
          :title="level.blurb"
          @click="setFoodClubLevel(level.id)"
        >{{ level.label }}</button>
      </div>

      <p class="ns-fc-blurb">
        {{ RISK_LEVELS.find((l) => l.id === state.fc.level)?.blurb }}
        Sets by <a :href="SETS_URL" target="_blank" rel="noopener">~Shrmsh</a>.
      </p>

      <div
        v-for="(bet, i) in bets"
        :key="i"
        class="ns-bet"
        :class="{ 'ns-bet--broken': !bet.resolved, 'ns-bet--done': isBetDone(bet) }"
      >
        <div class="ns-bet-picks">
          <span v-for="pick in bet.picks" :key="pick.arena" class="ns-pick">
            <span class="ns-pick-arena">{{ pick.arenaName }}</span>
            <span class="ns-pick-name" :class="{ 'ns-pick-name--bad': !pick.pirateId }">{{ pick.pirateName }}</span>
            <span v-if="pick.odds" class="ns-pick-odds">{{ pick.odds }}:1</span>
          </span>
        </div>
        <div class="ns-bet-foot">
          <label class="ns-done" :title="isBetDone(bet) ? 'Mark as not done' : 'Mark as done'">
            <input type="checkbox" :checked="isBetDone(bet)" @change="toggleBetDone(bet)">
            <span>done</span>
          </label>
          <span v-if="bet.resolved" class="ns-bet-odds">
            {{ bet.totalOdds }}:1 · wins {{ np(bet.payout) }} NP
          </span>
          <span v-else class="ns-bet-warn">A pirate here isn't in this round — skip it.</span>
          <v-spacer />
          <template v-if="bet.resolved">
            <v-btn size="x-small" variant="tonal" class="ns-btn-fill" @click="fillBet(bet)">Fill</v-btn>
            <v-btn size="x-small" variant="flat" color="primary" class="ns-btn-place"
                   title="Places this bet, in a new tab" @click="placeBet(bet)">Place</v-btn>
          </template>
        </div>
      </div>

      <p class="ns-fc-note">
        <strong>Fill</strong> opens the <a :href="BET_URL" target="_blank" rel="noopener">bet page</a>
        with the form filled in, for you to check and submit.
        <strong>Place</strong> places the bet outright. Both open a new tab and mark the bet done;
        you can tick or untick that yourself. Marks clear when a new round opens.
      </p>
    </template>
  </div>
</template>

<style scoped>
.ns-fc { padding-bottom: 8px; }
.ns-fc-center { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px 0; font-size: 11px; opacity: .7; }
.ns-fc-error { margin: 8px; font-size: 11px; }

.ns-fc-bar { display: flex; align-items: center; gap: 6px; padding: 6px 6px 4px 12px; }
.ns-fc-amount { display: flex; align-items: baseline; gap: 5px; font-size: 11px; flex: 1 1 auto; }
.ns-fc-input {
  width: 70px; font: inherit; font-size: 11.5px; padding: 2px 5px;
  border: 1px solid rgba(0,0,0,.25); border-radius: 4px; background: #fff; color: inherit;
}
.ns-fc-max { opacity: .55; font-size: 10px; }

.ns-fc-levels { display: flex; gap: 4px; padding: 2px 12px 0; flex-wrap: wrap; }
.ns-fc-level {
  font: inherit; font-size: 10.5px; padding: 2px 8px; cursor: pointer;
  border: 1px solid rgba(0,0,0,.18); border-radius: 10px; background: none; color: inherit; opacity: .75;
}
.ns-fc-level--on { background: #1f6feb; border-color: #1f6feb; color: #fff; opacity: 1; font-weight: 600; }
.ns-fc-blurb { font-size: 10px; opacity: .6; padding: 6px 12px 2px; margin: 0; }
.ns-fc-blurb a, .ns-fc-note a { color: inherit; }

.ns-bet { padding: 6px 12px; border-top: 1px solid rgba(0,0,0,.07); }
.ns-bet--broken { opacity: .6; }
.ns-bet--done { opacity: .45; }
.ns-bet--done .ns-pick-name { text-decoration: line-through; }

.ns-done {
  display: flex; align-items: center; gap: 3px; cursor: pointer;
  font-size: 9.5px; opacity: .6; text-transform: uppercase; letter-spacing: .02em;
}
.ns-done input { margin: 0; width: 12px; height: 12px; cursor: pointer; }
.ns-bet--done .ns-done { opacity: .9; }
.ns-btn-place { font-weight: 600; }
.ns-bet-picks { display: flex; flex-direction: column; gap: 1px; }
.ns-pick { display: flex; gap: 5px; font-size: 11px; align-items: baseline; }
.ns-pick-arena { flex: 0 0 78px; opacity: .5; font-size: 9.5px; text-transform: uppercase; letter-spacing: .02em; }
.ns-pick-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ns-pick-name--bad { color: #c62828; text-decoration: line-through; }
.ns-pick-odds { opacity: .55; font-size: 10px; font-variant-numeric: tabular-nums; }
.ns-bet-foot { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.ns-bet-odds { font-size: 10.5px; font-weight: 600; opacity: .8; }
.ns-bet-warn { font-size: 10px; color: #c62828; }
.ns-fc-note { font-size: 10px; opacity: .55; padding: 8px 12px 0; margin: 0; }
</style>
