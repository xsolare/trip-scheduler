<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { Icon } from '@iconify/vue'
import { parseDate } from '@internationalized/date'
import { CalendarPopover } from '~/components/01.kit/calendar-popover'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'
import DaysPanel from './days-panel.vue'
import ModeSwitcher from './mode-switcher.vue'

const store = useModuleStore(['ui', 'data'])
const { isDaysPanelPinned, isDaysPanelOpen, isViewMode } = storeToRefs(store.ui)
const { getAllDays, getSelectedDay } = storeToRefs(store.data)
const { setCurrentDay, addNewDay, updateDayDetails } = store.data

const selectedCalendarDate = computed<CalendarDate | null>({
  get: () => {
    return getSelectedDay.value ? parseDate(getSelectedDay.value.date.split('T')[0]) : null
  },
  set: (newDate) => {
    if (!newDate || !getSelectedDay.value)
      return

    const currentDay = getSelectedDay.value
    const originalDate = currentDay.date
    const newDateString = newDate.toString() // 'YYYY-MM-DD'

    // Не делать ничего, если дата не изменилась
    if (originalDate.startsWith(newDateString))
      return

    const newIsoDate = new Date(newDateString).toISOString()

    // Ищем, не занята ли новая дата другим днем
    const occupiedDay = getAllDays.value.find(
      day => day.date.startsWith(newDateString) && day.id !== currentDay.id,
    )

    if (occupiedDay) {
      // Дата занята, меняем даты местами
      updateDayDetails(occupiedDay.id, { date: originalDate })
      updateDayDetails(currentDay.id, { date: newIsoDate })
    }
    else {
      // Дата свободна, просто обновляем текущий день
      updateDayDetails(currentDay.id, { date: newIsoDate })
    }
  },
})
</script>

<template>
  <div class="controls">
    <div class="left-controls">
      <button
        v-if="!isDaysPanelPinned"
        class="menu-btn" title="Открыть меню дней"
        @click="isDaysPanelOpen = !isDaysPanelOpen"
      >
        <Icon icon="mdi:menu" />
      </button>

      <CalendarPopover v-model="selectedCalendarDate" :disabled="isViewMode">
        <div class="current-day-info" role="button" :class="{ readonly: isViewMode }">
          <h3 v-if="getSelectedDay">
            {{ new Date(getSelectedDay.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}
          </h3>
          <span v-if="getSelectedDay">
            {{ new Date(getSelectedDay.date).toLocaleDateString('ru-RU', { weekday: 'long' }) }}
          </span>
        </div>
      </CalendarPopover>
    </div>
    <div class="spacer" />
    <ModeSwitcher />

    <DaysPanel
      :is-open="isDaysPanelOpen"
      :days="getAllDays"
      :selected-day-id="getSelectedDay?.id"
      @close="isDaysPanelOpen = false"
      @select-day="setCurrentDay"
      @add-new-day="addNewDay"
    />
  </div>
</template>

<style scoped lang="scss">
.controls {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}
.left-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.spacer {
  flex-grow: 1;
}

.menu-btn {
  background: transparent;
  border: 1px solid var(--border-secondary-color);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: var(--fg-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
  }
}

.current-day-info {
  cursor: pointer;
  h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
    font-family: 'Sansation';
  }
  span {
    color: var(--fg-secondary-color);
    text-transform: capitalize;
    font-family: 'Sansation';
    font-family: 500x;
  }
  &.readonly {
    cursor: default;
    pointer-events: none;
  }
}
</style>
