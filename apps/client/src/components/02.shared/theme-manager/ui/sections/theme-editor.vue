<script setup lang="ts">
import type { ColorPalette } from '~/shared/store/theme.store'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { useThemeStore } from '~/shared/store/theme.store'
import { themePresets } from '../../constants/theme-presets'
import ColorEditorGrid from './color-editor-grid.vue'
import PresetSelector from './preset-selector.vue'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'apply'): void
  (e: 'upload'): void
  (e: 'reset'): void
}>()
const themeStore = useThemeStore()
const { customThemePalette } = storeToRefs(themeStore)

const activeTab = ref<'presets' | 'colors'>('presets')

function applyPreset(palette: ColorPalette) {
  Object.assign(customThemePalette.value, palette)
  activeTab.value = 'colors'
}
</script>

<template>
  <div class="theme-editor">
    <div class="theme-editor-header">
      <h3>Настройка цветовой схемы</h3>
      <p>Измените цвета для создания уникальной темы</p>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'presets' }" @click="activeTab = 'presets'">
        Выбор пресета
      </button>
      <button :class="{ active: activeTab === 'colors' }" @click="activeTab = 'colors'">
        Редактор цветов
      </button>
    </div>

    <div class="tab-content">
      <PresetSelector
        v-show="activeTab === 'presets'"
        :presets="themePresets"
        @apply-preset="applyPreset"
      />
      <ColorEditorGrid v-show="activeTab === 'colors'" v-model="customThemePalette" />
    </div>

    <div class="theme-editor-actions">
      <KitBtn icon="mdi:arrow-left" variant="outlined" color="secondary" @click="emit('back')">
        Назад
      </KitBtn>
      <KitBtn icon="mdi:upload" variant="outlined" color="secondary" @click="emit('upload')">
        Загрузить JSON
      </KitBtn>
      <KitBtn icon="mdi:restore" variant="outlined" color="secondary" @click="emit('reset')">
        Сбросить
      </KitBtn>
      <KitBtn icon="mdi:check" color="primary" @click="emit('apply')">
        Применить
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

.theme-editor-header {
  text-align: center;
  flex-shrink: 0;

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.3rem;
    color: var(--fg-primary-color);
  }

  p {
    margin: 0;
    color: var(--fg-secondary-color);
    font-size: 0.95rem;
  }
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
  padding-top: 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 200px;
}

.theme-editor-actions {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  padding: 16px 6px 0 6px;
  border-top: 1px solid var(--border-primary-color);
  flex-shrink: 0;
  background-color: var(--bg-primary-color);

  .kit-btn {
    min-width: 120px;

    &.kit-btn--color-primary {
      margin-left: auto;
    }
  }
}

@include media-down(sm) {
  .theme-editor {
    width: 100%;
    padding: 16px;
  }

  .theme-editor-actions {
    flex-direction: column-reverse;
    gap: 8px;

    .kit-btn {
      width: 100%;
      min-width: unset;

      &.kit-btn--color-primary {
        margin-left: 0;
      }
    }
  }
}
</style>
