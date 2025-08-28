<script setup lang="ts">
import type { IActivity } from '../models/types'
import { Icon } from '@iconify/vue'
import { useDropZone } from '@vueuse/core'
import Divider from '~/components/01.kit/kit-divider/ui/kit-divider.vue'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { EActivityStatus } from '~/shared/types/models/activity'
import { useModuleStore } from '../composables/use-module'
import { minutesToTime, timeToMinutes } from '../lib/helpers'
import { EActivityTag } from '../models/types'
import DayNavigation from './controls/day-navigation.vue'
import DaysControls from './controls/days-controls.vue'
import DayActivitiesList from './day-activities/list.vue'
import DayHeader from './day-header/index.vue'
import MemoriesList from './memories/list.vue'
import TripInfoSkeleton from './states/trip-info-skeleton.vue'

const emit = defineEmits(['update:hasError'])
const route = useRoute()
const router = useRouter()

const store = useModuleStore(['data', 'ui', 'routeGallery', 'memories'])
const { days, isLoading, fetchError, getActivitiesForSelectedDay, getSelectedDay } = storeToRefs(store.data)
const { activeView, isViewMode, areAllActivitiesCollapsed, areAllMemoryGroupsCollapsed } = storeToRefs(store.ui)

const tripId = computed(() => route.params.id as string)
const dayId = computed(() => route.query.day as string)

const dropZoneRef = ref<HTMLDivElement | null>(null)

function onDrop(files: File[] | null) {
  if (!files || activeView.value !== 'memories' || isViewMode.value)
    return

  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  if (imageFiles.length > 0)
    imageFiles.forEach(file => store.memories.uploadMemoryImage(file))
}

const { isOverDropZone } = useDropZone(dropZoneRef, { onDrop })

function handleAddNewActivity() {
  if (!getSelectedDay.value)
    return

  const lastActivity = getActivitiesForSelectedDay.value.at(-1)
  const startTimeMinutes = lastActivity ? timeToMinutes(lastActivity.endTime) + 15 : 9 * 60 // 9:00
  const endTimeMinutes = startTimeMinutes + 60

  const newActivity: Omit<IActivity, 'id'> = {
    dayId: getSelectedDay.value.id,
    title: 'Новая активность',
    startTime: minutesToTime(startTimeMinutes),
    endTime: minutesToTime(endTimeMinutes),
    tag: EActivityTag.ATTRACTION,
    sections: [],
    status: EActivityStatus.NONE,
  }

  store.data.addActivity(getSelectedDay.value.id, newActivity)
}

// --- Логика для сворачивания ---

// Маршрут
const allActivityIds = computed(() => getActivitiesForSelectedDay.value.map(a => a.id))
const allRouteBlocksCollapsed = computed(() => areAllActivitiesCollapsed.value(allActivityIds.value))
const collapseRouteIcon = computed(() =>
  allRouteBlocksCollapsed.value ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up',
)
function handleToggleAllActivities() {
  store.ui.toggleAllActivities(allActivityIds.value)
}

// Воспоминания
const timelineGroups = computed(() => {
  const activities = getActivitiesForSelectedDay.value
  const memories = store.memories.memoriesForSelectedDay
  const groups: any[] = []
  if (memories.length === 0 && activities.length === 0)
    return []
  const unlinkedMemories = memories.filter(m => !m.timestamp || (new Date(m.timestamp).getUTCHours() === 0 && new Date(m.timestamp).getUTCMinutes() === 0))
  const timedMemories = memories.filter(m => !unlinkedMemories.includes(m))
  const START_OF_DAY_MINUTES = 6 * 60
  const nightMemories = timedMemories.filter(m => (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) < START_OF_DAY_MINUTES)
  if (nightMemories.length > 0)
    groups.push({ type: 'night', title: 'Ночь', memories: nightMemories })
  const firstActivityStart = activities.length > 0 ? timeToMinutes(activities[0].startTime) : Infinity
  const dayStartMemories = timedMemories.filter(m => (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) >= START_OF_DAY_MINUTES && (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) < firstActivityStart)
  if (dayStartMemories.length > 0)
    groups.push({ type: 'start', title: 'Начало дня', memories: dayStartMemories })
  activities.forEach((activity, index) => {
    const start = timeToMinutes(activity.startTime)
    const end = activities[index + 1] ? timeToMinutes(activities[index + 1].startTime) : timeToMinutes(activity.endTime)
    const activityMemories = timedMemories.filter(m => (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) >= start && (index === activities.length - 1 ? (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) <= end : (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) < end))
    groups.push({ type: 'activity', activity, title: activity.title, memories: activityMemories })
  })
  const lastActivityEnd = activities.length > 0 ? timeToMinutes(activities[activities.length - 1].endTime) : -1
  const dayEndMemories = timedMemories.filter(m => (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) > lastActivityEnd && (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) >= START_OF_DAY_MINUTES)
  if (dayEndMemories.length > 0)
    groups.push({ type: 'end', title: 'Завершение дня', memories: dayEndMemories })
  if (unlinkedMemories.length > 0)
    groups.push({ type: 'unlinked', title: 'Прочие воспоминания за этот день', memories: unlinkedMemories })
  return groups
})

