<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDebounceFn } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { computed, nextTick, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitCheckbox } from '~/components/01.kit/kit-checkbox'
import { KitEditable } from '~/components/01.kit/kit-editable'

// --- Types ---
interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface ChecklistSectionContent {
  items: ChecklistItem[]
}

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

// --- Local State ---
const items = ref<ChecklistItem[]>(JSON.parse(JSON.stringify(props.section.content?.items || [])))
const newItemText = ref('')
const newItemInputRef = ref<HTMLInputElement | null>(null)

// --- Logic ---
const debouncedUpdate = useDebounceFn(() => {
  emit('updateSection', {
    ...props.section,
    content: { items: items.value },
  })
}, 700)

async function addItem() {
  if (!newItemText.value.trim())
    return
  items.value.push({
    id: uuidv4(),
    text: newItemText.value,
    completed: false,
  })
  newItemText.value = ''
  await nextTick()
  newItemInputRef.value?.focus()
}

function deleteItem(id: string) {
  items.value = items.value.filter(item => item.id !== id)
}

function updateItemText(id: string, newText: string) {
  const item = items.value.find(i => i.id === id)
  if (item) {
    item.text = newText
  }
}

const progress = computed(() => {
  const total = items.value.length
  if (total === 0)
    return 0
  const completed = items.value.filter(item => item.completed).length
  return Math.round((completed / total) * 100)
})

watch(items, () => {
  debouncedUpdate()
}, { deep: true })

watch(() => props.section.content, (newContent) => {
  if (JSON.stringify(newContent?.items) !== JSON.stringify(items.value)) {
    items.value = JSON.parse(JSON.stringify(newContent?.items || []))
  }
}, { deep: true })
</script>

<template>
  <div class="checklist-section">
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }" />
      <span class="progress-text">{{ progress }}% выполнено</span>
    </div>

    <div class="checklist-items">
      <draggable
        v-model="items"
        item-key="id"
        handle=".drag-handle"
        ghost-class="ghost-item"
        :disabled="readonly"
      >
        <template #item="{ element: item }">
          <div class="checklist-item" :class="{ completed: item.completed }">
            <button v-if="!readonly" class="drag-handle" title="Перетащить">
              <Icon icon="mdi:drag-vertical" />
            </button>
            <KitCheckbox v-model="item.completed" :disabled="readonly" />
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
    </div>

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
  gap: 0.5rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
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

.drag-handle {
  cursor: grab;
  color: var(--fg-tertiary-color);
  opacity: 0;
  transition: opacity 0.2s ease;
  &:active {
    cursor: grabbing;
  }
}

.item-text {
  flex-grow: 1;
}

.delete-item-btn {
  color: var(--fg-tertiary-color);
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 1rem;
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
