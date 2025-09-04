<script setup lang="ts">
import { KitDivider } from '~/components/01.kit/kit-divider'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { TripMemoriesView } from '~/components/04.features/trip-info/trip-memories'
import { TripPlanView } from '~/components/04.features/trip-info/trip-plan'
import { useModuleStore } from '../composables/use-trip-info-module'
import SectionRenderer from './content/section-renderer.vue'
import DayNavigation from './controls/day-navigation.vue'
import DaysControls from './controls/days-controls.vue'
import DayHeader from './day-header.vue'
import TripInfoEmpty from './states/trip-info-empty.vue'
import TripInfoSkeleton from './states/trip-info-skeleton.vue'

const route = useRoute()
const router = useRouter()

const { plan, ui, sections } = useModuleStore(['plan', 'ui', 'routeGallery', 'memories', 'sections'])
const { days, isLoading, fetchError } = storeToRefs(plan)
const { activeView } = storeToRefs(ui)

const tripId = computed(() => route.params.id as string)
const dayId = computed(() => route.query.day as string)
const section = computed(() => route.query.section as string)

watch(
  () => plan.currentDayId,
  (newDayId, oldDayId) => {
    if (newDayId && newDayId !== oldDayId)
      ui.clearCollapsedState()

    if (newDayId && newDayId !== route.query.day)
      router.replace({ query: { ...route.query, day: newDayId, section: undefined } })
  },
)
</script>

<template>
  <AsyncStateWrapper
    :loading="isLoading || plan.isLoadingNewDay"
    :error="fetchError"
    :data="days"
    :retry-handler="() => plan.fetchTripDetails(tripId, dayId, sections.setSections)"
    transition="slide-up"
    class="trip-info-wrapper"
  >
    <template #loading>
      <TripInfoSkeleton />
    </template>

    <template #success>
      <template v-if="!section">
        <DaysControls />

        <div :key="plan.currentDayId!" class="trip-info-day-view">
          <KitDivider :is-loading="plan.isLoadingUpdateDay">
            о дне
          </KitDivider>
          <DayHeader />

          <div class="view-content" :class="`view-mode-${activeView}`">
            <TripPlanView v-if="activeView === 'plan' || activeView === 'split'" />
            <TripMemoriesView v-if="activeView === 'memories' || activeView === 'split'" />
          </div>

          <DayNavigation v-if="!isLoading && days.length > 1" />
        </div>
      </template>
      <template v-else>
        <SectionRenderer />
      </template>
    </template>

    <template #empty>
      <TripInfoEmpty />
    </template>
  </AsyncStateWrapper>
</template>

<style lang="scss" scoped>
.trip-info-day-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.view-content.view-mode-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.view-mode-split .plan-view::after {
  content: '';
  position: absolute;
  top: 0;
  right: -16px;
  bottom: 0;
  width: 1px;
  background-color: var(--border-secondary-color);
}

.trip-info-wrapper {
  height: 100%;
  position: relative;

  @include media-down(sm) {
    padding: 0 4px;
  }
}

.drop-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--fg-accent-color-rgb), 0.1);
  border: 2px dashed var(--fg-accent-color);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  backdrop-filter: blur(4px);

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--fg-accent-color);
    font-size: 1.2rem;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    .iconify {
      font-size: 3rem;
    }
  }
}
</style>
