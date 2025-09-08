<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/kit-image-viewer'
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
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

      <button class="collapse-toggle-btn" @click="$emit('toggleCollapse')">
        <Icon :icon="isCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'" />
      </button>

      <div v-if="group.type === 'activity'" class="header-spacer" />
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
  gap: 12px;
  width: 100%;
  border-radius: var(--r-xs) var(--r-l) var(--r-l) var(--r-xs);
  min-height: 40px;

  .activity-time {
    background-color: var(--bg-secondary-color);
    padding: 2px 10px;
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-s);

    > span {
      white-space: nowrap;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--fg-secondary-color);
    }
  }

  .collapse-toggle-btn {
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
    opacity: 0;

    &:hover {
      background-color: var(--bg-hover-color);
      color: var(--fg-primary-color);
    }
  }

  .header-spacer {
    flex-grow: 1;
  }

  &:hover {
    .collapse-toggle-btn {
      opacity: 1;
    }
  }

  @include media-down(sm) {
    .collapse-toggle-btn {
      opacity: 1;
    }
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
