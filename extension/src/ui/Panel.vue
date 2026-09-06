<script setup>
import { computed, ref } from 'vue';
import {
  mdiClose, mdiCog, mdiChevronRight, mdiHeart, mdiHeartOutline, mdiHeartRemove,
  mdiCheckCircle, mdiCheckCircleOutline,
} from '@mdi/js';
import {
  state, closePanel, openFavourite, removeFavouriteAt, isDailyFavourite, toggleDaily, loadFoodClub,
  moveFavourite, moveDailyFavourite, showSettings, isPremium, dismissToast,
  isDailyVisited, toggleDailyVisited, clearVisitedDailies, visitDaily,
  isDailyTracked, readyIn, nextReadyIn, dailySchedule,
  setPanelPos, savePanelPos,
  panelTabs, movePanelTab,
} from './store.js';
import SettingsView from './SettingsView.vue';
import FoodClub from './FoodClub.vue';
import { dailiesFor, isPremiumDaily } from '../lib/dailies.js';
import { startDrag } from '../lib/positions.js';
import { useTabDrag } from './useTabDrag.js';

const FAVOURITES_GROUP = 'Favourites';

const openGroups = ref(new Set([FAVOURITES_GROUP, 'Money makers', 'Wheels']));
const toggleGroup = (title) => {
  const next = new Set(openGroups.value);
  next.has(title) ? next.delete(title) : next.add(title);
  openGroups.value = next;
};

// Favourited dailies get pinned to the top, and also stay in their own group
// so the list does not reshuffle as you star things.
//
// Premium-only entries are dropped without the setting — including from the
// pinned group, so one favourited while Premium was on does not linger.
const visibleDailies = computed(() => dailiesFor({ premium: isPremium() }));
const pinnedDailies = computed(() => (isPremium()
  ? state.dailyFavourites
  : state.dailyFavourites.filter((d) => !isPremiumDaily(d))));

const dailyGroups = computed(() => (
  pinnedDailies.value.length
    ? [{ title: FAVOURITES_GROUP, items: pinnedDailies.value }, ...visibleDailies.value]
    : visibleDailies.value
));

// The clicked row is the popover's anchor, so it appears beside the favourite.
function open(event, favourite) {
  // A drag ends with a click on some browsers; do not open what was dragged.
  if (dragging.value !== null) return;
  openFavourite(event.currentTarget, favourite);
}

// --- reordering by dragging -------------------------------------------------
// Shared by both lists. `kind` keeps a drag from one list dropping into the
// other, which would otherwise reorder the wrong thing.
const dragging = ref(null);
const dragOver = ref(null);
const dragKind = ref(null);

const MOVERS = { fav: moveFavourite, daily: moveDailyFavourite };

function onDragStart(event, index, kind) {
  dragging.value = index;
  dragKind.value = kind;
  event.dataTransfer.effectAllowed = 'move';
  // Firefox refuses to start a drag without data set.
  event.dataTransfer.setData('text/plain', String(index));
}

function onDragOver(event, index, kind) {
  if (dragging.value === null || dragKind.value !== kind) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  dragOver.value = index;
}

async function onDrop(index, kind) {
  const from = dragging.value;
  const wasKind = dragKind.value;
  onDragEnd();
  if (from !== null && wasKind === kind) await MOVERS[kind](from, index);
}

function onDragEnd() {
  dragging.value = null;
  dragOver.value = null;
  dragKind.value = null;
}

const isDragging = (i, kind) => dragging.value === i && dragKind.value === kind;
const isDragOver = (i, kind) => dragOver.value === i && dragKind.value === kind && dragging.value !== i;

// --- visited dailies --------------------------------------------------------
// Counted over what is actually on screen, so the total does not include
// premium entries you cannot reach.

// Untracked entries are left out of the totals: the stock market can never be
// "done", so counting it would put the target permanently out of reach.
const shownDailyUrls = computed(() => new Set(
  visibleDailies.value.flatMap((g) => g.items.map((i) => i.url)).filter(isDailyTracked),
));

const visitedShown = computed(
  () => Object.keys(state.visits).filter((url) => shownDailyUrls.value.has(url)).length,
);

const trackedIn = (group) => group.items.filter((i) => isDailyTracked(i.url));
const groupVisited = (group) => trackedIn(group).filter((i) => isDailyVisited(i.url)).length;

/** What the tick's tooltip says, which differs per daily now. */
function tickTitle(url) {
  if (!isDailyVisited(url)) return `Mark as done (${dailySchedule(url)})`;
  const left = readyIn(url);
  return left ? `Done — ready again in ${left}. Click to untick.` : 'Done — click to untick.';
}

// --- reordering the tabs ----------------------------------------------------
// Labels live here rather than in the stored order, which holds ids only: an
// id survives a rename, and nothing about how a tab looks belongs in settings.

