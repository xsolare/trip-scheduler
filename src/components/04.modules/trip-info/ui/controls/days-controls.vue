<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useTrip } from '../../composables/use-trip'

const tripComposable = useTrip()

const allDays = computed(() => tripComposable.getAllDays.value)
const selectedDay = computed(() => tripComposable.getSelectedDay.value)

function selectDay(dayId: string) {
  tripComposable.setCurrentDay(dayId)
}
</script>

<template>
  <div class="controls">
    <div class="days-selector">
      <button
        v-for="day in allDays"
        :key="day.id"
        class="day-chip"
        :class="{ active: selectedDay?.id === day.id }"
        @click="selectDay(day.id)"
      >
        {{ new Date(day.date).getDate() }}
      </button>
    </div>

    <div class="actions">
      <button>
        <Icon icon="mdi:plus" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;

  .days-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .day-chip {
      border: 1px solid var(--border-secondary-color);
      background-color: var(--bg-secondary-color);
      color: var(--fg-secondary-color);
      padding: 6px 12px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;

      &:hover {
        background-color: var(--bg-hover-color);
        border-color: var(--border-primary-color);
      }

      &.active {
        background-color: var(--fg-accent-color);
        color: white;
        border-color: var(--fg-accent-color);
      }
    }
  }

  .actions {
    display: flex;
    gap: 8px;
  }
}
</style>
