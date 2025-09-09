<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/kit-image-viewer'
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-trip-info-module'
import { getTagInfo } from '~/components/05.modules/trip-info/lib/helpers'
import MemoriesItem from './memories-timeline-item.vue'

interface TimelineGroup {
  type: 'start' | 'activity'
  title: string
  memories: Memory[]
  activity: Memory | null
}

type TimelineGroups = TimelineGroup[]

interface Props {
  group: TimelineGroup
  isViewMode: boolean
  galleryImages: ImageViewerImage[]
  timelineGroups: TimelineGroups
  isCollapsed: boolean
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'toggleCollapse'): void
}>()

const { memories: memoriesStore } = useModuleStore(['memories'])
const confirm = useConfirm()

async function handleDeleteActivity() {
  if (!props.group.activity)
    return

  const isConfirmed = await confirm({
    title: `Удалить активность "${props.group.title}"?`,
    description: 'Связанные с ней фото и заметки будут перемещены в предыдущую группу в ленте. Это действие нельзя отменить.',
    type: 'danger',
    confirmText: 'Удалить',
  })

  if (isConfirmed)
    await memoriesStore.deleteMemory(props.group.activity.id)
}

const tagInfo = computed(() => {
  if (!props.group.activity?.tag)
    return null
  return getTagInfo(props.group.activity.tag)
})

const displayTime = computed(() => {
  if (!props.group.activity?.timestamp)
    return '...'

  const d = new Date(props.group.activity.timestamp)
  const hours = d.getUTCHours().toString().padStart(2, '0')
  const minutes = d.getUTCMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
})
</script>

<template>
  <div class="activity-timeline-node" :class="{ 'is-collapsed': isCollapsed }">
    <div class="activity-header">
      <div v-if="group.type === 'activity'" class="activity-time">
        <span>{{ displayTime }}</span>
      </div>

      <h5 v-if="group.type !== 'activity'" class="activity-title in-header">
        <Icon v-if="tagInfo" :icon="tagInfo.icon" class="title-icon" />
        {{ group.title }}
      </h5>

      <!-- This div will be pushed to the right -->
      <div class="activity-header-actions">
        <button class="collapse-toggle-btn" @click="$emit('toggleCollapse')">
          <Icon :icon="isCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'" />
        </button>

        <button
          v-if="!isViewMode && group.type === 'activity'"
          class="delete-activity-btn"
          title="Удалить активность"
          @click.stop="handleDeleteActivity"
        >
          <Icon icon="mdi:trash-can-outline" />
        </button>
      </div>
    </div>

    <h5 v-if="group.type === 'activity'" class="activity-title">
      <Icon v-if="tagInfo" :icon="tagInfo.icon" class="title-icon" />
      {{ group.title }}
    </h5>

    <div v-show="!isCollapsed" class="collapsible-content">
      <div v-if="group.activity?.sourceActivityId" class="imported-badge">
        <Icon width="18" height="18" icon="mdi:import" />
        <span>Взято из плана</span>
      </div>

      <div v-if="group.memories.length > 0" class="memories-for-activity">
        <MemoriesItem
          v-for="memory in group.memories"
          :key="memory.id"
          :memory="memory"
          :is-view-mode="isViewMode"
          :gallery-images="galleryImages"
          :timeline-groups="timelineGroups"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity-timeline-node {
  position: relative;
  padding-left: 24px;
  border-left: 2px solid var(--border-secondary-color);
  padding-bottom: 24px;
  padding-top: 24px;
  transition: padding-bottom 0.3s ease;

  &.is-collapsed {
    padding-bottom: 0;

    .activity-title:not(.in-header) {
      margin-bottom: 0;
    }

    &:not(:last-child) {
      border-left-style: dashed;
    }
  }

  &::before {
    content: '';
    position: absolute;
    left: -9px;
    top: 36px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--bg-secondary-color);
    border: 3px solid var(--fg-accent-color);
  }

  &:first-child {
    padding-top: 16px;

    &::before {
      top: 30px;
    }
  }

  &:last-child {
    margin-bottom: 32px;
  }

  @include media-down(sm) {
    padding-left: 12px;

    &::before {
      content: '';
      position: absolute;
      left: -7px;
      top: 38px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--bg-secondary-color);
      border: 3px solid var(--fg-accent-color);
    }
  }
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between; // Pushes children to ends
  gap: 12px;
  width: 100%;
  border-radius: var(--r-xs) var(--r-l) var(--r-l) var(--r-xs);
  min-height: 40px;

  .activity-time {
    background-color: var(--bg-secondary-color);
    padding: 2px 10px;
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-s);
    flex-shrink: 0; // Prevent shrinking

    > span {
      white-space: nowrap;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--fg-secondary-color);
    }
  }

  .activity-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .collapse-toggle-btn,
  .delete-activity-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--fg-secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .collapse-toggle-btn:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-primary-color);
  }

  .delete-activity-btn:hover {
    color: var(--fg-error-color);
    background-color: var(--bg-hover-color);
  }
}

.activity-title {
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 12px;
  transition: margin-bottom 0.3s ease;

  &.in-header {
    margin: 0;
  }

  .title-icon {
    font-size: 1.2rem;
    color: var(--fg-secondary-color);
  }
}

.imported-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: var(--bg-secondary-color);
  color: var(--fg-secondary-color);
  border-radius: var(--r-xs);
  margin-bottom: 20px;
  border: 1px solid var(--border-secondary-color);
  height: 34px;

  > span {
    font-size: 0.75rem;
    font-family: 'Sansation';
    line-height: 34px;
  }
}

.memories-for-activity {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 8px;

  @include media-down(sm) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>
