<script setup lang="ts">
import type { IActivity } from '../../models/types'
import { Icon } from '@iconify/vue'
import {KitDivider} from '~/components/01.kit/kit-divider'
import { EActivityStatus } from '~/shared/types/models/activity'
import { useModuleStore } from '../../composables/use-module'
import { minutesToTime, timeToMinutes } from '../../lib/helpers'
import { EActivityTag } from '../../models/types'
import DayMetaBadges from '../day-meta-badges.vue'
import DayActivitiesList from './list.vue'

const store = useModuleStore(['data', 'ui'])

const { getActivitiesForSelectedDay, getSelectedDay } = storeToRefs(store.data)
const { isViewMode, areAllActivitiesCollapsed } = storeToRefs(store.ui)

function handleAddNewActivity() {
  if (!getSelectedDay.value)
    return

  const lastActivity = getActivitiesForSelectedDay.value.at(-1)
  const startTimeMinutes = lastActivity ? timeToMinutes(lastActivity.endTime) + 15 : 9 * 60 // 9:00
  const endTimeMinutes = startTimeMinutes + 60

  const newActivity: Omit<IActivity, 'id'> = {
    dayId: getSelectedDay.value.id,
    title: 'Новая активность',
    startTime: minutesToTime(startTimeMinutes),
    endTime: minutesToTime(endTimeMinutes),
    tag: EActivityTag.ATTRACTION,
    sections: [],
    status: EActivityStatus.NONE,
  }

  store.data.addActivity(getSelectedDay.value.id, newActivity)
}

// --- Логика для сворачивания ---
const allActivityIds = computed(() => getActivitiesForSelectedDay.value.map(a => a.id))
const allRouteBlocksCollapsed = computed(() => areAllActivitiesCollapsed.value(allActivityIds.value))
const collapseRouteIcon = computed(() =>
  allRouteBlocksCollapsed.value ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up',
)
function handleToggleAllActivities() {
  store.ui.toggleAllActivities(allActivityIds.value)
}
</script>

<template>
  <div class="plan-view">
    <div class="divider-with-action">
      <KitDivider :is-loading="store.data.isLoadingUpdateActivity">
        маршрут
      </KitDivider>
      <button
        v-if="isViewMode && getSelectedDay?.meta?.length"
        class="collapse-all-btn"
        title="Свернуть/развернуть все активности"
        @click="handleToggleAllActivities"
      >
        <Icon :icon="collapseRouteIcon" />
      </button>
      <button
        v-if="isViewMode && allActivityIds.length > 0"
        class="collapse-all-btn"
        title="Свернуть/развернуть все активности"
        @click="handleToggleAllActivities"
      >
        <Icon :icon="collapseRouteIcon" />
      </button>
    </div>
    <DayActivitiesList @add="handleAddNewActivity" />

    <Divider v-if="getSelectedDay?.meta?.length || !isViewMode">
      мета-информация
    </Divider>

    <DayMetaBadges
      v-if="getSelectedDay && (getSelectedDay.meta?.length || !isViewMode)"
      :day-id="getSelectedDay.id"
      :meta="getSelectedDay.meta || []"
      :readonly="isViewMode"
      @update:meta="newMeta => store.data.updateDayDetails(getSelectedDay!.id, { meta: newMeta })"
    />
  </div>
</template>

<style scoped lang="scss">
.plan-view {
  position: relative;
}

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
