<script setup>
import { ref } from 'vue';
import { mdiClose, mdiOpenInNew, mdiHeartOutline, mdiHeartRemove, mdiRefresh } from '@mdi/js';
import { state, closePanel, openFavourite, removeFavouriteAt } from './store.js';
import { DAILIES } from '../lib/dailies.js';

const openGroups = ref(new Set(['Money makers', 'Wheels']));
const toggleGroup = (title) => {
  const next = new Set(openGroups.value);
  next.has(title) ? next.delete(title) : next.add(title);
  openGroups.value = next;
};

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

        <!-- Dailies -->
        <template v-else>
          <div v-for="group in DAILIES" :key="group.title" class="ns-group">
            <button type="button" class="ns-group-head" @click="toggleGroup(group.title)">
              <span>{{ group.title }}</span>
              <span class="ns-group-count">{{ group.items.length }}</span>
            </button>
            <div v-show="openGroups.has(group.title)" class="ns-group-body">
              <a
                v-for="item in group.items"
                :key="item.url"
                :href="item.url"
                target="_blank"
                rel="noopener"
                class="ns-daily"
              >{{ item.label }}</a>
            </div>
          </div>
        </template>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.ns-panel {
  position: absolute;
  right: 16px;
  bottom: 58px;
  pointer-events: auto;
}
.ns-panel-card { width: 320px; display: flex; flex-direction: column; }

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
  display: flex; align-items: center; justify-content: space-between; width: 100%;
  padding: 7px 12px; background: none; border: 0; cursor: pointer;
  font: inherit; font-size: 11.5px; font-weight: 600; text-align: left;
  color: inherit; border-top: 1px solid rgba(0, 0, 0, .06);
}
.ns-group-head:hover { background: rgba(0, 0, 0, .04); }
.ns-group-count { font-size: 10px; opacity: .5; font-weight: 400; }
.ns-group-body { padding-bottom: 4px; }
.ns-daily {
  display: block; padding: 4px 12px 4px 22px; font-size: 11.5px;
  color: inherit; text-decoration: none; opacity: .85;
}
.ns-daily:hover { background: rgba(0, 0, 0, .04); opacity: 1; text-decoration: underline; }
</style>
