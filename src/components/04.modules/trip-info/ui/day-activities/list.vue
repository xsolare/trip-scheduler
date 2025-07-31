<script setup lang="ts">
import type { IActivity } from '../../models/types'
import draggable from 'vuedraggable'
import { useTrip } from '../../composables/use-trip'
import ActivityItem from './item.vue'

const tripComposable = useTrip()

const selectedDay = computed(() => tripComposable.getSelectedDay.value)
const activitiesForDay = computed(() => tripComposable.getActivitiesForSelectedDay.value)

const draggableActivities = computed({
  get: () => activitiesForDay.value,
  set: (newOrder: IActivity[]) => {
    if (selectedDay.value) {
      tripComposable.reorderActivities(selectedDay.value.id, newOrder)
    }
  },
})

function updateActivity(updatedActivity: IActivity) {
  if (selectedDay.value) {
    tripComposable.updateActivity(selectedDay.value.id, updatedActivity)
  }
}
</script>

<template>
  <div class="day-activities">
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
            @update="updateActivity"
          />
        </template>
      </draggable>

      <div v-if="activitiesForDay.length === 0" class="empty-state">
        <p>На этот день нет запланированных активностей</p>
        <button>
          Добавить активность
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
