<script setup lang="ts">
import type { KitDropdownItem } from '~/components/01.kit/kit-dropdown'
import { Icon } from '@iconify/vue'
import { KitDropdown } from '~/components/01.kit/kit-dropdown'
import { TripSectionType } from '~/shared/types/models/trip'
import { useModuleStore } from '../../composables/use-trip-info-module.ts'

const { sections: sectionsStore } = useModuleStore(['sections'])

const sectionOptions: KitDropdownItem<TripSectionType>[] = [
  { value: TripSectionType.NOTES, label: 'Заметки', icon: 'mdi:note-text-outline' },
  { value: TripSectionType.BOOKINGS, label: 'Бронирования', icon: 'mdi:book-multiple-outline' },
  { value: TripSectionType.CHECKLIST, label: 'Чек-лист', icon: 'mdi:format-list-checks' },
  { value: TripSectionType.FINANCES, label: 'Финансы', icon: 'mdi:cash-multiple' },
]

function handleAddSection(type: TripSectionType) {
  sectionsStore.addSection(type)
}
</script>

<template>
  <KitDropdown
    :items="sectionOptions"
    @update:model-value="handleAddSection"
  >
    <template #trigger>
      <button class="add-section-btn">
        <Icon icon="mdi:plus-circle-outline" />
        <span>Добавить раздел</span>
      </button>
    </template>
  </KitDropdown>
</template>

<style scoped lang="scss">
.add-section-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--r-s);
  border: 1px solid var(--border-secondary-color);
  background-color: transparent;
  color: var(--fg-secondary-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }
}

.item-icon {
  font-size: 1.1rem;
  color: var(--fg-secondary-color);
}
</style>
