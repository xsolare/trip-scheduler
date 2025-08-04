<script setup lang="ts">
import type { ActivitySection, ActivitySectionText } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import { ActivitySectionType } from '~/shared/types/models/activity'
import DescriptionSection from './description-section.vue'

interface Props {
  section: ActivitySection
}
defineProps<Props>()
const emit = defineEmits(['updateSection', 'deleteSection'])
const tripStore = useTripStore()
const { isViewMode } = storeToRefs(tripStore)

function onUpdate(data: ActivitySection) {
  emit('updateSection', data)
}
</script>

<template>
  <div class="activity-section-renderer">
    <DescriptionSection
      v-if="section.type === ActivitySectionType.DESCRIPTION"
      :section="section as ActivitySectionText"
      @update:section="onUpdate"
    />

    <button
      v-if="!isViewMode"
      class="delete-btn"
      title="Удалить секцию"
      @click="emit('deleteSection')"
    >
      <Icon icon="mdi:close" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.activity-section-renderer {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  color: var(--fg-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-primary-color);
  }
}

.activity-section-renderer:hover .delete-btn {
  opacity: 1;
  transform: scale(1);
}
</style>
