<script setup lang="ts">
import type { ColorPalette, RadiusPalette } from '~/shared/store/theme.store'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { useDisplay } from '~/shared/composables/use-display'
import { useThemeStore } from '~/shared/store/theme.store'
import { themePresets } from '../../constants/color-presets'
import { radiusPresets } from '../../constants/radius-presets'
import ColorEditorGrid from './color-editor-grid.vue'
import ColorPresetSelector from './preset-selector.vue'
import RadiusEditorGrid from './radius-editor-grid.vue'
import RadiusPresetSelector from './radius-preset-selector.vue'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'apply'): void
  (e: 'upload'): void
  (e: 'reset'): void
  (e: 'resetRadius'): void
}>()
const themeStore = useThemeStore()
const { customThemePalette, customThemeRadius } = storeToRefs(themeStore)

const activeTab = ref<'presets' | 'colors' | 'radius'>('presets')

function applyPreset(palette: ColorPalette) {
  Object.assign(customThemePalette.value, palette)
}

function applyRadiusPreset(radius: RadiusPalette) {
  themeStore.applyCustomRadius(radius)
}
const { mdAndDown } = useDisplay()
</script>

<template>
  <div class="theme-editor">
    <div class="tabs">
      <button :class="{ active: activeTab === 'presets' }" @click="activeTab = 'presets'">
        Выбор пресета
      </button>
      <button :class="{ active: activeTab === 'colors' }" @click="activeTab = 'colors'">
        Редактор цветов
      </button>
      <button :class="{ active: activeTab === 'radius' }" @click="activeTab = 'radius'">
        Радиусы
      </button>
    </div>

    <div class="tab-content">
      <div v-show="activeTab === 'presets'" class="preset-tab">
        <ColorPresetSelector
          :presets="themePresets"
          @apply-preset="applyPreset"
        />
      </div>
      <ColorEditorGrid v-show="activeTab === 'colors'" v-model="customThemePalette" />
      <div v-show="activeTab === 'radius'" class="radius-tab">
        <RadiusPresetSelector :presets="radiusPresets" @apply-preset="applyRadiusPreset" />
        <div class="divider" />
        <RadiusEditorGrid v-model="customThemeRadius" />
      </div>
    </div>

    <div class="theme-editor-actions">
      <KitBtn icon="mdi:arrow-left" variant="outlined" color="secondary" @click="emit('back')">
        {{ mdAndDown ? '' : 'Назад' }}
      </KitBtn>
      <KitBtn icon="mdi:upload" variant="outlined" color="secondary" @click="emit('upload')">
        {{ mdAndDown ? '' : 'Загрузить' }}
      </KitBtn>
      <KitBtn icon="mdi:restore" variant="outlined" color="secondary" @click="emit('reset')">
        {{ mdAndDown ? '' : 'Сбросить' }}
      </KitBtn>
      <KitBtn icon="mdi:radius" variant="outlined" color="secondary" @click="emit('resetRadius')">
        {{ mdAndDown ? '' : 'Сброс радиусов' }}
      </KitBtn>
      <KitBtn icon="mdi:check" color="primary" @click="emit('apply')">
        {{ mdAndDown ? '' : 'Применить' }}
      </KitBtn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 75vh;
  width: 700px;
  max-width: 100%;
}

.divider {
  height: 1px;
  background-color: var(--border-primary-color);
  margin: 24px 6px;
}

.radius-tab {
  padding: 6px;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border-primary-color);
  padding: 0 6px;
  flex-shrink: 0;

  button {
    padding: 10px 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--fg-secondary-color);
    font-size: 1rem;
    font-weight: 500;
    position: relative;
    bottom: -1px;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;

    &.active {
      color: var(--fg-accent-color);
      border-bottom-color: var(--fg-accent-color);
    }

    &:hover:not(.active) {
      color: var(--fg-primary-color);
    }
  }
}

.tab-content {
  overflow-y: auto;
  flex: 1;
  min-height: 200px;
}

.theme-editor-actions {
  display: flex;
  justify-content: flex-start;
  font-style: row;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 6px 0 6px;
  border-top: 1px solid var(--border-primary-color);
  flex-shrink: 0;
  background-color: var(--bg-primary-color);

  .kit-btn {
    max-width: 120px;

    &.kit-btn--color-primary {
      margin-left: auto;
      width: 100%;
    }
  }
}

@include media-down(sm) {
  .theme-editor {
    width: 100%;
  }

  .theme-editor-actions {
    gap: 8px;

    .kit-btn {
      min-width: unset;

      &.kit-btn--color-primary {
        max-width: 120px;
        width: auto;
      }
    }
  }
}
</style>
