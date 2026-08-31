<script setup>
import { computed } from 'vue';
import { mdiRefresh } from '@mdi/js';
import { state, retry, close } from './store.js';
import PriceCard from './PriceCard.vue';
import HistoryTabs from './HistoryTabs.vue';

defineProps({ attach: { type: [Object, String, Boolean], default: false } });

const open = computed({
  get: () => state.open,
  set: (v) => { if (!v) close(); },
});
</script>

<template>
  <div>
    <v-menu
      v-model="open"
      :target="state.anchor"
      :attach="attach"
      :close-on-content-click="false"
      location="bottom end"
      offset="6"
      max-width="340"
      :min-width="0"
    >
      <v-card class="ns-popover" elevation="8" width="340">
        <v-card-text class="ns-body">
          <div v-if="state.loading" class="ns-center">
            <v-progress-circular indeterminate size="28" width="3" />
            <div class="ns-loading-label">
              {{ state.refreshing ? 'Refreshing' : 'Looking up' }} {{ state.item?.name }}…
            </div>
          </div>

          <v-alert v-else-if="state.error" type="warning" variant="tonal" density="compact">
            <div>{{ state.error.text }}</div>
            <div v-if="state.error.detail" class="ns-detail">{{ state.error.detail }}</div>
          </v-alert>

          <PriceCard v-else-if="state.data" :data="state.data" />
        </v-card-text>

        <HistoryTabs v-if="state.data && !state.loading" :data="state.data" />
        <!-- The title links to Jelly Neo and the heart sits beside it, so the
             only action left here is retrying a failure. -->
        <v-card-actions v-if="state.error && !state.loading" class="ns-actions">
          <v-btn size="small" variant="text" :prepend-icon="mdiRefresh" @click="retry">Retry</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<style scoped>
.ns-body { padding: 12px 14px 4px; }
.ns-center { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px 0; }
.ns-loading-label { font-size: 12px; opacity: .7; text-align: center; }
.ns-detail { font-size: 11px; opacity: .75; margin-top: 4px; word-break: break-word; }
.ns-actions { padding: 0 8px 6px; min-height: 0; }

</style>
