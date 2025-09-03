<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { IDay } from '../../models/types'
import { Icon } from '@iconify/vue'
import { parseDate } from '@internationalized/date'
import { KitSkeleton } from '~/components/01.kit/kit-skeleton'
import { CalendarPopover } from '~/components/02.shared/calendar-popover'
import { useModuleStore } from '../../composables/use-trip-info-module'
import DaysPanel from './days-panel.vue'
import ViewSwitcher from './view-switcher.vue'

const store = useModuleStore(['ui', 'plan'])
const { isDaysPanelPinned, isDaysPanelOpen, isViewMode, activeView, isEditModeAllow } = storeToRefs(store.ui)
const { getAllDays, getSelectedDay, isLoading, isLoadingNewDay } = storeToRefs(store.plan)
const { setCurrentDay, updateDayDetails } = store.plan

const buttonConfig = computed(() => {
  if (isViewMode.value) {
    return {
      icon: 'mdi:pencil-outline',
      title: 'Перейти в режим редактирования',
    }
  }
  return {
    icon: 'mdi:eye-outline',
    title: 'Перейти в режим просмотра',
  }
})

function toggleMode() {
  const newMode = isViewMode.value ? 'edit' : 'view'
  if (newMode === 'edit')
    store.ui.clearCollapsedState()

  store.ui.setInteractionMode(newMode)
}

function handleAddNewDay() {
  store.plan.addNewDay()
  if (!store.ui.isDaysPanelPinned)
    store.ui.closeDaysPanel()
}

function handleDeleteDay() {
  if (!getSelectedDay.value)
    return

  store.plan.deleteDay()
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
      (day: IDay) => day.date.startsWith(newDateString) && day.id !== currentDay.id,
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
        <button
          v-if="isEditModeAllow"
          key="mode"
          class="mode-button"
          :title="buttonConfig.title"
          @click="toggleMode"
        >
          <Icon :icon="buttonConfig.icon" />
        </button>
      </TransitionGroup>

      <div class="view-controls">
        <ViewSwitcher />
        <button
          v-if="isEditModeAllow"
          class="split-view-btn"
          title="Отобразить План и Воспоминания"
          :class="{ 'is-active': activeView === 'split' }"
          @click="store.ui.setActiveView('split')"
        >
          <Icon icon="mdi:view-split-vertical" />
        </button>
      </div>
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
  padding-bottom: 8px;
  min-height: 80px;
}
.left-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.right-controls {
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

/* --- Стили из mode-switcher --- */
.mode-button {
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
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }
}
/* --- Конец стилей из mode-switcher --- */

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

.view-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
  overflow: hidden;

  :deep(.kit-view-switcher) {
    border: none;
    border-radius: 0;
  }
}

.split-view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary-color);
  padding: 14px 8px;
  cursor: pointer;
  color: var(--fg-secondary-color);
  font-size: 1.2rem;
  transition: all 0.2s ease;
  border-left: 1px solid var(--border-secondary-color);

  &:hover {
    color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }

  &.is-active {
    background-color: var(--bg-accent-color-translucent);
    color: var(--fg-accent-color);
  }
}
</style>
