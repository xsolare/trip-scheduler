<script setup lang="ts">
import type { ActivitySectionGeolocation } from '~/components/03.domain/trip-info/proposal-geolocation-section'
import type {
  ActivitySection,
  ActivitySectionGallery,
  ActivitySectionText,
} from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { KitInput } from '~/components/01.kit/kit-input'
import { IconPicker } from '~/components/02.shared/icon-picker'
import { GeolocationSection } from '~/components/03.domain/trip-info/proposal-geolocation-section'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-trip-info-module'
import { EActivitySectionType } from '~/shared/types/models/activity'
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

const defaultColors = [
  'var(--bg-secondary-color)',
  'var(--bg-tertiary-color)',
  '#FFADAD',
  '#FFD6A5',
  '#FDFFB6',
  '#A3D9A5',
  '#9BF6FF',
  '#A0C4FF',
  '#BDB2FF',
  '#FFC6FF',
]

const editableTitle = ref((props.section as any).title || '')
const editableIcon = ref((props.section as any).icon || 'mdi:map-marker')
const editableColor = ref((props.section as any).color || defaultColors[0])

function onUpdate(data: ActivitySection) {
  emit('updateSection', data)
}

function toggleAttached() {
  const newSectionData = {
    ...props.section,
    isAttached: !(props.section as any).isAttached,
  }
  if (!(newSectionData as any).isAttached) {
    delete (newSectionData as any).title
    delete (newSectionData as any).icon
    delete (newSectionData as any).color
  }
  emit('updateSection', newSectionData)
}

function updatePinSettings() {
  if (editableTitle.value !== ((props.section as any).title || '')
    || editableIcon.value !== ((props.section as any).icon || 'mdi:map-marker')
    || editableColor.value !== ((props.section as any).color || defaultColors[0])
  ) {
    emit('updateSection', {
      ...props.section,
      title: editableTitle.value,
      icon: editableIcon.value,
      color: editableColor.value,
    })
  }
}

watch(editableIcon, () => {
  updatePinSettings()
})

watch(editableColor, () => {
  updatePinSettings()
})

watch(() => props.section, (newSection) => {
  editableTitle.value = (newSection as any).title || ''
  editableIcon.value = (newSection as any).icon || 'mdi:map-marker'
  editableColor.value = (newSection as any).color || defaultColors[0]
}, { deep: true, immediate: true })
</script>

<template>
  <div class="activity-section-renderer" :class="{ 'is-attached': (section as any).isAttached }">
    <div v-if="(section as any).isAttached && !isViewMode" class="pin-settings">
      <div class="pin-main-settings">
        <KitInput
          v-model="editableTitle"
          placeholder="Заголовок пина"
          class="pin-input"
          size="sm"
          @blur="updatePinSettings"
          @keydown.enter="($event.target as HTMLInputElement).blur()"
        />
        <IconPicker
          v-model="editableIcon"
          size="sm"
          @update:model-value="updatePinSettings"
        />
      </div>
      <div class="color-picker">
        <div class="color-options">
          <input
            v-model="editableColor"
            type="color"
            class="color-input"
            @input="updatePinSettings"
          >
          <button
            v-for="color in defaultColors"
            :key="color"
            class="color-option"
            :style="{ backgroundColor: color }"
            :class="{ 'is-active': editableColor === color }"
            @click="editableColor = color"
          />
        </div>
      </div>
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
        :title="(section as any).isAttached ? 'Открепить секцию' : 'Прикрепить к предыдущей'"
        @click="toggleAttached"
      >
        <Icon :icon="(section as any).isAttached ? 'mdi:link-variant-off' : 'mdi:link-variant-plus'" />
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
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
}

.pin-main-settings {
  display: flex;
  gap: 8px;
}

.pin-input {
  flex-grow: 1;

  :deep(input) {
    height: 38px;
    font-size: 0.9rem;
  }
}

.color-options {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.color-option {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  outline: 1px solid var(--border-secondary-color);
  cursor: pointer;
  transition: all 0.2s;
  &.is-active {
    border-color: var(--fg-accent-color);
    transform: scale(1.1);
  }
}

.color-input {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 50%;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0;
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 1px solid var(--border-secondary-color);
    border-radius: 50%;
  }
}

.section-controls {
  position: absolute;
  top: -12px;
  right: -12px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
  z-index: 10;
}

.control-btn {
  width: 26px;
  height: 26px;
  border-radius: var(--r-full);
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  color: var(--fg-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 2px;

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
