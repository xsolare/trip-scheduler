<script setup lang="ts">
import type { TDisplayMode, TripsHubTab } from '../store/trips-hub.store'
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitViewSwitcher } from '~/components/01.kit/kit-view-switcher'
import { useModuleStore } from '../composables/use-module'
import TripsFilters from './controls/trips-filters.vue'
import TripList from './list-trip/list.vue'
import CreateTripFlow from './new-trip/create-trip-flow.vue'

const emit = defineEmits(['update:hasError'])

const store = useModuleStore(['hub'])
const { mdAndUp } = useDisplay()

const {
  currentTrips,
  isLoading,
  fetchError,
  searchQuery,
  activeTab,
  displayMode,
} = storeToRefs(store.hub)

const currentTab = computed({
  get: () => activeTab.value,
  set: (tab: TripsHubTab) => store.hub.setActiveTab(tab),
})

const tabItems: ViewSwitcherItem<TripsHubTab>[] = [
  { id: 'my', label: 'Мои путешествия', icon: 'mdi:account-heart-outline' },
  { id: 'public', label: 'Общие', icon: 'mdi:earth' },
]

const displayModeItems: ViewSwitcherItem<TDisplayMode>[] = [
  { id: 'grid', icon: 'mdi:view-grid-outline', label: '' },
  { id: 'flex', icon: 'mdi:view-list-outline', label: '' },
]

const currentDisplayMode = computed({
  get: () => displayMode.value,
  set: (mode: TDisplayMode) => store.hub.setDisplayMode(mode),
})

watch(fetchError, (newError) => {
  emit('update:hasError', !!newError)
})

onMounted(() => {
  store.hub.fetchTrips()

  store.hub.setActiveTab('my')
})

onBeforeUnmount(() => {
  store.hub.reset()
})
</script>

<template>
  <div class="trips-hub-container">
    <div class="hub-header">
      <div class="header-info">
        <h1>Путешествия</h1>
        <p>Ваши планы и приключения в одном месте.</p>
      </div>
      <KitBtn icon="mdi:plus" @click="store.hub.openCreateModal">
        Создать
      </KitBtn>
    </div>

    <div class="hub-controls">
      <KitViewSwitcher
        v-model="currentTab"
        :items="tabItems"
      />
      <div class="spacer" />
      <TripsFilters v-model:search-query="searchQuery" />
      <KitViewSwitcher
        v-if="mdAndUp"
        v-model="currentDisplayMode"
        :items="displayModeItems"
      />
    </div>

    <div class="hub-content" :class="`display-mode--${displayMode}`">
      <TripList
        :is-loading="isLoading"
        :error="fetchError"
        :trips="currentTrips"
        @retry="() => store.hub.fetchTrips()"
      />
    </div>

    <CreateTripFlow />
  </div>
</template>

<style lang="scss" scoped>
.trips-hub-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
}
.hub-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 4px;
    color: var(--fg-primary-color);
  }
  p {
    margin: 0;
    color: var(--fg-secondary-color);
  }
}
.hub-controls {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
}
.spacer {
  flex-grow: 1;
}
.hub-content {
  &.display-mode--grid :deep(.trip-list-wrapper) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  &.display-mode--flex :deep(.trip-list-wrapper) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
