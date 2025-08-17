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
import ViewSwitcher from './controls/view-switcher.vue'
import DayActivitiesList from './day-activities/list.vue'
import DayHeader from './day-header/index.vue'
import MemoriesList from './memories/list.vue'
import TripInfoSkeleton from './states/trip-info-skeleton.vue'

const emit = defineEmits(['update:hasError'])
const route = useRoute()
const router = useRouter()

const store = useModuleStore(['data', 'ui', 'routeGallery', 'memories'])
const { days, isLoading, fetchError, getActivitiesForSelectedDay, getSelectedDay } = storeToRefs(store.data)
const { activeView, isViewMode } = storeToRefs(store.ui)

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

watch(fetchError, (newError) => {
  emit('update:hasError', !!newError)
})

watch(
  () => store.data.currentDayId,
  (newDayId) => {
    if (newDayId && newDayId !== route.query.day)
      router.replace({ query: { ...route.query, day: newDayId } })
  },
)

if (tripId.value) {
  store.data.fetchDaysForTrip(tripId.value, dayId.value)
  store.routeGallery.setTripId(tripId.value)
  store.memories.fetchMemories(tripId.value)
}

onBeforeUnmount(() => {
  store.data.reset()
  store.routeGallery.reset()
  store.ui.reset()
})
</script>

<template>
  <template v-if="!fetchError">
    <ViewSwitcher />
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

        <template v-if="activeView === 'plan'">
          <Divider :is-loading="store.data.isLoadingUpdateActivity">
            маршрут
          </Divider>
          <DayActivitiesList @add="handleAddNewActivity" />
        </template>
        <MemoriesList v-else-if="activeView === 'memories'" />

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

  &-wrapper {
    height: 100%;
    position: relative;

    @include media-down(sm) {
      padding: 0 4px;
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
