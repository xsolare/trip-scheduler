<script setup lang="ts">
import type { ActivitySectionText } from '~/shared/types/models/activity'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'

interface Props {
  section: ActivitySectionText
}

const props = defineProps<Props>()
const emit = defineEmits(['update:section'])

const sectionModel = computed({
  get: () => props.section.text,
  set: (newText) => {
    emit('update:section', { ...props.section, text: newText })
  },
})
</script>

<template>
  <div class="description-section">
    <InlineEditorWrapper
      v-model="sectionModel"
      placeholder="Добавьте заметку или описание..."
      :features="{ 'block-edit': false }"
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
  padding: 4px;

  &:hover {
    border-color: var(--border-primary-color);
  }
}
.section-editor :deep(.milkdown) > div {
  padding: 8px;
  min-height: 30px;
}
</style>
