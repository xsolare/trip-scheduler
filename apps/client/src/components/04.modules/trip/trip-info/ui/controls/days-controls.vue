<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { Icon } from '@iconify/vue'
import { parseDate } from '@internationalized/date'
import { KitSkeleton } from '~/components/01.kit/kit-skeleton'
import { CalendarPopover } from '~/components/02.shared/calendar-popover'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'
import DaysPanel from './days-panel.vue'
import ModeSwitcher from './mode-switcher.vue'

const store = useModuleStore(['ui', 'data'])
const { isDaysPanelPinned, isDaysPanelOpen, isViewMode } = storeToRefs(store.ui)
const { getAllDays, getSelectedDay, isLoading, isLoadingNewDay } = storeToRefs(store.data)
const { setCurrentDay, updateDayDetails } = store.data

function handleAddNewDay() {
  store.data.addNewDay()
  if (!store.ui.isDaysPanelPinned)
    store.ui.closeDaysPanel()
}

function handleDeleteDay() {
  if (!getSelectedDay.value)
    return

  store.data.deleteDay()
}

const isDayInfoLoading = computed(() => isLoading.value || isLoadingNewDay.value)

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

    if (originalDate.startsWith(newDateString))
      return

    const newIsoDate = new Date(newDateString).toISOString()

    const occupiedDay = getAllDays.value.find(
      day => day.date.startsWith(newDateString) && day.id !== currentDay.id,
    )

    if (occupiedDay) {
      updateDayDetails(occupiedDay.id, { date: originalDate })
      updateDayDetails(currentDay.id, { date: newIsoDate })
    }
    else {
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

      <div v-if="isDayInfoLoading" class="current-day-info-skeleton">
        <KitSkeleton width="100px" height="20px" border-radius="6px" type="wave" />
        <KitSkeleton width="80px" height="18px" border-radius="6px" type="wave" />
      </div>
      <CalendarPopover v-else v-model="selectedCalendarDate" :disabled="isViewMode">
        <template #trigger>
          <div class="current-day-info" role="button" :class="{ readonly: isViewMode }">
            <h3 v-if="getSelectedDay">
              {{ new Date(getSelectedDay.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}
            </h3>
            <span v-if="getSelectedDay">
              {{ new Date(getSelectedDay.date).toLocaleDateString('ru-RU', { weekday: 'long' }) }}
            </span>
          </div>
        </template>
      </CalendarPopover>
    </div>
    <div class="spacer" />
    <div v-if="!isDayInfoLoading" class="right-controls">
      <TransitionGroup name="faded">
        <button
          v-if="!isViewMode"
          key="delete"
          class="delete-day-btn"
          title="Удалить текущий день"
          @click="handleDeleteDay"
        >
          <Icon icon="mdi:trash-can-outline" />
        </button>
        <ModeSwitcher key="mode" />
      </TransitionGroup>
    </div>

    <DaysPanel
      :is-open="isDaysPanelOpen"
      :days="getAllDays"
      :selected-day-id="getSelectedDay?.id"
      @close="isDaysPanelOpen = false"
      @select-day="setCurrentDay"
      @add-new-day="handleAddNewDay"
    />
  </div>
</template>

<style scoped lang="scss">
.controls {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  min-height: 80px;
  margin-top: 16px;
}
.left-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.right-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.spacer {
  flex-grow: 1;
}

.menu-btn {
  background: transparent;
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
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

.delete-day-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
  padding: 8px;
  cursor: pointer;
  color: var(--fg-secondary-color);
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-error-color);
    color: var(--fg-error-color);
    border-color: var(--border-error-color);
  }
}
.current-day-info-skeleton {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
