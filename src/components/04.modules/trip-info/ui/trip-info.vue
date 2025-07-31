<script setup lang="ts">
import { useTrip } from '../composables/use-trip'
import AddDayActivity from './controls/add-day-activity.vue'
import DaysControls from './controls/days-controls.vue'
import DayActivitiesList from './day-activities/list.vue'
import DayHeader from './day-header/index.vue'

const { days, fetchDaysForTrip } = useTrip()

onMounted(() => fetchDaysForTrip)
</script>

<template>
  <div v-if="days.length" class="trip-info">
    <DaysControls />
    <div class="divider">
      о дне
    </div>
    <DayHeader />
    <div class="divider">
      маршрут
    </div>
    <DayActivitiesList />

    <AddDayActivity />
  </div>

  <div v-else class="trip-content-empty">
    <p>Пока не создано ни одного дня для вашего путешествия.</p>
    <button class="g-button-primary">
      Создать первый день
    </button>
  </div>
</template>

<style scoped lang="scss">
.trip-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  &-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    color: var(--fg-secondary-color);
  }
}
</style>
