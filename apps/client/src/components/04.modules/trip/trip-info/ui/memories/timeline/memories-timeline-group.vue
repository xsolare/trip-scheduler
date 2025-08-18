<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/kit-image-viewer'
import type { Activity } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { KitDropdown } from '~/components/01.kit/kit-dropdown'
import { EActivityStatus } from '~/shared/types/models/activity'
import MemoriesItem from './memories-timeline-item.vue'

interface TimelineGroup {
  type: 'start' | 'activity' | 'end' | 'unlinked'
  title: string
  memories: any[]
  activity?: Activity
}
type TimelineGroups = TimelineGroup[]

const props = defineProps<{
  group: TimelineGroup
  isViewMode: boolean
  galleryImages: ImageViewerImage[]
  timelineGroups: TimelineGroups
}>()

const emit = defineEmits<{
  (e: 'updateActivity', payload: { activity: Activity, data: Partial<Activity> }): void
}>()

const isCollapsed = ref(false)

const statusOptions: { value: EActivityStatus, label: string, icon: string }[] = [
  { value: EActivityStatus.COMPLETED, label: 'Пройден', icon: 'mdi:check-circle-outline' },
  { value: EActivityStatus.SKIPPED, label: 'Пропущен', icon: 'mdi:close-circle-outline' },
  { value: EActivityStatus.NONE, label: 'Не указан', icon: 'mdi:circle-outline' },
]

const statusInfo = computed(() => {
  return (status: EActivityStatus) => {
    return statusOptions.find(o => o.value === status) || statusOptions.find(o => o.value === EActivityStatus.NONE)!
  }
})

function handleUpdateActivity(data: Partial<Activity>) {
  if (!props.group.activity)
    return

  emit('updateActivity', { activity: props.group.activity, data })
}
</script>

<template>
  <div class="activity-timeline-node" :class="{ 'is-collapsed': isCollapsed }">
    <div class="activity-header">
      <div class="activity-time">
        <span>{{ group.activity ? group.activity.startTime : '...' }}</span>
      </div>
      <button class="collapse-toggle-btn" @click="isCollapsed = !isCollapsed">
        <Icon :icon="isCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'" />
      </button>
      <div class="header-spacer" />
      <div v-if="group.type === 'activity' && group.activity" class="activity-header-controls">
        <template v-if="!isViewMode">
          <KitDropdown
            :items="statusOptions"
            :model-value="group.activity.status"
            @update:model-value="(status: EActivityStatus) => handleUpdateActivity({ status })"
          >
            <template #trigger>
              <div
                class="status-badge"
                :class="`status-${group.activity.status}`"
                :title="statusInfo(group.activity.status).label"
              >
                <Icon :icon="statusInfo(group.activity.status).icon" class="status-icon" />
                <span class="status-text">{{ statusInfo(group.activity.status).label }}</span>
              </div>
            </template>
          </KitDropdown>

          <KitDropdown>
            <template #trigger>
              <div class="rating-control" :class="{ 'has-rating': group.activity.rating }">
                <div class="rating-stars">
                  <template v-if="!!group.activity.rating">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      :icon="group.activity.rating && group.activity.rating >= i ? 'mdi:star' : 'mdi:star-outline'"
                      class="star"
                      height="14"
                      width="14"
                      :class="{ filled: group.activity.rating && group.activity.rating >= i }"
                    />
                  </template>
                </div>
                <span v-if="!group.activity.rating" class="rating-placeholder">Оценить</span>
              </div>
            </template>
            <div class="rating-picker">
              <div class="rating-picker-header">
                Оценка события
              </div>
              <div class="rating-options">
                <button
                  v-for="i in 5"
                  :key="i"
                  class="star-btn"
                  :class="{ active: group.activity.rating && group.activity.rating >= i }"
                  @click="handleUpdateActivity({ rating: i === group.activity.rating ? null : i })"
                >
                  <Icon :icon="group.activity.rating && group.activity.rating >= i ? 'mdi:star' : 'mdi:star-outline'" />
                </button>
              </div>
              <button
                v-if="group.activity.rating"
                class="clear-rating-btn"
                @click="handleUpdateActivity({ rating: null })"
              >
                Очистить оценку
              </button>
            </div>
          </KitDropdown>
        </template>
        <template v-else>
          <div
            v-if="group.activity.status !== EActivityStatus.NONE"
            class="status-badge"
            :class="`status-${group.activity.status}`"
            :title="statusInfo(group.activity.status).label"
            style="cursor: default;"
          >
            <Icon :icon="statusInfo(group.activity.status).icon" class="status-icon" />
            <span class="status-text">{{ statusInfo(group.activity.status).label }}</span>
          </div>
          <div v-if="group.activity.rating" class="rating-control has-rating" style="cursor: default;">
            <div class="rating-stars">
              <Icon
                v-for="i in 5"
                :key="i"
                :icon="group.activity.rating && group.activity.rating >= i ? 'mdi:star' : 'mdi:star-outline'"
                class="star"
                height="14"
                width="14"
                :class="{ filled: group.activity.rating && group.activity.rating >= i }"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-show="!isCollapsed" class="collapsible-content">
      <h5 class="activity-title">
        {{ group.title }}
      </h5>

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
    padding: 4px 10px;
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-s);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--fg-secondary-color);
    white-space: nowrap;
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
  margin: 8px 0 20px;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 8px;
}

