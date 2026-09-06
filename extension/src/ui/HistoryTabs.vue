<script setup>
import { computed } from 'vue';
import { mdiRefresh } from '@mdi/js';
import {
  state, selectTab, retryTradingPost, retryWizard, isPremium,
  popoverTabs, movePopoverTab,
} from './store.js';
import ShopsList from './ShopsList.vue';
import { useTabDrag } from './useTabDrag.js';

// Ids are what the order stores; the short labels are presentation, and stay
// short because the strip has about 300px to work with.
const TAB_LABELS = {
  price: { label: 'Price', title: 'Price history' },
  tp: { label: 'TP', title: 'Trading post history' },
  wiz: { label: 'SW', title: 'Shop Wizard — searches only when you open this tab' },
  shops: { label: 'SSW', title: 'Super Shop Wizard (Premium)' },
};

const tabDrag = useTabDrag(movePopoverTab, () => state.settings.movableTabs);

// Selecting the Shop Wizard tab spends one of a limited number of searches, so
// a drag that happens to end on it must not count as opening it.
const onSelect = (id) => { if (!tabDrag.wasDragged()) selectTab(id); };

const props = defineProps({ data: { type: Object, required: true } });

const np = (n) => (n === null || n === undefined ? '—' : `${n.toLocaleString('en-US')} NP`);
const priceHistory = computed(() => (props.data.history || []).filter((h) => h.date));
const lots = computed(() => state.tp.data?.lots || []);
const wizListings = computed(() => state.wiz.data?.listings || []);

// Results are reused rather than re-searched, so say how old they are.
// The stats line has ~300px at 10px type, so it is one sentence that can
// ellipsize rather than four chips that wrap onto a second and third row.
const wizSummary = computed(() => {
  const shops = state.wiz.data?.listings.length ?? 0;
  const from = state.wiz.searches > 1 ? ` from ${state.wiz.searches} searches` : '';
  const cheapest = wizListings.value.length ? ` · cheapest ${wizListings.value[0].priceText}` : '';
  return `${shops} shops${from}${cheapest}`;
});

const searchedAgo = computed(() => {
  if (!state.wiz.at) return 'again';
  const mins = Math.floor((Date.now() - state.wiz.at) / 60000);
  return mins < 1 ? 'now' : `${mins}m`;
});
</script>

