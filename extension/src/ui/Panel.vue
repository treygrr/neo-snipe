<script setup>
import { computed, ref } from 'vue';
import { mdiClose, mdiChevronRight, mdiHeart, mdiHeartOutline, mdiHeartRemove } from '@mdi/js';
import {
  state, closePanel, openFavourite, removeFavouriteAt, isDailyFavourite, toggleDaily, loadFoodClub,
} from './store.js';
import FoodClub from './FoodClub.vue';
import { DAILIES } from '../lib/dailies.js';

const FAVOURITES_GROUP = 'Favourites';

const openGroups = ref(new Set([FAVOURITES_GROUP, 'Money makers', 'Wheels']));
const toggleGroup = (title) => {
  const next = new Set(openGroups.value);
  next.has(title) ? next.delete(title) : next.add(title);
  openGroups.value = next;
};

// Favourited dailies get pinned to the top, and also stay in their own group
// so the list does not reshuffle as you star things.
const dailyGroups = computed(() => (
  state.dailyFavourites.length
    ? [{ title: FAVOURITES_GROUP, items: state.dailyFavourites }, ...DAILIES]
    : DAILIES
));

// The clicked row is the popover's anchor, so it appears beside the favourite.
function open(event, favourite) {
  openFavourite(event.currentTarget, favourite);
}

</script>

<template>
  <div v-if="state.panelOpen" class="ns-panel">
    <v-card class="ns-panel-card" elevation="10">
      <div class="ns-panel-head">
        <span class="ns-panel-title">neo-snipe</span>
        <v-spacer />
        <v-btn :icon="mdiClose" size="x-small" variant="text" aria-label="Close" @click="closePanel" />
      </div>

      <v-tabs v-model="state.panelTab" density="compact" height="32" class="ns-panel-tabs">
        <v-tab value="favourites" class="ns-panel-tab">
          Favourites<span v-if="state.favourites.length" class="ns-count">{{ state.favourites.length }}</span>
        </v-tab>
        <v-tab value="dailies" class="ns-panel-tab">Dailies</v-tab>
        <v-tab value="foodclub" class="ns-panel-tab" @click="loadFoodClub()">Food Club</v-tab>
      </v-tabs>

      <div class="ns-panel-body">
        <!-- Favourites -->
        <template v-if="state.panelTab === 'favourites'">
          <p v-if="!state.favourites.length" class="ns-panel-empty">
            No favourites yet. Click the ♥ on any item's price popover to save it here.
          </p>
          <div v-else>
            <p class="ns-panel-hint">Opening a favourite fetches its current price, ignoring the cache.</p>
            <div
              v-for="fav in state.favourites"
              :key="fav.name + (fav.imageHash || '')"
              class="ns-fav"
              role="button"
              tabindex="0"
              @click="open($event, fav)"
              @keyup.enter="open($event, fav)"
            >
              <img v-if="fav.imageUrl" :src="fav.imageUrl" :alt="fav.name" class="ns-fav-img">
              <span class="ns-fav-name">{{ fav.name }}</span>
              <v-btn
                :icon="mdiHeartRemove"
                size="x-small"
                variant="text"
                class="ns-fav-remove"
                :aria-label="`Remove ${fav.name} from favourites`"
                @click.stop="removeFavouriteAt(fav)"
              />
            </div>
          </div>
        </template>

        <!-- Food Club -->
        <FoodClub v-else-if="state.panelTab === 'foodclub'" />

        <!-- Dailies -->
        <template v-else-if="state.panelTab === 'dailies'">
          <div
            v-for="group in dailyGroups"
            :key="group.title"
            class="ns-group"
            :class="{ 'ns-group--pinned': group.title === FAVOURITES_GROUP }"
          >
            <button
              type="button"
              class="ns-group-head"
              :aria-expanded="openGroups.has(group.title)"
              @click="toggleGroup(group.title)"
            >
              <v-icon
                :icon="mdiChevronRight"
                size="14"
                class="ns-chevron"
                :class="{ 'ns-chevron--open': openGroups.has(group.title) }"
              />
              <span class="ns-group-title">{{ group.title }}</span>
              <span class="ns-group-count">{{ group.items.length }}</span>
            </button>

            <div v-show="openGroups.has(group.title)" class="ns-group-body">
              <div v-for="item in group.items" :key="item.url" class="ns-daily-row">
                <a :href="item.url" target="_blank" rel="noopener" class="ns-daily">{{ item.label }}</a>
                <v-btn
                  :icon="isDailyFavourite(item.url) ? mdiHeart : mdiHeartOutline"
                  :color="isDailyFavourite(item.url) ? 'red' : undefined"
                  size="x-small"
                  variant="text"
                  class="ns-daily-fav"
                  :class="{ 'ns-daily-fav--on': isDailyFavourite(item.url) }"
                  :aria-label="`${isDailyFavourite(item.url) ? 'Unfavourite' : 'Favourite'} ${item.label}`"
                  :title="isDailyFavourite(item.url) ? 'Remove from favourites' : 'Add to favourites'"
                  @click.prevent.stop="toggleDaily(item)"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.ns-panel {
  /* Fixed, not absolute: the nearest positioned ancestor is Vuetify's
     .v-application__wrap, which we collapse to height 0, so `bottom` measured
     from there put the panel far above the viewport. */
  position: fixed;
  right: 16px;
  bottom: 58px;
  pointer-events: auto;
}
.ns-panel-card {
  /* 1.5x the original 320px. Capped so it still fits a narrow window. */
  width: 480px;
  max-width: calc(100vw - 32px);
  display: flex;
  flex-direction: column;
}

