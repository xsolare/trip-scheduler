<script setup lang="ts">
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { useTrip } from '../../composables/use-trip'

const tripComposable = useTrip()

const selectedDay = computed(() => tripComposable.getSelectedDay.value)

function updateDayDetails(details: { title?: string, description?: string }) {
  if (selectedDay.value) {
    tripComposable.updateDayDetails(selectedDay.value.id, details)
  }
}
</script>

<template>
  <div v-if="selectedDay" class="day-header">
    <InlineEditorWrapper
      :model-value="selectedDay.title"
      placeholder="Название дня"
      class="day-title"

      @update:model-value="newTitle => updateDayDetails({ title: newTitle })"
    />
    <InlineEditorWrapper
      :model-value="selectedDay.description || ''"
      placeholder="Добавьте описание"
      class="day-description"
      @update:model-value="newDesc => updateDayDetails({ description: newDesc })"
    />
  </div>
</template>

<style scoped lang="scss">
.day-header {
  padding: 0px;
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-secondary-color);

  .day-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--fg-primary-color);
    margin: 0 0 8px 0;
  }

  .day-description {
    font-size: 1rem;
    color: var(--fg-secondary-color);
    margin: 0;
    line-height: 1.5;
  }
}
</style>
