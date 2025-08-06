<script setup lang="ts">
import type { IActivity } from '../models/types'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { useModuleStore } from '../composables/use-module'
import { minutesToTime, timeToMinutes } from '../lib/helpers'
import { EActivityTag } from '../models/types'
import AddDayActivity from './controls/add-day-activity.vue'
import DaysControls from './controls/days-controls.vue'
import DayActivitiesList from './day-activities/list.vue'
import DayHeader from './day-header/index.vue'
import TripInfoSkeleton from './states/trip-info-skeleton.vue'

const emit = defineEmits(['update:hasError'])
const route = useRoute()

const { data, ui, gallery } = useModuleStore(['data', 'ui', 'gallery'])
const { days, isLoading, fetchError, getActivitiesForSelectedDay, getSelectedDay } = storeToRefs(data)
const { isViewMode } = storeToRefs(ui)

const tripId = computed(() => route.params.id as string)

function handleAddNewDay() {
  data.addNewDay()
}

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
  }
  data.addActivity(getSelectedDay.value.id, newActivity)
}

watch(fetchError, (newError) => {
  emit('update:hasError', !!newError)
})

onBeforeUnmount(() => {
  data.reset()
  gallery.reset()
  ui.reset()
})

if (tripId.value) {
  data.fetchDaysForTrip(tripId.value)
  // gallery.setTripId(tripId.value)
  // gallery.fetchTripImages()
}
</script>

<template>
  <AsyncStateWrapper
    :loading="isLoading"
    :error="fetchError"
    :data="days"
    :retry-handler="() => data.fetchDaysForTrip(tripId)"
    transition="slide-up"
    class="trip-info-wrapper"
  >
    <template #loading>
      <TripInfoSkeleton />
    </template>

    <template #success>
      <div class="trip-info">
        <DaysControls />
        <div class="divider">
          о дне
        </div>
        <DayHeader />
        <div class="divider">
          маршрут
        </div>
        <DayActivitiesList @add="handleAddNewActivity" />
        <AddDayActivity
          v-if="getActivitiesForSelectedDay.length && !isViewMode"
          @add="handleAddNewActivity"
        />
      </div>
    </template>

    <template #empty>
      <div class="trip-content-empty">
        <p>Пока не создано ни одного дня для вашего путешествия.</p>
        <button class="g-button-primary" @click="handleAddNewDay">
          Создать первый день
        </button>
      </div>
    </template>
  </AsyncStateWrapper>
</template>

<style lang="scss" scoped>
.trip-info-wrapper {
  height: 100%;
}
</style>
