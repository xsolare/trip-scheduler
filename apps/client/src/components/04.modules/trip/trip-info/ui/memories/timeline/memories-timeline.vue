<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/kit-image-viewer'
import type { Activity } from '~/shared/types/models/activity'
import type { Memory } from '~/shared/types/models/memory'
import { computed } from 'vue'
import { timeToMinutes } from '~/components/04.modules/trip/trip-info/lib/helpers'
import MemoriesTimelineGroup from './memories-timeline-group.vue'

const props = defineProps<{
  activities: Activity[]
  memories: Memory[]
  isViewMode: boolean
  galleryImages: ImageViewerImage[]
}>()

const emit = defineEmits<{
  (e: 'updateActivity', payload: { activity: Activity, data: Partial<Activity> }): void
}>()

const timelineGroups = computed(() => {
  const activities = props.activities
  const memories = props.memories
  const groups: any[] = []

  if (memories.length === 0 && activities.length === 0)
    return []

  // 1. Отделяем воспоминания без конкретного времени (00:00)
  const unlinkedMemories = memories.filter((m) => {
    if (!m.timestamp)
      return true

    const time = new Date(m.timestamp!)

    return time.getUTCHours() === 0 && time.getUTCMinutes() === 0
  })

  const timedMemories = memories.filter(m => !unlinkedMemories.includes(m))

  const START_OF_DAY_MINUTES = 6 * 60 // 06:00
  const END_OF_DAY_MINUTES = (24 + 6) * 60 // 06:00 следующего дня

  // 2. Группа "Начало дня"
  const firstActivityStart = activities.length > 0 ? timeToMinutes(activities[0].startTime) : Infinity
  const dayStartMemories = timedMemories.filter((m) => {
    const memTime = new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()
    return memTime >= START_OF_DAY_MINUTES && memTime < firstActivityStart
  })
  if (dayStartMemories.length > 0) {
    groups.push({ type: 'start', title: 'Начало дня', memories: dayStartMemories })
  }

  // 3. Группировка по активностям
  activities.forEach((activity, index) => {
    const start = timeToMinutes(activity.startTime)
    const end = activities[index + 1] ? timeToMinutes(activities[index + 1].startTime) : timeToMinutes(activity.endTime)
    const activityMemories = timedMemories.filter((m) => {
      const memTime = new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()
      return memTime >= start && (index === activities.length - 1 ? memTime <= end : memTime < end)
    })
    groups.push({ type: 'activity', activity, title: activity.title, memories: activityMemories })
  })

  // 4. Группа "Завершение дня"
  const lastActivityEnd = activities.length > 0 ? timeToMinutes(activities[activities.length - 1].endTime) : -1
  const dayEndMemories = timedMemories.filter((m) => {
    const memTime = new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()
    return memTime > lastActivityEnd && memTime < END_OF_DAY_MINUTES
  })
  if (dayEndMemories.length > 0) {
    groups.push({ type: 'end', title: 'Завершение дня', memories: dayEndMemories })
  }

  // 5. Группа для воспоминаний без времени (00:00)
  if (unlinkedMemories.length > 0) {
    groups.push({ type: 'unlinked', title: 'Прочие воспоминания за этот день', memories: unlinkedMemories })
  }

  return groups
})

function onUpdateActivity(payload: { activity: Activity, data: Partial<Activity> }) {
  emit('updateActivity', payload)
}
</script>

<template>
  <div class="timeline-section">
    <MemoriesTimelineGroup
      v-for="group in timelineGroups"
      :key="group.type + (group.activity?.id || group.title)"
      :group="group"
      :is-view-mode="isViewMode"
      :gallery-images="galleryImages"
      :timeline-groups="timelineGroups"
      @update-activity="onUpdateActivity"
    />
  </div>
</template>

<style scoped lang="scss">
.timeline-section {
  display: flex;
  flex-direction: column;
}
</style>
