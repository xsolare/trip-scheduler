<script setup lang="ts">
import type { Component } from 'vue'
import type { TripSection } from '~/shared/types/models/trip'
import { Icon } from '@iconify/vue'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { KitEditable } from '~/components/01.kit/kit-editable'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-trip-info-module'
import { TripSectionType } from '~/shared/types/models/trip'

const route = useRoute()
const router = useRouter()
const { sections: sectionsStore, ui: uiStore } = useModuleStore(['sections', 'ui'])
const confirm = useConfirm()

const sectionId = computed(() => route.query.section as string)
const section = computed(() => sectionsStore.sections.find(s => s.id === sectionId.value))

const title = ref(section.value?.title || '')
watch(() => section.value?.title, (newTitle) => {
  title.value = newTitle || ''
})

const componentsMap: Partial<Record<TripSectionType, Component>> = {
  [TripSectionType.CHECKLIST]: defineAsyncComponent(() => import('~/components/04.features/trip-info/trip-sections/checklist-section/ui/checklist-section.vue')),
}

async function handleDeleteSection() {
  if (!section.value)
    return
  const isConfirmed = await confirm({
    title: `Удалить раздел "${section.value.title}"?`,
    description: 'Все данные внутри этого раздела будут безвозвратно удалены.',
    type: 'danger',
  })
  if (isConfirmed) {
    sectionsStore.deleteSection(section.value.id)
    router.replace({ query: { ...route.query, section: undefined } })
  }
}

function handleTitleUpdate(newTitle: string) {
  if (section.value && newTitle.trim() && newTitle !== section.value.title) {
    sectionsStore.updateSection({ ...section.value, title: newTitle })
  }
  else if (section.value) {
    title.value = section.value.title
  }
}

function handleSectionUpdate(updatedSectionData: TripSection) {
  sectionsStore.updateSection(updatedSectionData)
}
</script>

<template>
  <div v-if="section" class="section-renderer">
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

    <div class="section-content">
      <component
        :is="componentsMap[section.type]"
        v-if="componentsMap[section.type]"
        :section="section"
        :readonly="uiStore.isViewMode"
        @update-section="handleSectionUpdate"
      />
      <div v-else class="unknown-section">
        Неизвестный тип раздела: {{ section.type }}
      </div>
    </div>
  </div>
  <div v-else class="section-not-found">
    Раздел не найден.
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
.section-content {
  margin-top: 1.5rem;
}
.section-not-found {
  text-align: center;
  padding: 4rem;
  color: var(--fg-secondary-color);
}
</style>
