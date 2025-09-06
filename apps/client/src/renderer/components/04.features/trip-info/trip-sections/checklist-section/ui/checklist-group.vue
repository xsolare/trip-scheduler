<script setup lang="ts">
import type { ChecklistGroup, ChecklistItem } from '../models/types'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitEditable } from '~/components/01.kit/kit-editable'
import ChecklistIconPicker from './checklist-icon-picker.vue'
import ChecklistItemComponent from './checklist-item.vue'

interface Props {
  group: ChecklistGroup
  items: ChecklistItem[]
  readonly: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:group', value: ChecklistGroup): void
  (e: 'update:items', value: ChecklistItem[]): void
  (e: 'delete'): void
  (e: 'addItem', text: string): void
}>()

const newItemText = ref('')
const isIconPickerOpen = ref(false)
const isCollapsed = ref(false)

const groupProgress = computed(() => {
  const total = props.items.length
  if (total === 0)
    return { completed: 0, total: 0 }

  const completed = props.items.filter(item => item.completed).length
  return { completed, total }
})

function handleUpdateGroup(key: keyof ChecklistGroup, value: any) {
  emit('update:group', { ...props.group, [key]: value })
}

function handleUpdateItem(updatedItem: ChecklistItem) {
  const newItems = [...props.items]
  const index = newItems.findIndex(i => i.id === updatedItem.id)
  if (index !== -1) {
    newItems[index] = updatedItem
    emit('update:items', newItems)
  }
}

function handleDeleteItem(id: string) {
  emit('update:items', props.items.filter(i => i.id !== id))
}

function onAddItem() {
  if (newItemText.value.trim()) {
    emit('addItem', newItemText.value)
    newItemText.value = ''
  }
}
</script>

<template>
  <div class="checklist-group">
    <header class="group-header" @click.self="isCollapsed = !isCollapsed">
      <div class="title-container">
        <button v-if="!readonly" class="drag-handle-group" title="Перетащить группу">
          <Icon icon="mdi:drag" />
        </button>
        <button class="group-icon-btn" :disabled="readonly" @click="isIconPickerOpen = true">
          <Icon :icon="group.icon" class="group-icon" />
        </button>
        <KitEditable
          :model-value="group.name"
          :readonly="readonly"
          class="group-name"
          @update:model-value="handleUpdateGroup('name', $event)"
        />
      </div>
      <div class="header-actions">
        <span v-if="groupProgress.total > 0" class="group-progress">
          {{ groupProgress.completed }} / {{ groupProgress.total }}
        </span>
        <button v-if="!readonly" class="delete-group-btn" title="Удалить группу" @click="$emit('delete')">
          <Icon icon="mdi:trash-can-outline" />
        </button>
        <button class="collapse-btn" title="Свернуть/Развернуть" @click="isCollapsed = !isCollapsed">
          <Icon icon="mdi:chevron-down" :class="{ 'is-collapsed': isCollapsed }" />
        </button>
      </div>
    </header>

    <div v-show="!isCollapsed" class="group-content">
      <draggable
        :model-value="items"
        item-key="id"
        handle=".drag-handle"
        ghost-class="ghost-item-inner"
        :disabled="readonly"
        class="items-list"
        group="checklist-items"
        @update:model-value="emit('update:items', $event)"
      >
        <template #item="{ element: item }">
          <ChecklistItemComponent
            :item="item"
            :readonly="readonly"
            @update:item="handleUpdateItem"
            @delete="handleDeleteItem(item.id)"
          />
        </template>
      </draggable>

      <form v-if="!readonly" class="add-item-form" @submit.prevent="onAddItem">
        <input
          v-model="newItemText"
          type="text"
          placeholder="Добавить задачу..."
          class="add-item-input"
        >
        <KitBtn type="submit" size="sm" :disabled="!newItemText.trim()">
          Ok
        </KitBtn>
      </form>
    </div>

    <ChecklistIconPicker
      v-model:visible="isIconPickerOpen"
      :current-icon="group.icon"
      @select="icon => handleUpdateGroup('icon', icon)"
    />
  </div>
</template>

<style scoped lang="scss">
.checklist-group {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-m);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  background-color: var(--bg-tertiary-color);
  cursor: pointer;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-grow: 1;
  min-width: 0;
}

.drag-handle-group {
  cursor: grab;
  color: var(--fg-tertiary-color);
  &:active {
    cursor: grabbing;
  }
}

.group-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: var(--r-s);
  transition: background-color 0.2s;

  &:not(:disabled):hover {
    background-color: var(--bg-hover-color);
  }
}

.group-icon {
  font-size: 1.1rem;
  color: var(--fg-secondary-color);
}

.group-name {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.group-progress {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--fg-tertiary-color);
  background-color: var(--bg-secondary-color);
  padding: 2px 8px;
  border-radius: var(--r-full);
  margin-right: 0.25rem;
}

.delete-group-btn,
.collapse-btn {
  color: var(--fg-tertiary-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: var(--bg-hover-color);
  }
}

.delete-group-btn:hover {
  color: var(--fg-error-color);
}
.collapse-btn:hover {
  color: var(--fg-primary-color);
}

.collapse-btn svg {
  transition: transform 0.2s ease-in-out;
}
.collapse-btn .is-collapsed {
  transform: rotate(-180deg);
}

.group-content {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ghost-item-inner {
  opacity: 0.5;
  background: var(--bg-hover-color);
  border-radius: var(--r-s);
}

.add-item-form {
  display: flex;
  gap: 0.5rem;
  padding: 4px;
}

.add-item-input {
  flex-grow: 1;
  border: none;
  background: transparent;
  color: var(--fg-primary-color);
  font-size: 0.9rem;
  padding: 0.25rem;
  &:focus {
    outline: none;
    background: var(--bg-tertiary-color);
    border-radius: var(--r-xs);
  }
}
</style>
