<script setup lang="ts">
import type { Activity } from '~/components/04.modules/trip/models/activity'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { timeToMinutes } from '~/components/04.modules/trip/models/activity'

interface ActivityItemProps {
  activity: Activity
}

const props = defineProps<ActivityItemProps>()
const emit = defineEmits(['edit', 'delete', 'update'])

const showDetails = ref(true)
const isTimeEditing = ref(false)
const timeEditorRef = ref<HTMLElement | null>(null)
const editableStartTime = ref('')
const editableEndTime = ref('')

function handleEdit() {
  emit('edit', props.activity)
}

function handleDelete() {
  // eslint-disable-next-line no-alert
  if (confirm('Вы уверены, что хотите удалить эту активность?')) {
    emit('delete', props.activity.id)
  }
}

function updateActivity(newActivityData: Partial<Activity>) {
  emit('update', { ...props.activity, ...newActivityData })
}

function toggleDetails() {
  showDetails.value = !showDetails.value
}

function startTimeEditing() {
  editableStartTime.value = props.activity.startTime
  editableEndTime.value = props.activity.endTime
  isTimeEditing.value = true
}

function cancelTimeEditing() {
  isTimeEditing.value = false
}

function saveTimeChanges() {
  if (timeToMinutes(editableStartTime.value) >= timeToMinutes(editableEndTime.value)) {
    console.warn('Время окончания должно быть больше времени начала.')
    return
  }

  emit('update', {
    ...props.activity,
    startTime: editableStartTime.value,
    endTime: editableEndTime.value,
  })
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
          <input v-model="editableStartTime" type="time" class="time-input">
          <span class="time-separator">-</span>
          <input
            v-model="editableEndTime"
            type="time"
            class="time-input"
            @keydown.enter.prevent="saveTimeChanges"
          >
        </div>

        <!-- Режим отображения -->
        <div v-else class="time-display" @click="startTimeEditing">
          {{ activity.startTime }} - {{ activity.endTime }}
        </div>
      </div>

      <div class="activity-actions">
        <button class="icon-button" @click="handleEdit">
          <i class="pi pi-pencil" />
        </button>
        <button class="icon-button delete" @click="handleDelete">
          <i class="pi pi-trash" />
        </button>
        <button class="icon-button" @click="toggleDetails">
          <i :class="showDetails ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" />
        </button>
      </div>
    </div>

    <div class="activity-content">
      <InlineEditorWrapper
        :model-value="activity.description"
        placeholder="Описание активности"
        class="activity-title"
        @update:model-value="newDesc => updateActivity({ description: newDesc })"
      />
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
  margin: 12px 0;

  &:hover {
    .activity-header {
      .activity-time {
        &::before {
          opacity: 1;
          color: var(--fg-accent-color);
        }
      }
    }

    .activity-content {
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
    }

    .activity-actions {
      display: flex;
      gap: 4px;

      .icon-button {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--fg-secondary-color);
        transition: all 0.2s ease;
        border-radius: 50%;

        &:hover {
          color: var(--fg-accent-color);
          background-color: var(--bg-hover-color);
        }

        &.delete:hover {
          color: var(--red-500);
        }
      }
    }
  }

  .activity-content {
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--border-secondary-color);
    padding: 0px;
    border-radius: 8px;
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
    position: relative;
    overflow: visible !important;

    &::before {
      position: absolute;
      left: -12px;
      top: 0px;
      content: '';
      color: var(--fg-accent-color);
      font-size: 0.8rem;
      color: var(--fg-secondary-color);
      height: 100%;
      width: 2px;
      background-color: var(--border-secondary-color);
      transition: background-color 0.2s ease;
    }

    .activity-title {
      font-size: 1rem;
      font-weight: 400;
      margin: 0;
      color: var(--fg-primary-color);
    }
  }
}
</style>
