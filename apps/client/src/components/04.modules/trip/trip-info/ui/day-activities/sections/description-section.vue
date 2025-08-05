<script setup lang="ts">
import type { ActivitySectionText } from '~/shared/types/models/activity'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { useTripStore } from '~/components/04.modules/trip/trip-info/store/trip-store'

interface Props {
  section: ActivitySectionText
}

const props = defineProps<Props>()
const emit = defineEmits(['updateSection'])
const tripStore = useTripStore()
const { isViewMode } = storeToRefs(tripStore)

const sectionModel = computed({
  get: () => props.section.text,
  set: (newText) => {
    emit('updateSection', { ...props.section, text: newText })
  },
})
</script>

<template>
  <div class="description-section">
    <InlineEditorWrapper
      v-model="sectionModel"
      :readonly="isViewMode"
      placeholder="Добавьте заметку или описание..."
      class="section-editor"
    />
  </div>
</template>

<style scoped lang="scss">
.description-section {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: 4px;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--border-primary-color);
  }
}
.section-editor :deep(.milkdown) > div {
  padding: 8px;
  min-height: 30px;
}
</style>
