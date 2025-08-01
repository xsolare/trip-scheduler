<script setup lang="ts">
import type { Activity } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { onClickOutside } from '@vueuse/core'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { TimeField } from '~/components/01.kit/time-field'

interface ActivityItemProps {
  activity: Activity
}

const props = defineProps<ActivityItemProps>()
const emit = defineEmits(['update', 'delete'])

const isTimeEditing = ref(false)
const timeEditorRef = ref<HTMLElement | null>(null)

const editingStartTime = shallowRef<Time | null>(null)
const editingEndTime = shallowRef<Time | null>(null)

function updateActivity(newActivityData: Partial<Activity>) {
  emit('update', { ...props.activity, ...newActivityData })
}

// function deleteActivity() {
//   emit('delete', props.activity.id)
// }

function parseTime(timeStr: string): Time {
  const [hour, minute] = timeStr.split(':').map(Number)
  return new Time(hour, minute)
}

function editTime() {
  isTimeEditing.value = true
  editingStartTime.value = parseTime(props.activity.startTime)
  editingEndTime.value = parseTime(props.activity.endTime)
}

function saveTimeChanges() {
  if (!isTimeEditing.value)
    return

  const newStartTime = `${editingStartTime.value?.hour.toString().padStart(2, '0')}:${editingStartTime.value?.minute.toString().padStart(2, '0')}`
  const newEndTime = `${editingEndTime.value?.hour.toString().padStart(2, '0')}:${editingEndTime.value?.minute.toString().padStart(2, '0')}`

  updateActivity({ startTime: newStartTime, endTime: newEndTime })
  isTimeEditing.value = false
}

function cancelTimeEditing() {
  isTimeEditing.value = false
}

onClickOutside(timeEditorRef, saveTimeChanges)
</script>

<template>
  <div class="activity-item">
    <div class="drag-handle" />

    <div class="activity-header">
      <div class="activity-time">
        <!-- Режим редактирования -->
        <div
          v-if="isTimeEditing"
          ref="timeEditorRef"
          class="time-editor"
          @keydown.esc.prevent="cancelTimeEditing"
        >
          <TimeField
            v-if="editingStartTime"
            v-model="editingStartTime"
          />
          <span class="time-separator">-</span>
          <TimeField
            v-if="editingEndTime"
            v-model="editingEndTime"
          />
        </div>

        <!-- Режим отображения -->
        <div v-else class="time-display" @click="editTime">
          {{ activity.startTime }} - {{ activity.endTime }}
        </div>
      </div>
    </div>

    <div class="activity-title">
      <Icon icon="mdi:chevron-right" />
      <InlineEditorWrapper
        :model-value="activity.title"
        placeholder="Описание активности"
        class="activity-title-editor"
        :features="{ 'block-edit': false }
        "@update:model-value="newDesc => updateActivity({ title: newDesc })"
      />
    </div>

    <div class="activity-sections">
      <!-- NOT IMPLEMENTED -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
  margin: 32px 0;

  &:hover {
    .activity-header {
      .activity-time {
        width: 140px;

        &::before {
          opacity: 1;
          color: var(--fg-accent-color);
        }
      }
    }

    .activity-sections {
      box-shadow: 0 2px 8px var(--border-secondary-color);

      &::before {
        background-color: var(--fg-accent-color);
      }
    }
  }

  .drag-handle {
    position: absolute;
    left: -19px;
    width: 18px;
    top: 50%;
    height: 100%;
    transform: translateY(-50%);
    cursor: grab;
    padding: 8px;

    &:active {
      cursor: grabbing;
    }
  }

  .activity-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .activity-time {
      position: relative;
      line-height: normal;
      font-weight: 600;
      color: var(--fg-accent-color);
      padding: 4px;

      &::before {
        position: absolute;
        left: -15px;
        top: 6px;
        content: '✦';
        color: var(--fg-accent-color);
        font-size: 0.8rem;
        color: var(--fg-secondary-color);
        opacity: 0.5;
        transition:
          color 0.2s ease,
          opacity 0.2s ease;
      }
      .time-display {
        cursor: pointer;
        padding: 2px 4px;
        margin: -2px -4px;
        border-radius: 4px;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: var(--bg-hover-color);
        }
      }

      .time-editor {
        display: flex;
        align-items: center;
        gap: 4px;

        .time-separator {
          color: var(--fg-secondary-color);
          padding: 0 2px;
        }
      }
    }
  }

  .activity-title {
    display: flex;
    gap: 8px;
    color: var(--fg-primary-color);

    .iconify {
      height: 24px;
      opacity: 0.5;
      color: var(--fg-secondary-color);
    }

    &-editor {
      width: 100%;

      :deep(.milkdown) {
        > div {
          flex-grow: 1;
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          padding: 0;
          color: var(--fg-primary-color);
        }
      }
    }
  }

  .activity-content {
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--border-secondary-color);
    padding: 0;
    border-radius: 8px;
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
    position: relative;
    overflow: visible !important;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &::before {
    position: absolute;
    left: -10px;
    top: 30px;
    content: '';
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
    height: calc(100% - 30px);
    width: 2px;
    background-color: var(--border-secondary-color);
    transition: background-color 0.2s ease;
  }
}
</style>
