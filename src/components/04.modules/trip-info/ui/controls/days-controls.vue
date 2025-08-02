<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useTripStore } from '../../store/trip-store'

const tripStore = useTripStore()
const { getAllDays, getSelectedDay } = storeToRefs(tripStore)
const { setCurrentDay, addNewDay } = tripStore

function selectDay(dayId: string) {
  setCurrentDay(dayId)
}

function onAddNewDay() {
  addNewDay()
}
</script>

<template>
  <div class="controls">
    <div class="days-selector">
      <button
        v-for="day in getAllDays"
        :key="day.id"
        class="day-chip"
        :class="{ active: getSelectedDay?.id === day.id }"
        @click="selectDay(day.id)"
      >
        {{ new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) }}
      </button>
    </div>

    <div class="actions">
      <button title="Добавить новый день" @click="onAddNewDay">
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
    button {
      background: transparent;
      border: 1px solid var(--border-secondary-color);
      border-radius: 8px;
      padding: 6px;
      cursor: pointer;
      color: var(--fg-secondary-color);
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--fg-accent-color);
        border-color: var(--fg-accent-color);
      }
    }
  }
}
</style>
