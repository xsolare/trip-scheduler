<script setup lang="ts">
import type { TripSection } from '~/shared/types/models/trip'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-module'

interface Props {
  section: TripSection
}
const props = defineProps<Props>()

const { sections: sectionsStore, ui: uiStore } = useModuleStore(['sections', 'ui'])

const content = ref(props.section.content?.markdown || '')

function handleBlur() {
  if (content.value !== (props.section.content?.markdown || '')) {
    const updatedSection = {
      ...props.section,
      content: { markdown: content.value },
    }
    sectionsStore.updateSection(updatedSection)
  }
}
</script>

<template>
  <div class="notes-section">
    <KitInlineMdEditorWrapper
      v-model="content"
      :readonly="uiStore.isViewMode"
      placeholder="Начните писать вашу заметку..."
      class="notes-editor"
      @blur="handleBlur"
    />
  </div>
</template>

<style scoped lang="scss">
.notes-section {
  margin-top: 16px;
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-m);
  padding: 16px;
  background-color: var(--bg-secondary-color);
}
</style>
