<script setup lang="ts">
import type { IActivity } from '../models/types'
import Divider from '~/components/01.kit/divider/ui/divider.vue'
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

const store = useModuleStore(['data', 'ui', 'gallery'])
const { days, isLoading, fetchError, getActivitiesForSelectedDay, getSelectedDay } = storeToRefs(store.data)
const { isViewMode } = storeToRefs(store.ui)

const tripId = computed(() => route.params.id as string)

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

  store.data.addActivity(getSelectedDay.value.id, newActivity)
}

watch(fetchError, (newError) => {
  emit('update:hasError', !!newError)
})

onBeforeUnmount(() => {
  store.data.reset()
  store.gallery.reset()
  store.ui.reset()
})

if (tripId.value) {
  store.data.fetchDaysForTrip(tripId.value)
  store.gallery.setTripId(tripId.value)
}
</script>

<template>
  <DaysControls />
  <AsyncStateWrapper
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
      <div class="trip-info">
        <Divider :is-loading="store.data.isLoadingUpdateDay">
          о дне
        </Divider>
        <DayHeader />
        <Divider>
          маршрут
        </Divider>
        <DayActivitiesList @add="handleAddNewActivity" />
        <AddDayActivity
          v-if="!isViewMode"
          @add="handleAddNewActivity"
        />
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
</template>

<style lang="scss" scoped>
.trip-info-wrapper {
  height: 100%;

  @include media-down(sm) {
    padding: 0 4px;
  }
}
</style>