const allMemoryGroupKeys = computed(() => timelineGroups.value.map(g => g.type + (g.activity?.id || g.title)))
const allMemoryBlocksCollapsed = computed(() => areAllMemoryGroupsCollapsed.value(allMemoryGroupKeys.value))
const collapseMemoriesIcon = computed(() =>
  allMemoryBlocksCollapsed.value ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up',
)
function handleToggleAllMemories() {
  store.ui.toggleAllMemoryGroups(allMemoryGroupKeys.value)
}

// --- Жизненный цикл ---

if (tripId.value) {
  store.data.fetchDaysForTrip(tripId.value, dayId.value)
  store.routeGallery.setTripId(tripId.value)
  store.routeGallery.fetchTripImages()
  store.memories.fetchMemories(tripId.value)
}

watch(fetchError, (newError) => {
  emit('update:hasError', !!newError)
})

watch(
  () => store.data.currentDayId,
  (newDayId, oldDayId) => {
    if (newDayId && newDayId !== oldDayId)
      store.ui.clearCollapsedState()

    if (newDayId && newDayId !== route.query.day)
      router.replace({ query: { ...route.query, day: newDayId } })
  },
)

onBeforeUnmount(() => {
  store.data.reset()
  store.routeGallery.reset()
  store.ui.reset()
})
</script>

<template>
  <template v-if="!fetchError">
    <DaysControls />
  </template>

  <AsyncStateWrapper
    ref="dropZoneRef"
    :loading="isLoading || store.data.isLoadingNewDay"
    :error="fetchError"
    :data="days"
    :retry-handler="() => store.data.fetchDaysForTrip(tripId)"
    transition="slide-up"
    class="trip-info-wrapper"
  >
    <template #loading>
      <TripInfoSkeleton />
    </template>

    <template #success>
      <div :key="store.data.currentDayId!" class="trip-info">
        <Divider :is-loading="store.data.isLoadingUpdateDay">
          о дне
        </Divider>
        <DayHeader />

        <div class="view-content" :class="`view-mode-${activeView}`">
          <div v-if="activeView === 'plan' || activeView === 'split'" class="plan-view">
            <div class="divider-with-action">
              <Divider :is-loading="store.data.isLoadingUpdateActivity">
                маршрут
              </Divider>
              <button
                v-if="isViewMode && allActivityIds.length > 0"
                class="collapse-all-btn"
                title="Свернуть/развернуть все активности"
                @click="handleToggleAllActivities"
              >
                <Icon :icon="collapseRouteIcon" />
              </button>
            </div>
            <DayActivitiesList @add="handleAddNewActivity" />
          </div>

          <div v-if="activeView === 'memories' || activeView === 'split'" class="memories-view">
            <div class="divider-with-action">
              <Divider
                :is-loading="store.memories.isLoadingMemories || store.memories.isCreatingMemory"
              >
                воспоминания дня
              </Divider>
              <button
                v-if="allMemoryGroupKeys.length > 0"
                class="collapse-all-btn"
                title="Свернуть/развернуть все группы"
                @click="handleToggleAllMemories"
              >
                <Icon :icon="collapseMemoriesIcon" />
              </button>
            </div>

            <MemoriesList />
          </div>
        </div>

        <DayNavigation v-if="!isLoading && days.length > 1" />
      </div>
    </template>

    <template #empty>
      <div class="trip-content-empty">
        <p>Пока не создано ни одного дня для вашего путешествия.</p>
        <button @click="store.data.addNewDay">
          Создать первый день
        </button>
      </div>
    </template>
  </AsyncStateWrapper>

  <div v-if="isOverDropZone && activeView === 'memories' && !isViewMode" class="drop-overlay">
    <div class="drop-overlay-content">
      <Icon icon="mdi:upload-multiple" />
      <span>Перетащите файлы сюда для загрузки</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.trip-info {
  display: flex;
  flex-direction: column;
  height: 100%;

  .view-content.view-mode-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: start;
  }

  .plan-view {
    position: relative;
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

  &-wrapper {
    height: 100%;
    position: relative;

    @include media-down(sm) {
      padding: 0 4px;
    }
  }
}

.divider-with-action {
  position: relative;
  display: flex;
  align-items: center;

  .kit-divider {
    flex-grow: 1;
  }

  .collapse-all-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bg-secondary-color);
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-s);
    color: var(--fg-secondary-color);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    z-index: 1;

    &:hover {
      color: var(--fg-accent-color);
      border-color: var(--fg-accent-color);
      background-color: var(--bg-hover-color);
    }
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