.ns-panel-head {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 6px 6px 12px; border-bottom: 1px solid rgba(0, 0, 0, .12);
}
.ns-panel-title { font-weight: 600; font-size: 13px; }

.ns-panel-tabs { min-height: 32px; border-bottom: 1px solid rgba(0, 0, 0, .12); }
.ns-panel-tab { font-size: 11px; text-transform: none; letter-spacing: 0; min-width: 0; padding: 0 12px; }
.ns-count {
  margin-left: 5px; font-size: 10px; opacity: .7;
  background: rgba(0, 0, 0, .08); border-radius: 8px; padding: 0 5px;
}

/* Fixed height so the panel never jumps between tabs. */
.ns-panel-body { height: 340px; overflow-y: auto; overscroll-behavior: contain; }
.ns-panel-empty, .ns-panel-hint { font-size: 11px; opacity: .6; padding: 12px; margin: 0; }
.ns-panel-hint { padding: 8px 12px 4px; }

.ns-fav {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 6px 4px 12px; cursor: pointer; font-size: 12px;
}
.ns-fav:hover { background: rgba(0, 0, 0, .04); }
.ns-fav-img { width: 28px; height: 28px; object-fit: contain; flex: 0 0 auto; }
.ns-fav-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ns-fav-remove { opacity: 0; }
.ns-fav:hover .ns-fav-remove, .ns-fav-remove:focus-visible { opacity: .6; }

.ns-group-head {
  display: flex; align-items: center; gap: 4px; width: 100%;
  padding: 7px 12px 7px 8px; background: none; border: 0; cursor: pointer;
  font: inherit; font-size: 11.5px; font-weight: 600; text-align: left;
  color: inherit; border-top: 1px solid rgba(0, 0, 0, .06);
}
.ns-group-head:hover { background: rgba(0, 0, 0, .04); }
.ns-group-title { flex: 1 1 auto; }
.ns-group-count { font-size: 10px; opacity: .5; font-weight: 400; }

.ns-chevron { transition: transform .15s ease; opacity: .55; }
.ns-chevron--open { transform: rotate(90deg); }

.ns-group--pinned .ns-group-head { border-top: 0; }
.ns-group--pinned + .ns-group .ns-group-head { border-top-width: 2px; }

.ns-group-body { padding-bottom: 4px; }

.ns-daily-row { display: flex; align-items: center; }
.ns-daily-row:hover { background: rgba(0, 0, 0, .04); }
.ns-daily {
  flex: 1 1 auto; min-width: 0; display: block;
  padding: 4px 4px 4px 26px; font-size: 11.5px;
  color: inherit; text-decoration: none; opacity: .85;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ns-daily-row:hover .ns-daily { opacity: 1; text-decoration: underline; }

/* Hidden until you go looking, unless it is already on. */
.ns-daily-fav { opacity: 0; margin-right: 4px; }
.ns-daily-row:hover .ns-daily-fav,
.ns-daily-fav:focus-visible,
.ns-daily-fav--on { opacity: 1; }
</style>
