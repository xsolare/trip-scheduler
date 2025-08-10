<script setup lang="ts">
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
import { KitImage } from '~/components/01.kit/kit-image'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'

interface Props {
  memory: Memory
  isUnsorted?: boolean
}
const props = defineProps<Props>()

const store = useModuleStore(['memories'])
const { updateMemory, deleteMemory } = store.memories

const isEditing = ref(false)
const editedComment = ref(props.memory.comment || '')

function handleEdit() {
  isEditing.value = true
  editedComment.value = props.memory.comment || ''
}

function handleSave() {
  updateMemory({ id: props.memory.id, comment: editedComment.value })
  isEditing.value = false
}

function handleCancel() {
  isEditing.value = false
}

function handleDelete() {
  if (confirm('Вы уверены, что хотите удалить это воспоминание?')) {
    deleteMemory(props.memory.id)
  }
}

function handleSetTimestamp() {
  // Простое модальное окно для выбора даты. В реальном приложении лучше использовать календарь.
  const dateStr = prompt('Введите дату и время (ГГГГ-ММ-ДДTчч:мм:сс)', new Date().toISOString().slice(0, 19))
  if (dateStr) {
    try {
      const newTimestamp = new Date(dateStr).toISOString()
      updateMemory({ id: props.memory.id, timestamp: newTimestamp })
    }
    catch (e) {
      alert('Неверный формат даты')
    }
  }
}

const displayTime = computed(() => {
  if (!props.memory.timestamp)
    return ''
  return new Date(props.memory.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div class="memory-item" :class="{ 'is-photo': memory.imageId, 'is-note': !memory.imageId, 'is-unsorted': isUnsorted }">
    <div v-if="memory.imageId && memory.imageUrl" class="memory-image">
      <KitImage :src="memory.imageUrl" object-fit="cover" />
    </div>

    <div class="memory-content">
      <div v-if="!isUnsorted" class="memory-meta">
        <Icon icon="mdi:clock-outline" />
        <span>{{ displayTime }}</span>
      </div>

      <div class="memory-comment">
        <div v-if="isEditing">
          <textarea v-model="editedComment" rows="3" />
          <div class="edit-actions">
            <button @click="handleSave">
              Сохранить
            </button>
            <button @click="handleCancel">
              Отмена
            </button>
          </div>
        </div>
        <p v-else>
          {{ memory.comment || (memory.imageId ? 'Нет комментария' : 'Текстовая заметка') }}
        </p>
      </div>
    </div>

    <div class="memory-actions">
      <button v-if="isUnsorted" title="Добавить дату" @click="handleSetTimestamp">
        <Icon icon="mdi:calendar-plus" />
      </button>
      <button v-if="!isEditing" title="Редактировать" @click="handleEdit">
        <Icon icon="mdi:pencil" />
      </button>
      <button title="Удалить" @click="handleDelete">
        <Icon icon="mdi:trash-can-outline" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.memory-item {
  display: flex;
  gap: 16px;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-m);
  padding: 12px;
  position: relative;
  overflow: hidden;

  &.is-unsorted {
    flex-direction: column;
    padding: 0;
    gap: 0;
  }
}

.memory-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: var(--r-s);
  overflow: hidden;

  .is-unsorted & {
    width: 100%;
    height: 120px;
    border-radius: var(--r-s) var(--r-s) 0 0;
  }
}

.memory-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;

  .is-unsorted & {
    padding: 8px;
  }
}

.memory-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--fg-accent-color);
}

.memory-comment p {
  margin: 0;
  color: var(--fg-primary-color);
  white-space: pre-wrap;
}

.memory-comment textarea {
  width: 100%;
  border: 1px solid var(--border-primary-color);
  background: var(--bg-primary-color);
  border-radius: var(--r-xs);
  padding: 8px;
  color: var(--fg-primary-color);
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.memory-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  button {
    background: rgba(var(--bg-primary-color-rgb), 0.7);
    backdrop-filter: blur(4px);
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-full);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--fg-secondary-color);

    &:hover {
      color: var(--fg-primary-color);
    }
  }
}

.memory-item:hover .memory-actions {
  opacity: 1;
}
</style>
