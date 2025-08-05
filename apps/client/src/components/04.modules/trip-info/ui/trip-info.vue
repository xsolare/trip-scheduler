<script setup lang="ts">
import type { IActivity } from '../models/types'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { minutesToTime, timeToMinutes } from '../lib/helpers'
import { EActivityTag } from '../models/types'
import { useTripStore } from '../store/trip-store'
import AddDayActivity from './controls/add-day-activity.vue'
import DaysControls from './controls/days-controls.vue'
import DayActivitiesList from './day-activities/list.vue'
import DayHeader from './day-header/index.vue'
import TripInfoSkeleton from './states/trip-info-skeleton.vue'

const tripStore = useTripStore()
const route = useRoute()

const {
  days,
  isLoading,
  fetchError,
  getActivitiesForSelectedDay,
  isViewMode,
  getSelectedDay,
} = storeToRefs(tripStore)

const tripId = computed(() => route.params.id as string)

const dayActivitiesListRef = ref<InstanceType<typeof DayActivitiesList> | null>(null)

function handleAddNewDay() {
  tripStore.addNewDay()
}

function handleAddNewActivity() {
  if (!getSelectedDay.value)
    return

  const lastActivity = getActivitiesForSelectedDay.value.at(-1)
  const startTimeMinutes = lastActivity ? timeToMinutes(lastActivity.endTime) + 15 : 9 * 60 // 9:00
  const endTimeMinutes = startTimeMinutes + 60

  const newActivity: Omit<IActivity, 'id'> = {
    title: 'Новая активность',
    startTime: minutesToTime(startTimeMinutes),
    endTime: minutesToTime(endTimeMinutes),
    tag: EActivityTag.ATTRACTION,
    sections: [],
  }
  tripStore.addActivity(getSelectedDay.value.id, newActivity)
}

onMounted(() => {
  if (tripId.value)
    tripStore.fetchDaysForTrip(tripId.value)
})
</script>

<template>
  <AsyncStateWrapper
    :loading="isLoading"
    :error="fetchError"
    :data="days"
    :retry-handler="() => tripStore.fetchDaysForTrip(tripId)"
    class="trip-info-wrapper"
    transition="faded"
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

        <DayActivitiesList
          ref="dayActivitiesListRef"
          @add="handleAddNewActivity"
        />

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
