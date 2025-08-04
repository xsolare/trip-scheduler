<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'

const tripStore = useTripStore()
const { getSelectedDay: selectedDay, isViewMode } = storeToRefs(tripStore)

function updateDayDetails(details: { title?: string, description?: string }) {
  if (selectedDay.value) {
    tripStore.updateDayDetails(selectedDay.value.id, details)
  }
}
</script>

<template>
  <div v-if="selectedDay" class="day-header">
    <InlineEditorWrapper
      :model-value="selectedDay.title"
      placeholder="Название дня..."
      :disabled="isViewMode"
      :features="{ 'block-edit': false }"
      class="day-title"
      @update:model-value="newTitle => updateDayDetails({ title: newTitle })"
    />
    <InlineEditorWrapper
      :model-value="selectedDay.description || ''"
      :disabled="isViewMode"
      placeholder="Добавьте описание..."
      :features="{ 'block-edit': false }"
      class="day-description"
      @update:model-value="newDesc => updateDayDetails({ description: newDesc })"
    />
  </div>
</template>

<style scoped lang="scss">
.day-header {
  position: relative;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: 4px 4px 16px 16px;
  padding: 32px;
  margin-bottom: 32px;
  margin-top: 16px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--fg-accent-color), transparent);
    opacity: 0.7;
  }
}

.day-title,
.day-description {
  width: 100%;

  :deep(.milkdown) {
    > div {
      padding: 8px 12px;
      margin: -8px -12px;
      border-radius: 12px;
      cursor: text;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: var(--bg-hover-color);
      }
    }
  }
}

.day-title {
  margin-bottom: 1rem;

  :deep() {
    .ProseMirror {
      h1,
      p {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--fg-primary-color);
        line-height: 1.2;
        letter-spacing: -0.025em;
        margin: 0;
      }
    }
  }
}

.day-description {
  :deep() {
    .ProseMirror p {
      color: var(--fg-secondary-color);
      line-height: 1.7;
      font-size: 0.9rem;
      margin: 0;
    }
  }
}
</style>
