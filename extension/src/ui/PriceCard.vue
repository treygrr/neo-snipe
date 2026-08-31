<script setup>
import { computed } from 'vue';
import { mdiHeart, mdiHeartOutline, mdiOpenInNew, mdiSwapHorizontal, mdiGavel } from '@mdi/js';
import { searchesFor } from '../lib/neopets-search.js';
import { state, isFavourite, toggleCurrentFavourite, shopMargin } from './store.js';

const props = defineProps({ data: { type: Object, required: true } });

const faved = computed(() => isFavourite(state.item));
const margin = computed(() => shopMargin());

const ICONS = { swap: mdiSwapHorizontal, gavel: mdiGavel };
const searches = computed(() => searchesFor(props.data.name).map((s) => ({ ...s, path: ICONS[s.icon] })));

const np = (n) => (n === null || n === undefined ? '—' : `${n.toLocaleString('en-US')} NP`);
const rarityColor = computed(() => {
  const r = props.data.rarity;
  if (r === null || r === undefined) return 'grey';
  if (r >= 180) return 'deep-purple';
  if (r >= 100) return 'red';
  if (r >= 90) return 'orange';
  if (r >= 80) return 'blue';
  return 'grey';
});
</script>

<template>
  <div class="ns-card">
    <div class="ns-head">
      <img v-if="data.imageUrl" :src="data.imageUrl" :alt="data.name" class="ns-img">
      <div class="ns-head-text">
        <div class="ns-name-row">
          <a
            v-if="data.url"
            :href="data.url"
            target="_blank"
            rel="noopener"
            class="ns-name ns-name--link"
            :title="`Open ${data.name} on Jelly Neo`"
          >{{ data.name }}<v-icon :icon="mdiOpenInNew" size="11" class="ns-name-ext" /></a>
          <span v-else class="ns-name">{{ data.name }}</span>

          <v-btn
            icon
            variant="text"
            size="x-small"
            class="ns-fav-btn"
            :aria-label="faved ? 'Remove from favourites' : 'Add to favourites'"
            :title="faved ? 'Remove from favourites' : 'Add to favourites'"
            @click="toggleCurrentFavourite"
          >
            <v-icon :icon="faved ? mdiHeart : mdiHeartOutline" :color="faved ? 'red' : undefined" size="17" />
          </v-btn>
        </div>
        <div class="ns-chips">
          <v-chip v-if="data.rarity !== null" size="x-small" :color="rarityColor" variant="flat">
            r{{ data.rarity }}<span v-if="data.rarityLabel">&nbsp;{{ data.rarityLabel }}</span>
          </v-chip>
          <v-chip v-if="data.category" size="x-small" variant="tonal">{{ data.category }}</v-chip>
        </div>
      </div>
    </div>

    <div class="ns-price">
      <div class="ns-price-value">{{ data.priceText || np(data.estimatedPrice) }}</div>
      <div class="ns-price-date">
        <template v-if="data.priceAsOf">as of {{ data.priceAsOf }}</template>
        <template v-else>no dated price</template>
      </div>
    </div>

    <!-- Only where the page told us what the shop is asking. -->
    <div v-if="margin" class="ns-margin" :class="{ 'ns-margin--good': margin.clears }">
      <span class="ns-margin-sum">
        {{ np(margin.ask) }} here · {{ margin.profit >= 0 ? '+' : '' }}{{ np(margin.profit) }}
      </span>
      <span class="ns-margin-note">
        <template v-if="margin.clears">clears your {{ np(state.settings.minMargin) }}</template>
        <template v-else>under your {{ np(state.settings.minMargin) }}</template>
      </span>
    </div>

    <p v-if="data.description" class="ns-desc">{{ data.description }}</p>

    <div class="ns-where">
      <a
        v-for="s in searches"
        :key="s.id"
        :href="s.href"
        target="_blank"
        rel="noopener"
        class="ns-where-btn"
        :title="s.title"
        :aria-label="s.title"
      >
        <v-icon :icon="s.path" size="15" />
      </a>
    </div>

    <div class="ns-meta">
      <span v-if="data.neopetsEstValue">NP est. value {{ np(data.neopetsEstValue) }}</span>
      <span v-if="data.cached" class="ns-cached">cached</span>
    </div>
  </div>
</template>

<style scoped>
.ns-head { display: flex; gap: 10px; align-items: center; }
.ns-img { width: 48px; height: 48px; object-fit: contain; flex: 0 0 auto; }
.ns-head-text { min-width: 0; flex: 1 1 auto; }

.ns-name-row { display: flex; align-items: flex-start; gap: 2px; }
.ns-name {
  font-weight: 600; font-size: 14px; line-height: 1.25;
  flex: 1 1 auto; min-width: 0;
}
.ns-name--link { color: inherit; text-decoration: none; }
.ns-name--link:hover { text-decoration: underline; }
.ns-name-ext { opacity: .45; margin-left: 3px; vertical-align: baseline; }
.ns-name--link:hover .ns-name-ext { opacity: .8; }

/* Square, so the icon button is a circle rather than a pill. */
.ns-fav-btn { flex: 0 0 auto; width: 26px; height: 26px; margin: -2px -4px 0 0; }
.ns-chips { display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap; }
.ns-price { margin: 10px 0 6px; }
.ns-price-value { font-size: 20px; font-weight: 700; line-height: 1.1; }
.ns-price-date { font-size: 11px; opacity: .65; }
.ns-margin {
  display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap;
  margin: 0 0 8px; padding: 5px 8px; border-radius: 5px;
  background: rgba(0, 0, 0, .05); font-size: 11px;
}
.ns-margin--good { background: #e8f5e9; color: #1b5e20; }
.ns-margin-sum { font-weight: 600; }
.ns-margin-note { opacity: .7; font-size: 10px; }
.ns-desc { font-size: 11.5px; opacity: .8; margin: 0 0 8px; font-style: italic; }
.ns-where { display: flex; gap: 6px; margin: 8px 0 2px; }
.ns-where-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 5px;
  color: #14459c; background: #eef3fe; border: 1px solid #cddcfb; text-decoration: none;
}
.ns-where-btn:hover { background: #dfe9fd; border-color: #a9c3f7; }

.ns-meta {
  display: flex; justify-content: space-between; gap: 8px;
  font-size: 10.5px; opacity: .6; margin-top: 8px;
}
.ns-cached { font-style: italic; }
</style>
