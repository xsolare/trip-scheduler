<script setup lang="ts">
import type { Activity } from '../../models/activity'
import draggable from 'vuedraggable'
import { useTripStore } from '../../store/trip.store'
import ActivityItem from './item.vue'

const tripStore = useTripStore()

const selectedDay = computed(() => tripStore.getSelectedDay)
const activitiesForDay = computed(() => tripStore.getActivitiesForSelectedDay)

const draggableActivities = computed({
  get: () => activitiesForDay.value,
  set: (newOrder: Activity[]) => {
    if (selectedDay.value) {
      tripStore.reorderActivities(selectedDay.value.id, newOrder)
    }
  },
})

function updateActivity(updatedActivity: Activity) {
  if (selectedDay.value) {
    tripStore.updateActivity(selectedDay.value.id, updatedActivity)
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
