<script setup lang="ts">
import type { IActivity } from '../../models/types'
import draggable from 'vuedraggable'
import { minutesToTime, timeToMinutes } from '../../lib/helpers'
import { EActivityTag } from '../../models/types'
import { useTripStore } from '../../store/trip-store'
import ActivityItem from './item.vue'

const tripStore = useTripStore()
const { getActivitiesForSelectedDay, getSelectedDay } = storeToRefs(tripStore)
const { reorderActivities, updateActivity, removeActivity, addActivity } = tripStore

const draggableActivities = computed({
  get: () => getActivitiesForSelectedDay.value,
  set: (newOrder: IActivity[]) => {
    if (getSelectedDay.value)
      reorderActivities(getSelectedDay.value.id, newOrder)
  },
})

function onUpdateActivity(updatedActivity: IActivity) {
  if (getSelectedDay.value)
    updateActivity(getSelectedDay.value.id, updatedActivity)
}

function onDeleteActivity(activityId: string) {
  if (getSelectedDay.value)
    removeActivity(getSelectedDay.value.id, activityId)
}

defineExpose({
  handleAddNewActivity: () => {
    if (!getSelectedDay.value)
      return

    const lastActivity = getActivitiesForSelectedDay.value.at(-1)
    const startTimeMinutes = lastActivity ? timeToMinutes(lastActivity.endTime) + 15 : 9 * 60 // 9:00
    const endTimeMinutes = startTimeMinutes + 60

    const newActivity: Omit<IActivity, 'id'> = {
      title: 'Новая активность',
      startTime: minutesToTime(startTimeMinutes),
      endTime: minutesToTime(endTimeMinutes),
      tag: EActivityTag.ATTRACTION,
      sections: [],
    }
    addActivity(getSelectedDay.value.id, newActivity)
  },
})
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
        class="draggable-area"
      >
        <template #item="{ element: activity }">
          <ActivityItem
            :activity="activity"
            @update="onUpdateActivity"
            @delete="onDeleteActivity"
          />
        </template>
      </draggable>

      <div v-if="getActivitiesForSelectedDay.length === 0" class="empty-state">
        <p>На этот день нет запланированных активностей</p>
        <button class="g-button" @click="$emit('add')">
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
    min-height: 100px;

    .draggable-area {
      min-height: 1px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      border: 2px dashed var(--border-secondary-color);
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;

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
