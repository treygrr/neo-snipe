<script setup>
import { computed } from 'vue';
import { mdiRefresh } from '@mdi/js';
import { searchesFor } from '../lib/neopets-search.js';
import { state, retry, close, openShops } from './store.js';
import PriceCard from './PriceCard.vue';
import HistoryTabs from './HistoryTabs.vue';

defineProps({ attach: { type: [Object, String, Boolean], default: false } });

const searches = computed(() => (state.data?.name ? searchesFor(state.data.name) : []));

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

        <!-- Where to buy it, at the bottom of the card. -->
        <div v-if="searches.length" class="ns-search">
          <a
            v-for="s in searches"
            :key="s.id"
            :href="s.href"
            target="_blank"
            rel="noopener"
            class="ns-search-btn"
            :title="s.title"
          >{{ s.label }}</a>

          <!-- Not a link: the SSW is a JSON endpoint, so this opens a popover
               with the results rather than navigating anywhere. -->
          <button
            v-if="state.settings.premium"
            type="button"
            class="ns-search-btn ns-search-btn--ssw"
            :class="{ 'ns-search-btn--on': state.shops.open }"
            title="Search the Super Shop Wizard and show the results here"
            @click="openShops($event.currentTarget)"
          >Super Wiz</button>
        </div>

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

.ns-search {
  display: flex; gap: 5px; flex-wrap: wrap;
  padding: 7px 12px 9px; border-top: 1px solid rgba(0, 0, 0, .12);
}
.ns-search-btn {
  flex: 1 1 auto; text-align: center; padding: 4px 8px;
  font-size: 10.5px; font-weight: 600; text-decoration: none;
  color: #14459c; background: #eef3fe; border: 1px solid #cddcfb; border-radius: 5px;
  white-space: nowrap;
}
.ns-search-btn:hover { background: #dfe9fd; border-color: #a9c3f7; }
.ns-search-btn--ssw {
  color: #7a4c04; background: #fff5dd; border-color: #f0d79a;
  font: inherit; font-size: 10.5px; font-weight: 600; cursor: pointer;
}
.ns-search-btn--ssw:hover { background: #ffeec4; border-color: #e5c273; }
.ns-search-btn--on { background: #f7b731; border-color: #d2870f; color: #4a2d02; }
</style>
