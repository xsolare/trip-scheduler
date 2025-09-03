<script setup lang="ts">
import type { TripSection } from '~/shared/types/models/trip'
import { Icon } from '@iconify/vue'
import { defineAsyncComponent } from 'vue'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { KitEditable } from '~/components/01.kit/kit-editable'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-module'
import { TripSectionType } from '~/shared/types/models/trip'

interface Props {
  section: TripSection
}
const props = defineProps<Props>()

const { sections: sectionsStore, ui: uiStore } = useModuleStore(['sections', 'ui'])
const confirm = useConfirm()

// LATER
const title = ref('')

const componentsMap = {
  [TripSectionType.NOTES]: defineAsyncComponent(() => import('./notes-section.vue')),
  [TripSectionType.BOOKINGS]: defineAsyncComponent(() => import('./bookings-section.vue')),
  [TripSectionType.FINANCES]: defineAsyncComponent(() => import('./finances-section.vue')),
  [TripSectionType.CHECKLIST]: defineAsyncComponent(() => import('./checklist-section.vue')),
}

async function handleDeleteSection() {
  const isConfirmed = await confirm({
    title: `Удалить раздел "${props.section.title}"?`,
    description: 'Все данные внутри этого раздела будут безвозвратно удалены.',
  })
  if (isConfirmed) {
    sectionsStore.deleteSection(props.section.id)
  }
}

function handleTitleUpdate(newTitle: string) {
  if (newTitle.trim() && newTitle !== props.section.title) {
    sectionsStore.updateSection({ ...props.section, title: newTitle })
  }
}
</script>

<template>
  <div class="section-renderer">
    <div class="section-header">
      <div class="section-title">
        <Icon :icon="section.icon || 'mdi:file-document-outline'" />
        <KitEditable
          v-model="title"
          :readonly="uiStore.isViewMode"
          @submit="handleTitleUpdate"
        />
      </div>
      <button v-if="!uiStore.isViewMode" class="delete-section-btn" @click="handleDeleteSection">
        <Icon icon="mdi:trash-can-outline" />
        <span>Удалить раздел</span>
      </button>
    </div>

    <component
      :is="componentsMap[section.type]"
      v-if="componentsMap[section.type]"
      :section="section"
    />
    <div v-else class="unknown-section">
      Неизвестный тип раздела: {{ section.type }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-secondary-color);
  padding-bottom: 1rem;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;

  .iconify {
    color: var(--fg-secondary-color);
  }
  :deep(.kit-editable-root .kit-editable-area) {
    padding: 0;
  }
  :deep(.kit-editable-root .kit-editable-input) {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
.delete-section-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--fg-secondary-color);
  font-size: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--r-s);
  transition: all 0.2s;
  &:hover {
    color: var(--fg-error-color);
    background-color: var(--bg-error-color);
  }
}
</style>
