<script setup lang="ts">
import type { ChecklistItem } from '../models/types'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { KitCheckbox } from '~/components/01.kit/kit-checkbox'
import { KitEditable } from '~/components/01.kit/kit-editable'

interface Props {
  item: ChecklistItem
  readonly: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:item', value: ChecklistItem): void
  (e: 'delete'): void
}>()

const isEditingDescription = ref(false)
const isEditingLink = ref(false)

function updateField<K extends keyof ChecklistItem>(key: K, value: ChecklistItem[K]) {
  emit('update:item', { ...props.item, [key]: value })
}

function togglePriority() {
  const newPriority = props.item.priority === 'high' ? 'normal' : 'high'
  updateField('priority', newPriority)
}

function handleDescriptionUpdate(value: string) {
  updateField('description', value)
  if (!value)
    isEditingDescription.value = false
}

function handleLinkUpdate(value: string) {
  updateField('link', value)
  if (!value)
    isEditingLink.value = false
}
</script>

<template>
  <div class="checklist-item-wrapper">
    <div class="checklist-item" :class="{ 'completed': item.completed, 'priority-high': item.priority === 'high' }">
      <div class="main-line">
        <button v-if="!readonly" class="drag-handle" title="Перетащить">
          <Icon icon="mdi:drag-vertical" />
        </button>
        <KitCheckbox
          :model-value="item.completed"
          color="accent"
          :readonly="readonly"
          @update:model-value="updateField('completed', !!$event)"
        />
        <KitEditable
          :model-value="item.text"
          :readonly="readonly"
          class="item-text"
          @update:model-value="updateField('text', $event)"
        />
        <div class="item-actions">
          <button v-if="!readonly" class="action-btn" :class="{ 'is-active': item.link }" title="Добавить/Изменить ссылку" @click="isEditingLink = !isEditingLink">
            <Icon icon="mdi:paperclip" />
          </button>
          <button v-if="!readonly" class="action-btn" :class="{ 'is-active': item.description }" title="Добавить/Изменить заметку" @click="isEditingDescription = !isEditingDescription">
            <Icon icon="mdi:text-box-outline" />
          </button>
          <button v-if="!readonly" class="action-btn priority-btn" :class="{ 'is-active': item.priority === 'high' }" title="Высокий приоритет" @click="togglePriority">
            <Icon icon="mdi:fire" />
          </button>
          <button v-if="!readonly" class="delete-item-btn" @click="$emit('delete')">
            <Icon icon="mdi:close" />
          </button>
        </div>
      </div>

      <div
        v-if="item.link || isEditingLink || item.description || isEditingDescription"
        class="item-details-container"
      >
        <!-- Блок для ссылки -->
        <div v-if="item.link || isEditingLink" class="detail-block">
          <Icon icon="mdi:link-variant" class="detail-icon" />
          <KitEditable
            v-if="isEditingLink"
            :model-value="item.link || ''"
            placeholder="https://example.com"
            :readonly="readonly"
            class="details-input"
            @update:model-value="handleLinkUpdate"
          />
          <a v-else :href="item.link" target="_blank" rel="noopener noreferrer" class="detail-link">{{ item.link }}</a>
        </div>

        <!-- Блок для заметки -->
        <div v-if="item.description || isEditingDescription" class="detail-block">
          <Icon icon="mdi:text-box-outline" class="detail-icon" />
          <KitEditable
            v-if="isEditingDescription"
            :model-value="item.description || ''"
            placeholder="Добавить заметку..."
            type="textarea"
            :readonly="readonly"
            class="details-input"
            @update:model-value="handleDescriptionUpdate"
          />
          <div v-else class="detail-text">
            {{ item.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checklist-item {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary-color);
  border-radius: var(--r-s);
  transition: all 0.2s ease;
  border: 1px solid var(--border-secondary-color);
  padding: 0.375rem 0.5rem;

  &.priority-high {
    border-left: 3px solid var(--fg-warning-color);
    padding-left: calc(0.5rem - 3px);
  }

  &:hover {
    background-color: var(--bg-hover-color);
    .delete-item-btn,
    .drag-handle,
    .action-btn {
      opacity: 1;
    }
  }
}

.main-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 4px;
}

.completed {
  .item-text {
    text-decoration: line-through;
    color: var(--fg-tertiary-color);
  }
  background-color: var(--bg-secondary-color);
}

.drag-handle,
.delete-item-btn,
.action-btn {
  padding: 0;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--fg-tertiary-color);
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.drag-handle {
  cursor: grab;
  opacity: 0;
  &:active {
    cursor: grabbing;
  }
}

.item-text {
  flex-grow: 1;
  min-width: 0;
}

.item-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.action-btn {
  opacity: 0.4;
  &:hover {
    color: var(--fg-primary-color);
  }
  &.is-active {
    color: var(--fg-accent-color);
    opacity: 1;
  }
  &.priority-btn.is-active {
    color: var(--fg-warning-color);
  }
}

.delete-item-btn {
  opacity: 0;
  font-size: 1.2rem;
  &:hover {
    color: var(--fg-error-color);
  }
}

.item-details-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 8px;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-tertiary-color, var(--border-secondary-color));
}

.detail-block {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.detail-icon {
  font-size: 1rem;
  color: var(--fg-tertiary-color);
  flex-shrink: 0;
  margin-top: 8px;
}

.details-input {
  width: 100%;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--fg-secondary-color);
  background-color: var(--bg-secondary-color);
  padding: 4px 8px;
  border-radius: var(--r-xs);
  border: 1px solid transparent;
  &:focus-within {
    border-color: var(--fg-accent-color);
  }
}

.detail-link {
  font-size: 0.85rem;
  color: var(--fg-accent-color);
  text-decoration: none;
  word-break: break-all;
  padding-top: 4px;
  padding-bottom: 4px;

  &:hover {
    text-decoration: underline;
  }
}

.detail-text {
  width: 100%;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--fg-secondary-color);
  white-space: pre-wrap;
  word-break: break-word;
  padding: 8px 0;
}
</style>
