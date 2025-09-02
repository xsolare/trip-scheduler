<script setup lang="ts">
import type { TripSection } from '~/shared/types/models/trip'
import { Icon } from '@iconify/vue'
import { v4 as uuidv4 } from 'uuid'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitCheckbox } from '~/components/01.kit/kit-checkbox'
import { KitEditable } from '~/components/01.kit/kit-editable'
import { useModuleStore } from '~/components/04.modules/trip-info/composables/use-module'

interface Props {
  section: TripSection
}
const props = defineProps<Props>()

const { sections: sectionsStore, ui: uiStore } = useModuleStore(['sections', 'ui'])
const { isViewMode } = storeToRefs(uiStore)

const items = ref(props.section.content?.items || [])

function handleUpdate() {
  const updatedSection = { ...props.section, content: { items: items.value } }
  sectionsStore.updateSection(updatedSection)
}

function addItem() {
  items.value.push({ id: uuidv4(), text: '', checked: false })
}

function deleteItem(itemId: string) {
  items.value = items.value.filter((item: any) => item.id !== itemId)
  handleUpdate()
}
</script>

<template>
  <div class="checklist-section">
    <div v-if="items.length > 0" class="items-list">
      <div v-for="item in items" :key="item.id" class="checklist-item">
        <KitCheckbox v-model="item.checked" :disabled="isViewMode" @update:model-value="handleUpdate" />
        <KitEditable
          v-model="item.text"
          :readonly="isViewMode"
          class="item-text"
          placeholder="Новый пункт..."
          @submit="handleUpdate"
        />
        <button v-if="!isViewMode" class="delete-btn" @click="deleteItem(item.id)">
          <Icon icon="mdi:trash-can-outline" />
        </button>
      </div>
    </div>
    <div v-else class="empty-state">
      <Icon icon="mdi:format-list-checks" class="empty-icon" />
      <p>В этом списке пока нет дел.</p>
    </div>
    <div v-if="!isViewMode" class="section-actions">
      <KitBtn variant="outlined" icon="mdi:plus" @click="addItem">
        Добавить пункт
      </KitBtn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checklist-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: var(--r-s);
  &:hover {
    background-color: var(--bg-hover-color);
    .delete-btn {
      opacity: 1;
    }
  }
}
.item-text {
  flex-grow: 1;
}
.delete-btn {
  background: none;
  border: none;
  color: var(--fg-secondary-color);
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  &:hover {
    color: var(--fg-error-color);
  }
}
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--fg-secondary-color);
  .empty-icon {
    font-size: 2.5rem;
    opacity: 0.5;
  }
}
</style>
