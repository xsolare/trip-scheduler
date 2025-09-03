<script setup lang="ts">
import type { Activity } from '~/shared/types/models/activity'
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
import { KitDivider } from '~/components/01.kit/kit-divider'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-trip-info-module'
import { timeToMinutes } from '~/components/05.modules/trip-info/lib/helpers'
import MemoriesList from './list.vue'

const { plan, ui, memories } = useModuleStore(['plan', 'ui', 'memories'])
const { getActivitiesForSelectedDay } = storeToRefs(plan)
const { areAllMemoryGroupsCollapsed } = storeToRefs(ui)

const timelineGroups = computed(() => {
  const activities = getActivitiesForSelectedDay.value
  const memoriesList = memories.memoriesForSelectedDay
  const groups: any[] = []

  if (memoriesList.length === 0 && activities.length === 0)
    return []

  const unlinkedMemories = memoriesList.filter((m: Memory) => !m.timestamp || (new Date(m.timestamp).getUTCHours() === 0 && new Date(m.timestamp).getUTCMinutes() === 0))
  const timedMemories = memoriesList.filter((m: Memory) => !unlinkedMemories.includes(m))

  const START_OF_DAY_MINUTES = 6 * 60 // 06:00

  const nightMemories = timedMemories.filter((m: Memory) => (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) < START_OF_DAY_MINUTES)
  if (nightMemories.length > 0)
    groups.push({ type: 'night', title: 'Ночь', memories: nightMemories })

  const firstActivityStart = activities.length > 0 ? timeToMinutes(activities[0].startTime) : Infinity
  const dayStartMemories = timedMemories.filter((m: Memory) => (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) >= START_OF_DAY_MINUTES && (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) < firstActivityStart)
  if (dayStartMemories.length > 0)
    groups.push({ type: 'start', title: 'Начало дня', memories: dayStartMemories })

  activities.forEach((activity: Activity, index: number) => {
    const start = timeToMinutes(activity.startTime)
    const end = activities[index + 1] ? timeToMinutes(activities[index + 1].startTime) : timeToMinutes(activity.endTime)
    const activityMemories = timedMemories.filter((m: Memory) => (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) >= start && (index === activities.length - 1 ? (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) <= end : (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) < end))
    groups.push({ type: 'activity', activity, title: activity.title, memories: activityMemories })
  })

  const lastActivityEnd = activities.length > 0 ? timeToMinutes(activities[activities.length - 1].endTime) : -1
  const dayEndMemories = timedMemories.filter((m: Memory) => (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) > lastActivityEnd && (new Date(m.timestamp!).getUTCHours() * 60 + new Date(m.timestamp!).getUTCMinutes()) >= START_OF_DAY_MINUTES)
  if (dayEndMemories.length > 0)
    groups.push({ type: 'end', title: 'Завершение дня', memories: dayEndMemories })

  if (unlinkedMemories.length > 0)
    groups.push({ type: 'unlinked', title: 'Прочие воспоминания за этот день', memories: unlinkedMemories })

  return groups
})

const allMemoryGroupKeys = computed(() => timelineGroups.value.map(g => g.type + (g.activity?.id || g.title)))
const allMemoryBlocksCollapsed = computed(() => areAllMemoryGroupsCollapsed.value(allMemoryGroupKeys.value))
const collapseMemoriesIcon = computed(() =>
  allMemoryBlocksCollapsed.value ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up',
)
function handleToggleAllMemories() {
  ui.toggleAllMemoryGroups(allMemoryGroupKeys.value)
}
</script>

<template>
  <div class="memories-view">
    <div class="divider-with-action">
      <KitDivider
        :is-loading="memories.isLoadingMemories || memories.isCreatingMemory"
      >
        воспоминания дня
      </KitDivider>
      <button
        v-if="allMemoryGroupKeys.length > 0"
        class="collapse-all-btn"
        title="Свернуть/развернуть все группы"
        @click="handleToggleAllMemories"
      >
        <Icon :icon="collapseMemoriesIcon" />
      </button>
    </div>

    <MemoriesList />
  </div>
</template>

<style scoped lang="scss">
.divider-with-action {
  position: relative;
  display: flex;
  align-items: center;

  .kit-divider {
    flex-grow: 1;
  }

  .collapse-all-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bg-secondary-color);
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-s);
    color: var(--fg-secondary-color);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    z-index: 1;

    &:hover {
      color: var(--fg-accent-color);
      border-color: var(--fg-accent-color);
      background-color: var(--bg-hover-color);
    }
  }
}
</style>