<template>
  <div class="ns-tabs-wrap">
    <!-- Three tabs at Vuetify's default width overflow a 340px card, which
         turns the strip into a scrolling slide-group with arrows. -->
    <v-tabs
      :model-value="state.tab"
      density="compact"
      height="30"
      class="ns-tabs"
      :show-arrows="false"
    >
      <v-tab
        v-for="(id, i) in popoverTabs()"
        :key="id"
        :value="id"
        class="ns-tab"
        :class="{
          'ns-tab--dragging': tabDrag.isDragging(i),
          'ns-tab--over': tabDrag.isOver(i),
          'ns-tab--movable': state.settings.movableTabs,
        }"
        :title="TAB_LABELS[id].title"
        :draggable="state.settings.movableTabs"
        @click="onSelect(id)"
        @dragstart="tabDrag.onDragStart($event, i)"
        @dragover="tabDrag.onDragOver($event, i)"
        @drop.prevent="tabDrag.onDrop(i)"
        @dragend="tabDrag.onDragEnd"
      >{{ TAB_LABELS[id].label }}</v-tab>
    </v-tabs>

    <!-- Fixed height so the popover never jumps between tabs; content scrolls. -->
    <div class="ns-tab-window">
      <template v-if="state.tab === 'price'">
        <v-table v-if="priceHistory.length" density="compact" class="ns-rows">
          <tbody>
            <tr v-for="h in priceHistory" :key="h.date">
              <td>{{ h.date }}</td>
              <td class="ns-num">{{ np(h.price) }}</td>
              <td
                class="ns-num"
                :class="h.change > 0 ? 'ns-up' : h.change < 0 ? 'ns-down' : ''"
              >
                <template v-if="h.change">{{ h.change > 0 ? '+' : '' }}{{ h.change.toLocaleString('en-US') }}</template>
              </td>
            </tr>
          </tbody>
        </v-table>
        <p v-else class="ns-empty">No price history.</p>
      </template>

      <!-- Regular Shop Wizard. Searches are limited, so this only runs when
           the tab is opened, and the result is reused for a while after. -->
      <template v-else-if="state.tab === 'wiz'">
        <div v-if="state.wiz.loading" class="ns-tp-loading">
          <v-progress-circular indeterminate size="22" width="2" />
          <span>Asking the Shop Wizard…</span>
        </div>

        <v-alert v-else-if="state.wiz.error" type="warning" variant="tonal" density="compact" class="ns-tp-error">
          <div>{{ state.wiz.error }}</div>
          <v-btn size="x-small" variant="text" class="mt-1" @click="retryWizard">Search again</v-btn>
        </v-alert>

        <template v-else-if="state.wiz.data">
          <div class="ns-tp-stats">
            <span class="ns-stat-line">{{ wizSummary }}</span>
            <button
              type="button"
              class="ns-research"
              :title="`Searched ${searchedAgo === 'now' ? 'just now' : searchedAgo + ' ago'} — search again to add any shops this missed`"
              @click="retryWizard"
            ><v-icon :icon="mdiRefresh" size="12" /> {{ searchedAgo }}</button>
          </div>
          <v-table v-if="wizListings.length" density="compact" class="ns-rows">
            <tbody>
              <tr v-for="s in wizListings" :key="s.owner + s.price">
                <td class="ns-shop-owner">
                  <a v-if="s.href" :href="s.href" target="_blank" rel="noopener">{{ s.owner }}</a>
                  <span v-else>{{ s.owner }}</span>
                </td>
                <td class="ns-num">{{ s.priceText }}</td>
                <td class="ns-num ns-shop-stock">{{ s.amount ? `x${s.amount}` : '' }}</td>
              </tr>
            </tbody>
          </v-table>
          <p v-else class="ns-empty">No shops are stocking this right now.</p>
        </template>
      </template>

      <!-- Super Shop Wizard: the same list the Shops popover shows -->
      <ShopsList v-else-if="state.tab === 'shops'" :limit="25" />

      <template v-else>
        <div v-if="state.tp.loading" class="ns-tp-loading">
          <v-progress-circular indeterminate size="22" width="2" />
          <span>Loading trading post history…</span>
        </div>

        <v-alert v-else-if="state.tp.error" type="warning" variant="tonal" density="compact" class="ns-tp-error">
          <div>{{ state.tp.error.text }}</div>
          <v-btn size="x-small" variant="text" class="mt-1" @click="retryTradingPost">Retry</v-btn>
        </v-alert>

        <template v-else-if="state.tp.data">
          <div class="ns-tp-stats">
            <span v-if="state.tp.data.lastSeen">last seen {{ state.tp.data.lastSeen }}</span>
            <span v-if="state.tp.data.uniqueOwners90d">{{ state.tp.data.uniqueOwners90d.toLocaleString('en-US') }} owners/90d</span>
            <span v-if="state.tp.data.appearances90d">{{ state.tp.data.appearances90d.toLocaleString('en-US') }} lots/90d</span>
          </div>

          <p v-if="!lots.length && state.tp.data.unavailableReason" class="ns-empty">
            {{ state.tp.data.unavailableReason }}
          </p>
          <v-table v-else-if="lots.length" density="compact" class="ns-rows">
            <tbody>
              <tr v-for="lot in lots" :key="lot.lot">
                <td>
                  {{ lot.date }}
                  <span v-if="lot.items > 1" class="ns-bundle" :title="`lot of ${lot.items} items`">×{{ lot.items }}</span>
                </td>
                <td class="ns-num">
                  <template v-if="lot.price !== null">{{ np(lot.price) }}</template>
                  <!-- Multi-item lots price the bundle, not this item. -->
                  <em v-else class="ns-noprice">bundle</em>
                </td>
                <td class="ns-owner">{{ lot.owner }}</td>
              </tr>
            </tbody>
          </v-table>
          <p v-else class="ns-empty">No trading post lots recorded.</p>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.ns-tabs { min-height: 30px; border-bottom: 1px solid rgba(0, 0, 0, .12); }
/* A tab being dragged fades; the one it would land on shows an edge. */
.ns-tab--dragging { opacity: .4; }
.ns-tab--over { box-shadow: inset 2px 0 0 #1f6feb; }
.ns-tab--movable { cursor: grab; }
.ns-tab {
  font-size: 11px; letter-spacing: 0; text-transform: none;
  min-width: 0 !important; padding: 0 14px; flex: 0 1 auto;
}

.ns-tab-window {
  /* v-card is a flex column, so without flex:none this collapses to its
     content height and the popover jumps between tabs. */
  flex: 0 0 auto;
  height: 168px;
  min-height: 168px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.ns-rows { font-size: 11px; }
.ns-rows :deep(td) { height: 24px !important; padding: 0 8px !important; white-space: nowrap; }
.ns-num { text-align: right; font-variant-numeric: tabular-nums; }
.ns-up { color: #2e7d32; }
.ns-down { color: #c62828; }
.ns-owner { text-align: right; opacity: .55; font-size: 10px; }
.ns-shop-owner { max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
.ns-shop-owner a { color: inherit; }
.ns-shop-stock { opacity: .55; font-size: 10px; }
.ns-research {
  flex: none; font: inherit; font-size: 10px; cursor: pointer; color: inherit;
  display: inline-flex; align-items: center; gap: 2px;
  background: none; border: 1px solid rgba(0, 0, 0, .2); border-radius: 4px; padding: 0 5px;
}
.ns-research:hover { background: rgba(0, 0, 0, .05); }
.ns-noprice { opacity: .5; font-size: 10px; }
.ns-bundle {
  font-size: 9px; opacity: .6; border: 1px solid currentColor;
  border-radius: 3px; padding: 0 2px; margin-left: 3px;
}

.ns-tp-stats {
  /* The wizard rows keep to one line via .ns-stat-line below; wrapping is
     left on for the TP tab, whose three chips have no such line. */
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  font-size: 10px; opacity: .65; padding: 6px 8px 2px;
}
.ns-stat-line {
  flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ns-tp-loading {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 40px 0; font-size: 11px; opacity: .7;
}
.ns-tp-error { margin: 8px; font-size: 11px; }
.ns-empty { font-size: 11px; opacity: .6; padding: 16px 8px; text-align: center; }
</style>
