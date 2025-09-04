<script setup lang="ts">
import type { ChecklistSectionContent } from '../composables'
import { Icon } from '@iconify/vue'
import draggable from 'vuedraggable'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitCheckbox } from '~/components/01.kit/kit-checkbox'
import { KitEditable } from '~/components/01.kit/kit-editable'
import { useChecklistSection } from '../composables'

// --- Типы ---
interface Props {
  section: {
    id: string
    type: 'checklist'
    content: ChecklistSectionContent
  }
  readonly: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['updateSection'])

// --- Логика из хука ---
const {
  items,
  newItemText,
  newItemInputRef,
  progress,
  addItem,
  deleteItem,
  updateItemText,
} = useChecklistSection(props, emit)
</script>

<template>
  <div class="checklist-section">
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }" />
      <span class="progress-text">{{ progress }}% выполнено</span>
    </div>

    <draggable
      :model-value="items"
      item-key="id"
      handle=".drag-handle"
      ghost-class="ghost-item"
      :disabled="readonly"
      class="checklist-items"
      @update:model-value="items = $event"
    >
      <template #item="{ element: item }">
        <div class="checklist-item" :class="{ completed: item.completed }">
          <button v-if="!readonly" class="drag-handle" title="Перетащить">
            <Icon icon="mdi:drag-vertical" />
          </button>
          <KitCheckbox
            v-model="item.completed"
            color="accent"
            :readonly="readonly"
          />
          <KitEditable
            :model-value="item.text"
            :readonly="readonly"
            class="item-text"
            @update:model-value="updateItemText(item.id, $event)"
          />
          <button v-if="!readonly" class="delete-item-btn" @click="deleteItem(item.id)">
            <Icon icon="mdi:close" />
          </button>
        </div>
      </template>
    </draggable>

    <form v-if="!readonly" class="add-item-form" @submit.prevent="addItem">
      <input
        ref="newItemInputRef"
        v-model="newItemText"
        type="text"
        placeholder="Добавить новый пункт..."
        class="add-item-input"
      >
      <KitBtn type="submit" icon="mdi:plus" :disabled="!newItemText.trim()">
        Добавить
      </KitBtn>
    </form>
  </div>
</template>

<style scoped lang="scss">
.checklist-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-bar-container {
  width: 100%;
  height: 24px;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-full);
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--fg-success-color);
  border-radius: var(--r-full);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--fg-inverted-color);
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  padding-left: 16px;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-s);
  transition: all 0.2s ease;

  &.completed {
    .item-text {
      text-decoration: line-through;
      color: var(--fg-tertiary-color);
    }
  }

  &:hover {
    background-color: var(--bg-hover-color);
    .delete-item-btn,
    .drag-handle {
      opacity: 1;
    }
  }
}

.drag-handle,
.delete-item-btn {
  padding: 0;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--fg-tertiary-color);
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 1.2rem;
}

.drag-handle {
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}

.item-text {
  flex-grow: 1;
  margin-left: 0;
}

.delete-item-btn {
  &:hover {
    color: var(--fg-error-color);
  }
}

.ghost-item {
  opacity: 0.5;
  background: var(--bg-accent-color);
}

.add-item-form {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.add-item-input {
  flex-grow: 1;
  padding: 0.75rem;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: var(--r-s);
  color: var(--fg-primary-color);
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: var(--border-focus-color);
  }
}
</style>
