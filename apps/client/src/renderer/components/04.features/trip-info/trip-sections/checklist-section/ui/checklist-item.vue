<script setup lang="ts">
import type { ChecklistItem } from '../models/types'
import { Icon } from '@iconify/vue'
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

function updateField<K extends keyof ChecklistItem>(key: K, value: ChecklistItem[K]) {
  emit('update:item', { ...props.item, [key]: value })
}
</script>

<template>
  <div class="checklist-item" :class="{ completed: item.completed }">
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
    <button v-if="!readonly" class="delete-item-btn" @click="$emit('delete')">
      <Icon icon="mdi:close" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  background-color: var(--bg-primary-color);
  border-radius: var(--r-s);
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &.completed {
    .item-text {
      text-decoration: line-through;
      color: var(--fg-tertiary-color);
    }
  }

  &:hover {
    background-color: var(--bg-hover-color);
    border-color: var(--border-secondary-color);
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
}

.delete-item-btn {
  &:hover {
    color: var(--fg-error-color);
  }
}
</style>
