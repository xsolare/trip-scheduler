<script setup lang="ts">
import type { TDisplayMode, TripsHubTab } from '../composables/use-trips-hub'
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitViewSwitcher } from '~/components/01.kit/kit-view-switcher'
import { TripsHubKey, useTripsHub } from '../composables/use-trips-hub'
import TripsFilters from './controls/trips-filters.vue'
import TripList from './list-trip/list.vue'
import CreateTripFlow from './new-trip/create-trip-flow.vue'

const emit = defineEmits(['update:hasError'])

const tripsHub = useTripsHub()
const { mdAndUp } = useDisplay()

const currentTab = computed({
  get: () => tripsHub.activeTab.value,
  set: (tab: TripsHubTab) => tripsHub.setActiveTab(tab),
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
  get: () => tripsHub.displayMode.value,
  set: (mode: TDisplayMode) => tripsHub.setDisplayMode(mode),
})

watch(
  () => tripsHub.fetchError.value,
  (newError) => {
    emit('update:hasError', !!newError)
  },
)

onMounted(() => {
  tripsHub.fetchTrips()
  tripsHub.setActiveTab('my')
})

provide(TripsHubKey, tripsHub)
</script>

<template>
  <div
    class="trips-hub-container"
    :class="{ 'has-error': !!tripsHub.fetchError.value }"
  >
    <div class="hub-header">
      <div class="header-info">
        <h1>Путешествия</h1>
        <p>Ваши планы и приключения в одном месте.</p>
      </div>
      <KitBtn icon="mdi:plus" @click="tripsHub.openCreateModal">
        Создать
      </KitBtn>
    </div>

    <div class="hub-controls">
      <KitViewSwitcher
        v-model="currentTab"
        :items="tabItems"
      />
      <div class="spacer" />
      <TripsFilters v-model:search-query="tripsHub.searchQuery.value" />
      <KitViewSwitcher
        v-if="mdAndUp"
        v-model="currentDisplayMode"
        :items="displayModeItems"
      />
    </div>

    <div class="hub-content" :class="`display-mode--${tripsHub.displayMode.value}`">
      <TripList
        :is-loading="tripsHub.isLoading.value"
        :error="tripsHub.fetchError.value"
        :trips="tripsHub.currentTrips.value"
        @retry="() => tripsHub.fetchTrips()"
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
  height: 100%;
  gap: 24px;

  &.has-error {
    justify-content: center;

    .hub-header,
    .hub-controls {
      display: none;
    }
  }
}

.hub-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 0 8px;

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
  padding: 0 8px;
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