const PANEL_TAB_LABELS = {
  favourites: 'Favourites',
  dailies: 'Dailies',
  foodclub: 'Food Club',
};

const tabDrag = useTabDrag(movePanelTab, () => state.settings.movableTabs);

// Food Club is the one tab that fetches on selection; a drag must not trigger
// that, so the handler checks it was a real click.
function onTabClick(id) {
  if (tabDrag.wasDragged()) return;
  if (id === 'foodclub') loadFoodClub();
}

// --- moving the panel -------------------------------------------------------

// A ref on a Vuetify component is the component, not the element it renders,
// so everything that measures the panel goes through this.
const card = ref(null);
const cardEl = () => card.value?.$el ?? card.value;

// A remembered position replaces the anchored corner entirely, so the two
// never both apply.
const panelStyle = computed(() => (
  state.panelPos
    ? { left: `${state.panelPos.x}px`, top: `${state.panelPos.y}px`, right: 'auto', bottom: 'auto' }
    : null
));

function onHeadPointerDown(event) {
  // Not from the cog or the close button, and left button only.
  if (!state.settings.movablePanel || event.button !== 0) return;
  if (event.target.closest('button, .v-btn')) return;

  const el = cardEl();
  if (!el) return;
  const rect = el.getBoundingClientRect();
  startDrag(event, {
    origin: { x: rect.left, y: rect.top },
    onMove: (pos) => {
      state.panelDragging = true;
      setPanelPos(pos, el);
    },
    onEnd: ({ moved, x, y }) => {
      state.panelDragging = false;
      if (moved) savePanelPos({ x, y }, el);
    },
  });
}
</script>

