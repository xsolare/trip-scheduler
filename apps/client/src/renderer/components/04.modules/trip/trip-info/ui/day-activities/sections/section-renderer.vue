<script setup lang="ts">
import type { ActivitySectionGeolocation } from '~/components/03.domain/trip/trip-info/geolocation-section/models/types'
import type {
  ActivitySection,
  ActivitySectionGallery,
  ActivitySectionText,
} from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { KitInput } from '~/components/01.kit/kit-input'
import { IconPicker } from '~/components/02.shared/icon-picker'
import { EActivitySectionType } from '~/shared/types/models/activity'
import GeolocationSection from '../../../../../../03.domain/trip/trip-info/geolocation-section/ui/geolocation-section.vue'
import { useModuleStore } from '../../../composables/use-module'
import DescriptionSection from './description-section.vue'
import GallerySection from './gallery-section.vue'

interface Props {
  section: ActivitySection
  isFirstAttached: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['updateSection', 'deleteSection'])
const store = useModuleStore(['ui'])
const { isViewMode } = storeToRefs(store.ui)

const editableTitle = ref(props.section.title || '')
const editableIcon = ref(props.section.icon || 'mdi:map-marker')

function onUpdate(data: ActivitySection) {
  emit('updateSection', data)
}

function toggleAttached() {
  const newSectionData = {
    ...props.section,
    isAttached: !props.section.isAttached,
  }
  if (!newSectionData.isAttached) {
    delete newSectionData.title
    delete newSectionData.icon
  }
  emit('updateSection', newSectionData)
}

function updatePinSettings() {
  if (editableTitle.value !== (props.section.title || '')
    || editableIcon.value !== (props.section.icon || 'mdi:map-marker')
  ) {
    emit('updateSection', {
      ...props.section,
      title: editableTitle.value,
      icon: editableIcon.value,
    })
  }
}

watch(editableIcon, () => {
  updatePinSettings()
})

watch(() => props.section, (newSection) => {
  editableTitle.value = newSection.title || ''
  editableIcon.value = newSection.icon || 'mdi:map-marker'
}, { deep: true, immediate: true })
</script>

<template>
  <div class="activity-section-renderer" :class="{ 'is-attached': section.isAttached }">
    <div v-if="section.isAttached && !isViewMode" class="pin-settings">
      <KitInput
        v-model="editableTitle"
        placeholder="Заголовок пина (необязательно)"
        class="pin-input"
        size="sm"
        @blur="updatePinSettings"
        @keydown.enter="($event.target as HTMLInputElement).blur()"
      />
      <IconPicker
        v-model="editableIcon"
        size="sm"
      />
    </div>

    <DescriptionSection
      v-if="section.type === EActivitySectionType.DESCRIPTION"
      :section="section as ActivitySectionText"
      @update-section="onUpdate"
    />
    <GallerySection
      v-else-if="section.type === EActivitySectionType.GALLERY"
      :section="section as ActivitySectionGallery"
      @update-section="onUpdate"
    />
    <GeolocationSection
      v-else-if="section.type === EActivitySectionType.GEOLOCATION"
      :readonly="isViewMode"
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

.pin-settings {
  display: flex;
  gap: 8px;
  padding: 4px;
  margin-bottom: 8px;
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);

  .pin-input {
    flex-grow: 1;

    :deep(input) {
      height: 38px;
      font-size: 0.9rem;
    }
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
  border-radius: var(--r-full);
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
