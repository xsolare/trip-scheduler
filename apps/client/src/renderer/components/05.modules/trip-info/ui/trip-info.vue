<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useElementBounding, useIntersectionObserver, useWindowSize } from '@vueuse/core'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDivider } from '~/components/01.kit/kit-divider'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { TripMemoriesView } from '~/components/04.features/trip-info/trip-memories'
import { TripPlanView } from '~/components/04.features/trip-info/trip-plan'
import { useDisplay } from '~/shared/composables/use-display'
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
const { days, isLoading, fetchError, getPreviousDayId, getNextDayId } = storeToRefs(plan)
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

// Logic for fixed navigation buttons
const { mdAndUp } = useDisplay()
const tripInfoWrapperRef = ref<HTMLElement | null>(null)
const dayNavigationWrapperRef = ref<HTMLElement | null>(null)
const dayNavigationIsVisible = ref(true)

const { stop: stopIntersectionObserver } = useIntersectionObserver(
  dayNavigationWrapperRef,
  ([{ isIntersecting }]) => {
    dayNavigationIsVisible.value = isIntersecting
  },
)

const { width: windowWidth, height: windowHeight } = useWindowSize()
const { left: wrapperLeft, width: wrapperWidth, bottom: wrapperBottom } = useElementBounding(tripInfoWrapperRef)

const freeSpaceOnSide = computed(() => wrapperLeft.value)

const showFixedNavButtons = computed(() => {
  return mdAndUp.value && freeSpaceOnSide.value >= 240 && !dayNavigationIsVisible.value
})

const fixedNavPrevBtnStyle = computed(() => ({
  bottom: `${Math.max(20, windowHeight.value - wrapperBottom.value)}px`,
  left: `${wrapperLeft.value - 240}px`,
}))

const fixedNavNextBtnStyle = computed(() => ({
  bottom: `${Math.max(20, windowHeight.value - wrapperBottom.value)}px`,
  right: `${windowWidth.value - (wrapperLeft.value + wrapperWidth.value) - 240}px`,
}))

async function handleSelectPreviousDay() {
  plan.selectPreviousDay()
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'instant' })
}

async function handleSelectNextDay() {
  plan.selectNextDay()
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'instant' })
}

onUnmounted(() => {
  stopIntersectionObserver()
})
</script>

<template>
  <AsyncStateWrapper
    ref="tripInfoWrapperRef"
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

          <div ref="dayNavigationWrapperRef">
            <DayNavigation v-if="!isLoading && days.length > 1" />
          </div>
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

  <!-- Fixed Navigation Buttons -->
  <Teleport to="body">
    <Transition name="fade">
      <KitBtn
        v-if="showFixedNavButtons"
        variant="outlined"
        color="secondary"
        class="fixed-nav-btn prev"
        :style="fixedNavPrevBtnStyle"
        :disabled="!getPreviousDayId"
        @click="handleSelectPreviousDay"
      >
        <Icon icon="mdi:chevron-left" />
        Предыдущий день
      </KitBtn>
    </Transition>
    <Transition name="fade">
      <KitBtn
        v-if="showFixedNavButtons"
        variant="outlined"
        color="secondary"
        class="fixed-nav-btn next"
        :style="fixedNavNextBtnStyle"
        :disabled="!getNextDayId"
        @click="handleSelectNextDay"
      >
        Следующий день
        <Icon icon="mdi:chevron-right" />
      </KitBtn>
    </Transition>
  </Teleport>
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

.fixed-nav-btn {
  position: fixed;
  z-index: 5;
  width: 200px;
  justify-content: center;
  background-color: rgba(var(--bg-secondary-color-rgb), 0.7);
  backdrop-filter: blur(4px);
  padding: 10px 16px;

  // Override hover to exactly match the original day-navigation buttons
  &:not(:disabled):hover {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }

  // Adjust icon size to match
  :deep(.iconify) {
    font-size: 1.2rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
