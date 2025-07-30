<script setup lang="ts">
import type { Activity } from '../models/activity'
import { Icon } from '@iconify/vue'
import draggable from 'vuedraggable'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { useTripStore } from '../store/trip.store'
import ActivityItem from './activity/activity-item.vue'

// 1. Используем новый стор
const tripStore = useTripStore()

// 2. Получаем данные из геттеров стора
const allDays = computed(() => tripStore.getAllDays)
const selectedDay = computed(() => tripStore.getSelectedDay)
const activitiesForDay = computed(() => tripStore.getActivitiesForSelectedDay)

// 3. Локальное состояние для диалоговых окон
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const currentActivity = ref<Activity | null>(null)

// 4. Двусторонняя привязка для vuedraggable
const draggableActivities = computed({
  get: () => activitiesForDay.value,
  set: (newOrder: Activity[]) => {
    if (selectedDay.value) {
      tripStore.reorderActivities(selectedDay.value.id, newOrder)
    }
  },
})

// --- Методы для взаимодействия с UI ---

function updateDayDetails(details: { title?: string, description?: string }) {
  if (selectedDay.value) {
    tripStore.updateDayDetails(selectedDay.value.id, details)
  }
}

function selectDay(dayId: string) {
  tripStore.setCurrentDay(dayId)
}

function openEditForm(activity: Activity) {
  currentActivity.value = activity
  showEditDialog.value = true
}

function deleteActivity(activityId: string) {
  if (selectedDay.value) {
    tripStore.removeActivity(selectedDay.value.id, activityId)
  }
}

function updateActivity(updatedActivity: Activity) {
  if (selectedDay.value) {
    tripStore.updateActivity(selectedDay.value.id, updatedActivity)
  }
}

function addNewActivity() {
  showAddDialog.value = true
}
</script>

<template>
  <div v-if="tripStore.days.length" class="trip-content">
    <!-- Селектор дней стал компактнее и работает с объектами Day -->
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
        <button
          class="g-button-success"
          @click="addNewActivity"
        >
          <Icon icon="mdi:plus" />
        </button>
      </div>
    </div>

    <!-- Блок с заголовком и описанием дня -->
    <div v-if="selectedDay" class="day-header">
      <InlineEditorWrapper
        :model-value="selectedDay.title"
        placeholder="Название дня"
        class="day-title"

        @update:model-value="newTitle => updateDayDetails({ title: newTitle })"
      />
      <InlineEditorWrapper
        :model-value="selectedDay.description || ''"
        placeholder="Добавьте описание"
        class="day-description"
        @update:model-value="newDesc => updateDayDetails({ description: newDesc })"
      />
    </div>

    <!-- Список активностей -->
    <div v-if="selectedDay" class="day-activities">
      <div class="activities-container">
        <draggable
          v-model="draggableActivities"
          ghost-class="ghost-activity"
          chosen-class="chosen-activity"
          animation="300"
          item-key="id"
          handle=".drag-handle"
        >
          <template #item="{ element: activity }">
            <ActivityItem
              :activity="activity"
              @edit="openEditForm"
              @delete="deleteActivity(activity.id)"
              @update="updateActivity"
            />
          </template>
        </draggable>

        <div v-if="activitiesForDay.length === 0" class="empty-state">
          <p>На этот день нет запланированных активностей</p>
          <button
            class="g-button-outlined"
            @click="addNewActivity"
          >
            Добавить активность
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="trip-content-empty">
    <p>Пока не создано ни одного дня для вашего путешествия.</p>
    <button class="g-button-primary">
      Создать первый день
    </button>
  </div>
</template>

<style scoped lang="scss">
.trip-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-secondary-color);

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

  .day-header {
    padding: 0px;
    background-color: var(--bg-secondary-color);
    border-radius: 8px;
    border: 1px solid var(--border-secondary-color);

    .day-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--fg-primary-color);
      margin: 0 0 8px 0;
    }

    .day-description {
      font-size: 1rem;
      color: var(--fg-secondary-color);
      margin: 0;
      line-height: 1.5;
    }
  }

  .day-activities {
    .activities-container {
      width: 100%;
      position: relative;

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        border: 2px dashed var(--border-secondary-color);
        border-radius: 8px;
        margin-top: 20px;

        p {
          margin-bottom: 20px;
          color: var(--fg-secondary-color);
        }
      }
    }
  }
}

.trip-content-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--fg-secondary-color);
}

.ghost-activity {
  opacity: 0.5;
  background: var(--bg-secondary-color);
  border-radius: 6px;
  > div {
    visibility: hidden;
  }
}

.chosen-activity {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
  z-index: 10;
}
</style>
