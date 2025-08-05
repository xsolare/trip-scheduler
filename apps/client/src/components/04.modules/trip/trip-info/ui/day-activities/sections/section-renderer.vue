<script setup lang="ts">
// ИЗМЕНЕНИЕ 1: Добавлен импорт ActivitySectionGallery
import type { ActivitySection, ActivitySectionGallery, ActivitySectionGeolocation, ActivitySectionText } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { useTripStore } from '~/components/04.modules/trip/trip-info/store/trip-store'
import { ActivitySectionType } from '~/shared/types/models/activity'
import DescriptionSection from './description-section.vue'
import GallerySection from './gallery-section.vue'
import GeolocationSection from './geolocation-section.vue'

interface Props {
  section: ActivitySection
  isFirstAttached: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['updateSection', 'deleteSection'])
const tripStore = useTripStore()
const { isViewMode } = storeToRefs(tripStore)

function onUpdate(data: ActivitySection) {
  emit('updateSection', data)
}

function toggleAttached() {
  emit('updateSection', { ...props.section, isAttached: !props.section.isAttached })
}
</script>

<template>
  <div class="activity-section-renderer" :class="{ 'is-attached': section.isAttached }">
    <DescriptionSection
      v-if="section.type === ActivitySectionType.DESCRIPTION"
      :section="section as ActivitySectionText"
      @update-section="onUpdate"
    />
    <GallerySection
      v-else-if="section.type === ActivitySectionType.GALLERY"
      :section="section as ActivitySectionGallery"
      @update-section="onUpdate"
    />
    <GeolocationSection
      v-else-if="section.type === ActivitySectionType.GEOLOCATION"
      :section="section as ActivitySectionGeolocation"
      @update-section="onUpdate"
    />

    <div v-if="!isViewMode" class="section-controls">
      <button
        class="control-btn attach-btn"
        :title="section.isAttached ? 'Открепить секцию' : 'Прикрепить к предыдущей'"
        @click="toggleAttached"
      >
        <Icon :icon="section.isAttached ? 'mdi:link-variant-off' : 'mdi:link-variant-plus'" />
      </button>
      <button
        class="control-btn delete-btn"
        title="Удалить секцию"
        @click="emit('deleteSection')"
      >
        <Icon icon="mdi:close" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity-section-renderer {
  position: relative;

  &.is-attached {
    padding-left: 8px;
    border-left: 2px dashed var(--border-secondary-color);
  }
}

.section-controls {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
  z-index: 10;
}

.control-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  color: var(--fg-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-primary-color);
  }
}

.attach-btn:hover {
  color: var(--fg-accent-color);
}

.activity-section-renderer:hover .section-controls {
  opacity: 1;
  transform: scale(1);
}
</style>