.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 10px;
  border-radius: var(--r-full);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  height: 28px;
  font-family: 'Sansation';

  .status-icon {
    font-size: 1.1rem;
  }

  .status-text {
    display: none;

    @include media-up(sm) {
      display: inline;
      white-space: nowrap;
      font-family: 'Sansation';
      font-size: 0.8rem;
    }
  }

  &.status-completed {
    background-color: var(--bg-success-color);
    color: var(--fg-success-color);

    .status-text {
      color: var(--fg-success-color);
    }
    .status-icon {
      color: var(--fg-success-color);
    }
  }

  &.status-skipped {
    background-color: var(--bg-error-color);
    color: var(--fg-error-color);

    .status-text {
      color: var(--fg-error-color);
    }
    .status-icon {
      color: var(--fg-error-color);
    }
  }

  &.status-none {
    background: var(--bg-secondary-color);
    color: var(--fg-primary-color);

    .status-text {
      color: var(--fg-secondary-color);
    }
    .status-icon {
      color: var(--fg-secondary-color);
    }
  }
}

.rating-control {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  background: var(--bg-secondary-color);
  border-radius: var(--r-full);
  cursor: pointer;
  transition: all 0.25s ease;
  height: 28px;
  min-width: 80px;

  &:hover {
    border-color: #f1c40f;

    .rating-placeholder {
      color: #f1c40f;
    }
  }

  &.has-rating {
    border-color: #f1c40f;
    background: linear-gradient(90deg, rgba(241, 196, 15, 0.15), rgba(241, 196, 15, 0.05));

    .star.filled {
      color: #f1c40f;
      filter: drop-shadow(0 0 2px rgba(241, 196, 15, 0.6));
    }
  }

  .rating-stars {
    display: flex;
    align-items: center;
    gap: 2px;

    .star {
      color: var(--fg-tertiary-color);
      font-size: 15px;
      transition:
        transform 0.15s ease,
        color 0.2s ease;

      &.filled {
        color: #f1c40f;
      }

      &:hover {
        transform: scale(1.15);
      }
    }
  }

  .rating-placeholder {
    font-size: 0.78rem;
    color: var(--fg-secondary-color);
    font-weight: 500;
    font-family: 'Sansation';
    transition: color 0.2s ease;
    white-space: nowrap;
  }
}

:deep(.kit-dropdown-content) {
  min-width: 200px;
}
.rating-picker {
  padding: 12px;

  .rating-picker-header {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--fg-primary-color);
    margin-bottom: 12px;
    text-align: center;
  }

  .rating-options {
    display: flex;
    justify-content: center;
    gap: 4px;
  }

  .star-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    font-size: 1.6rem;
    color: var(--fg-tertiary-color);
    transition: all 0.2s ease;
    border-radius: var(--r-s);

    &:hover {
      transform: scale(1.2);
      background-color: var(--bg-hover-color);
    }
    &.active {
      color: #f1c40f;
    }
  }

  .clear-rating-btn {
    width: 100%;
    padding: 8px;
    background: none;
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-xs);
    color: var(--fg-secondary-color);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 12px;

    &:hover {
      background-color: var(--bg-hover-color);
      border-color: var(--fg-accent-color);
      color: var(--fg-accent-color);
    }
  }
}

.memories-for-activity {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