<template>
  <div
    v-if="state.panelOpen"
    class="ns-panel"
    :class="[state.panelPos ? 'ns-panel--free' : `ns-panel--${state.panelAnchor}`]"
    :style="panelStyle"
  >
    <v-card ref="card" class="ns-panel-card" elevation="10">
      <div
        class="ns-panel-head"
        :class="{
          'ns-panel-head--grab': state.settings.movablePanel,
          'ns-panel-head--dragging': state.panelDragging,
        }"
        @pointerdown="onHeadPointerDown"
      >
        <span class="ns-panel-title">neo-snipe</span>
        <v-spacer />
        <v-btn
          :icon="mdiCog"
          size="x-small"
          variant="text"
          class="ns-cog"
          :class="{ 'ns-cog--on': state.panelView === 'settings' }"
          :aria-label="state.panelView === 'settings' ? 'Back' : 'Settings'"
          :title="state.panelView === 'settings' ? 'Back' : 'Settings'"
          @click="showSettings(state.panelView !== 'settings')"
        />
        <v-btn :icon="mdiClose" size="x-small" variant="text" class="ns-close"
               aria-label="Close" @click="closePanel" />
      </div>

      <v-tabs v-if="state.panelView !== 'settings'" v-model="state.panelTab"
              density="compact" height="32" class="ns-panel-tabs">
        <v-tab
          v-for="(id, i) in panelTabs()"
          :key="id"
          :value="id"
          class="ns-panel-tab"
          :class="{
            'ns-tab--dragging': tabDrag.isDragging(i),
            'ns-tab--over': tabDrag.isOver(i),
            'ns-tab--movable': state.settings.movableTabs,
          }"
          :draggable="state.settings.movableTabs"
          @click="onTabClick(id)"
          @dragstart="tabDrag.onDragStart($event, i)"
          @dragover="tabDrag.onDragOver($event, i)"
          @drop.prevent="tabDrag.onDrop(i)"
          @dragend="tabDrag.onDragEnd"
        >
          {{ PANEL_TAB_LABELS[id] }}
          <span v-if="id === 'favourites' && state.favourites.length" class="ns-count">
            {{ state.favourites.length }}
          </span>
        </v-tab>
      </v-tabs>

      <div class="ns-panel-body">
        <SettingsView v-if="state.panelView === 'settings'" />

        <!-- Favourites -->
        <template v-else-if="state.panelTab === 'favourites'">
          <p v-if="!state.favourites.length" class="ns-panel-empty">
            No favourites yet. Click the ♥ on any item's price popover to save it here.
          </p>
          <div v-else>
            <p class="ns-panel-hint">
              Opening a favourite fetches its current price, ignoring the cache. Drag to reorder.
            </p>
            <div
              v-for="(fav, i) in state.favourites"
              :key="fav.name + (fav.imageHash || '')"
              class="ns-fav"
              :class="{
                'ns-fav--dragging': isDragging(i, 'fav'),
                'ns-fav--over': isDragOver(i, 'fav'),
              }"
              role="button"
              tabindex="0"
              draggable="true"
              @click="open($event, fav)"
              @keyup.enter="open($event, fav)"
              @dragstart="onDragStart($event, i, 'fav')"
              @dragover="onDragOver($event, i, 'fav')"
              @drop.prevent="onDrop(i, 'fav')"
              @dragend="onDragEnd"
            >
              <span class="ns-fav-grip" aria-hidden="true">⠿</span>
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
          <div v-if="state.settings.trackDailyVisits" class="ns-visited-bar">
            <span class="ns-visited-count">{{ visitedShown }} of {{ shownDailyUrls.size }} done</span>
            <span v-if="nextReadyIn()" class="ns-visited-reset" :title="`Neopets day ${state.nstDay}`">
              next ready in {{ nextReadyIn() }}
            </span>
            <v-spacer />
            <button
              v-if="visitedShown"
              type="button"
              class="ns-visited-clear"
              @click="clearVisitedDailies"
            >Clear</button>
          </div>

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
              <span class="ns-group-count">
                <template v-if="state.settings.trackDailyVisits && groupVisited(group)">
                  {{ groupVisited(group) }}/{{ trackedIn(group).length }}
                </template>
                <template v-else>{{ group.items.length }}</template>
              </span>
            </button>

            <div v-show="openGroups.has(group.title)" class="ns-group-body">
              <div
                v-for="(item, i) in group.items"
                :key="item.url"
                class="ns-daily-row"
                :class="{
                  'ns-daily-row--pinned': group.title === FAVOURITES_GROUP,
                  'ns-fav--dragging': group.title === FAVOURITES_GROUP && isDragging(i, 'daily'),
                  'ns-fav--over': group.title === FAVOURITES_GROUP && isDragOver(i, 'daily'),
                }"
                :draggable="group.title === FAVOURITES_GROUP"
                @dragstart="onDragStart($event, i, 'daily')"
                @dragover="onDragOver($event, i, 'daily')"
                @drop.prevent="onDrop(i, 'daily')"
                @dragend="onDragEnd"
              >
                <span v-if="group.title === FAVOURITES_GROUP" class="ns-fav-grip" aria-hidden="true">⠿</span>
                <v-btn
                  v-if="state.settings.trackDailyVisits && isDailyTracked(item.url)"
                  :icon="isDailyVisited(item.url) ? mdiCheckCircle : mdiCheckCircleOutline"
                  :color="isDailyVisited(item.url) ? 'green' : undefined"
                  size="x-small"
                  variant="text"
                  class="ns-daily-tick"
                  :class="{ 'ns-daily-tick--on': isDailyVisited(item.url) }"
                  :aria-label="`Mark ${item.label} as ${isDailyVisited(item.url) ? 'not done' : 'done'}`"
                  :title="tickTitle(item.url)"
                  @click.prevent.stop="toggleDailyVisited(item.url)"
                />
                <!-- Keeps untracked rows lined up with the ticked ones. -->
                <span
                  v-else-if="state.settings.trackDailyVisits"
                  class="ns-daily-notick"
                  aria-hidden="true"
                />
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noopener"
                  class="ns-daily"
                  :class="{ 'ns-daily--visited': isDailyVisited(item.url) }"
                  @click="visitDaily(item.url)"
                >{{ item.label }}</a>
                <span v-if="readyIn(item.url)" class="ns-daily-ready">{{ readyIn(item.url) }}</span>
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
      <!-- Sits inside the card so it cannot escape the shadow root. -->
      <div v-if="state.toast" class="ns-toast" :class="{ 'ns-toast--bad': state.toast.tone === 'bad' }"
           role="status">
        <span class="ns-toast-text">{{ state.toast.text }}</span>
        <a v-if="state.toast.action" class="ns-toast-action" :href="state.toast.action.href"
           target="_blank" rel="noopener">{{ state.toast.action.label }}</a>
        <button type="button" class="ns-toast-x" aria-label="Dismiss" @click="dismissToast">×</button>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.ns-toast {
  position: absolute; left: 8px; right: 8px; bottom: 8px; z-index: 3;
  display: flex; align-items: center; gap: 8px;
  padding: 7px 8px 7px 10px; border-radius: 6px;
  font-size: 11px; line-height: 1.3;
  background: #2e7d32; color: #fff; box-shadow: 0 2px 10px rgba(0, 0, 0, .3);
}
.ns-toast--bad { background: #c62828; }
.ns-toast-text { flex: 1; min-width: 0; }
.ns-toast-action { color: #fff; font-weight: 600; white-space: nowrap; }
.ns-toast-x {
  flex: none; background: none; border: 0; color: inherit; cursor: pointer;
  font-size: 14px; line-height: 1; padding: 0 2px; opacity: .8;
}
.ns-panel {
  /* Fixed, not absolute: the nearest positioned ancestor is Vuetify's
     .v-application__wrap, which we collapse to height 0, so `bottom` measured
     from there put the panel far above the viewport. */
  position: fixed;
  right: 16px;
  pointer-events: auto;
}
/* Above the in-page bar. */
.ns-panel--bottom { bottom: 58px; }
/* Under the toolbar button, which is always at the top right of the window. */
.ns-panel--top { top: 12px; }
/* Dragged somewhere: left/top come from the inline style instead. */
.ns-panel--free { right: auto; }
.ns-panel-card {
  /* 1.5x the original 320px. Capped so it still fits a narrow window. */
  width: 480px;
  max-width: calc(100vw - 32px);
  display: flex;
  flex-direction: column;
  /* The toast is absolute against this card. */
  position: relative;
}

.ns-panel-head {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 6px 6px 12px; border-bottom: 1px solid rgba(0, 0, 0, .12);
}
.ns-panel-title { font-weight: 600; font-size: 13px; }
.ns-cog--on { color: #1f6feb; }

/* The title bar doubles as the drag handle. The buttons in it keep their own
   cursor, so only the bar itself advertises the grab. */
.ns-panel-head--grab { cursor: grab; user-select: none; }
.ns-panel-head--grab .v-btn { cursor: pointer; }
.ns-panel-head--dragging { cursor: grabbing; }

.ns-panel-tabs { min-height: 32px; border-bottom: 1px solid rgba(0, 0, 0, .12); }

/* Shared with the popover's strip: a tab being dragged fades, and the one it
   would land on shows an edge. Vertical, since tabs sit side by side. */
.ns-tab--dragging { opacity: .4; }
.ns-tab--over { box-shadow: inset 2px 0 0 #1f6feb; }
.ns-tab--movable { cursor: grab; }
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
.ns-fav--dragging { opacity: .4; }
.ns-fav--over { box-shadow: inset 0 2px 0 #1f6feb; }
.ns-fav-grip {
  flex: 0 0 auto; cursor: grab; opacity: 0;
  font-size: 11px; line-height: 1; letter-spacing: -1px; user-select: none;
}
.ns-fav:hover .ns-fav-grip { opacity: .35; }
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
/* Pinned rows can be dragged to reorder, so they get the grip and less indent. */
.ns-daily-row--pinned { padding-left: 8px; }
.ns-daily-row--pinned .ns-daily { padding-left: 4px; }
.ns-daily-row--pinned .ns-fav-grip { cursor: grab; }
.ns-daily-row--pinned:hover .ns-fav-grip { opacity: .35; }
.ns-daily-row:hover { background: rgba(0, 0, 0, .04); }
.ns-daily {
  flex: 1 1 auto; min-width: 0; display: block;
  padding: 4px 4px 4px 26px; font-size: 11.5px;
  color: inherit; text-decoration: none; opacity: .85;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ns-daily-row:hover .ns-daily { opacity: 1; text-decoration: underline; }

.ns-visited-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px 7px 12px; font-size: 10.5px;
  border-bottom: 1px solid rgba(0, 0, 0, .06);
}
.ns-visited-count { font-weight: 600; opacity: .75; }
.ns-visited-reset { opacity: .5; }
.ns-visited-clear {
  background: none; border: 0; padding: 0 2px; cursor: pointer;
  font: inherit; font-size: 10.5px; color: #1f6feb; opacity: .85;
}
.ns-visited-clear:hover { opacity: 1; text-decoration: underline; }

/* Done for today: struck through and faded, but still perfectly clickable —
   plenty of dailies are worth a second look even once claimed. */
.ns-daily--visited { opacity: .4; text-decoration: line-through; }
.ns-daily-row:hover .ns-daily--visited { opacity: .65; }

/* Unlike the heart, an unticked box stays faintly visible: the whole point is
   to see at a glance what is left. */
.ns-daily-tick { opacity: .25; margin-left: 4px; }
/* Same width as the tick button, so labels start at one indent either way. */
.ns-daily-notick { flex: 0 0 auto; width: 28px; margin-left: 4px; }
/* How long until this one is back, for anything not on the midnight clock. */
.ns-daily-ready {
  flex: 0 0 auto; font-size: 9.5px; opacity: .45;
  font-variant-numeric: tabular-nums; padding-right: 2px;
}
.ns-daily-row:hover .ns-daily-tick,
.ns-daily-tick:focus-visible,
.ns-daily-tick--on { opacity: 1; }
/* The tick takes the indent the link used to carry on its own. */
.ns-daily-row .ns-daily-tick + .ns-daily { padding-left: 4px; }

/* Hidden until you go looking, unless it is already on. */
.ns-daily-fav { opacity: 0; margin-right: 4px; }
.ns-daily-row:hover .ns-daily-fav,
.ns-daily-fav:focus-visible,
.ns-daily-fav--on { opacity: 1; }
</style>
