<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { DialogWithClose } from '~/components/01.kit/dialog-with-close'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { useThemeStore } from '~/shared/store/theme.store'
import { themePresets } from '../constants/theme-presets'

const themeStore = useThemeStore()
const {
  isCreatorOpen,
  activeThemeName,
  customThemePalette,
} = storeToRefs(themeStore)

const showCustomizer = ref(false)
const jsonInput = ref<HTMLInputElement | null>(null)

function selectTheme(themeName: 'light' | 'dark' | 'custom') {
  themeStore.setTheme(themeName)
  if (themeName !== 'custom') {
    showCustomizer.value = false
  }
}

function openCustomizer() {
  themeStore.setTheme('custom')
  showCustomizer.value = true
}

function closeCreator() {
  showCustomizer.value = false
  themeStore.closeCreator()
}

function resetCustomTheme() {
  themeStore.resetCustomTheme()
}

function triggerJsonUpload() {
  jsonInput.value?.click()
}

function handleJsonUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      Object.assign(customThemePalette.value, json)
    }
    catch (error) {
      console.error('Ошибка при разборе JSON:', error)
    }
  }
  reader.readAsText(file)
}

function applyPreset(palette: Record<string, string>) {
  Object.assign(customThemePalette.value, palette)
}

function variableNameToHumanReadable(name: string) {
  const translations: Record<string, string> = {
    color: 'Цвет',
    bg: 'Фон',
    background: 'Фон',
    fg: 'Текст',
    foreground: 'Текст',
    border: 'Граница',
    primary: 'Основной',
    secondary: 'Второстепенный',
    accent: 'Акцент',
    surface: 'Поверхность',
    card: 'Карточка',
    header: 'Заголовок',
    sidebar: 'Боковая панель',
    focus: 'Фокус',
    hover: 'Наведение',
    active: 'Активный',
    disabled: 'Отключенный',
    success: 'Успех',
    warning: 'Предупреждение',
    error: 'Ошибка',
    info: 'Информация',
  }

  return name
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => translations[word.toLowerCase()] || word)
    .join(' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}
</script>

<template>
  <DialogWithClose
    v-model:visible="isCreatorOpen"
    :title="showCustomizer ? 'Редактор пользовательской темы' : 'Выбор темы оформления'"
  >
    <div v-if="!showCustomizer" class="theme-chooser">
      <div class="theme-cards">
        <!-- Светлая тема -->
        <div
          class="theme-card"
          :class="{ active: activeThemeName === 'light' }"
          @click="selectTheme('light')"
        >
          <div class="theme-card-preview theme-card-preview--light">
            <div class="preview-header" />
            <div class="preview-content">
              <div class="preview-element" />
              <div class="preview-element preview-element--small" />
            </div>
          </div>
          <div class="theme-card-info">
            <div class="theme-card-icon">
              <Icon icon="mdi:white-balance-sunny" />
            </div>
            <div class="theme-card-content">
              <h3 class="theme-card-title">
                Светлая тема
              </h3>
              <p class="theme-card-description">
                Классическое светлое оформление
              </p>
            </div>
            <div v-if="activeThemeName === 'light'" class="theme-card-check">
              <Icon icon="mdi:check-circle" />
            </div>
          </div>
        </div>

        <!-- Тёмная тема -->
        <div
          class="theme-card"
          :class="{ active: activeThemeName === 'dark' }"
          @click="selectTheme('dark')"
        >
          <div class="theme-card-preview theme-card-preview--dark">
            <div class="preview-header" />
            <div class="preview-content">
              <div class="preview-element" />
              <div class="preview-element preview-element--small" />
            </div>
          </div>
          <div class="theme-card-info">
            <div class="theme-card-icon">
              <Icon icon="mdi:moon-waning-crescent" />
            </div>
            <div class="theme-card-content">
              <h3 class="theme-card-title">
                Тёмная тема
              </h3>
              <p class="theme-card-description">
                Тёмное оформление для комфорта глаз
              </p>
            </div>
            <div v-if="activeThemeName === 'dark'" class="theme-card-check">
              <Icon icon="mdi:check-circle" />
            </div>
          </div>
        </div>

        <!-- Пользовательская тема -->
        <div
          class="theme-card theme-card--custom"
          :class="{ active: activeThemeName === 'custom' }"
        >
          <div class="theme-card-preview theme-card-preview--custom" @click="selectTheme('custom')">
            <div class="preview-header" />
            <div class="preview-content">
              <div class="preview-element" />
              <div class="preview-element preview-element--small" />
            </div>
            <div class="custom-gradient" />
          </div>
          <div class="theme-card-info">
            <div class="theme-card-main" @click="selectTheme('custom')">
              <div class="theme-card-icon">
                <Icon icon="mdi:palette" />
              </div>
              <div class="theme-card-content">
                <h3 class="theme-card-title">
                  Своя тема
                </h3>
                <p class="theme-card-description">
                  Создайте уникальное оформление
                </p>
              </div>
              <div v-if="activeThemeName === 'custom'" class="theme-card-check">
                <Icon icon="mdi:check-circle" />
              </div>
            </div>
            <div class="theme-card-settings" @click="openCustomizer">
              <Icon icon="mdi:cog" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="theme-editor">
      <div class="theme-editor-header">
        <h3>Настройка цветовой схемы</h3>
        <p>Измените цвета для создания уникальной темы</p>
      </div>

      <!-- Блок с пресетами -->
      <div class="theme-presets">
        <h4 class="presets-title">
          Вариации пресетов
        </h4>
        <div class="presets-grid">
          <div
            v-for="preset in themePresets"
            :key="preset.name"
            class="preset-card"
            @click="applyPreset(preset.palette)"
          >
            <div class="preset-preview">
              <span
                v-for="(color, key) in preset.palette"
                :key="key"
                class="preset-color-chip"
                :style="{ backgroundColor: color }"
              />
            </div>
            <p class="preset-name">
              {{ preset.name }}
            </p>
          </div>
        </div>
      </div>

      <div class="theme-editor-grid">
        <div v-for="(_, key) in customThemePalette" :key="key" class="theme-editor-item">
          <label :for="key.toString()" class="theme-editor-label">
            {{ variableNameToHumanReadable(key.toString()) }}
          </label>
          <div class="theme-editor-input-group">
            <div class="color-picker-wrapper">
              <input
                :id="key.toString()"
                v-model="customThemePalette[key]"
                type="color"
                class="theme-editor-color-swatch"
              >
            </div>
            <input
              v-model="customThemePalette[key]"
              type="text"
              class="theme-editor-hex-input"
              placeholder="#000000"
            >
          </div>
        </div>
      </div>

      <div class="theme-editor-actions">
        <KitBtn
          icon="mdi:arrow-left"
          variant="outlined"
          color="secondary"
          @click="showCustomizer = false"
        >
          Назад
        </KitBtn>
        <KitBtn
          icon="mdi:upload"
          variant="outlined"
          color="secondary"
          @click="triggerJsonUpload"
        >
          Загрузить JSON
        </KitBtn>
        <input ref="jsonInput" type="file" accept=".json" style="display: none;" @change="handleJsonUpload">
        <KitBtn
          icon="mdi:restore"
          variant="outlined"
          color="secondary"
          @click="resetCustomTheme"
        >
          Сбросить
        </KitBtn>
        <KitBtn
          icon="mdi:check"
          color="primary"
          @click="closeCreator"
        >
          Применить
        </KitBtn>
      </div>
    </div>
  </DialogWithClose>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/themes/light/_variables.scss' as light-theme;
@use '~/assets/scss/themes/dark/_variables.scss' as dark-theme;

.theme-chooser {
  min-width: 600px;
  padding: 4px;

  .theme-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .theme-card {
    border: 2px solid var(--border-primary-color);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--bg-secondary-color);

    &:hover {
      border-color: var(--border-focus-color);
      transform: translateY(-2px);
    }

    &.active {
      border-color: var(--border-pressed-color);
      box-shadow:
        0 0 0 1px var(--border-pressed-color),
        0 4px 20px var(--bg-overlay-primary-color);
    }

    &--custom {
      .theme-card-info {
        display: flex;
        align-items: stretch;
        padding: 0;
      }

      .theme-card-main {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 16px;
      }

      .theme-card-settings {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        background: var(--bg-primary-color);
        border-left: 1px solid var(--border-primary-color);
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--fg-secondary-color);

        &:hover {
          background: var(--fg-accent-color);
          color: var(--fg-inverted-color);
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    &-preview {
      height: 60px;
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 8px;

      .preview-header {
        height: 16px;
        border-radius: 4px;
        margin-bottom: 8px;
      }

      .preview-content {
        flex: 1;
        display: flex;
        gap: 6px;
      }

      .preview-element {
        height: 24px;
        border-radius: 3px;
        flex: 1;

        &--small {
          flex: 0.3;
        }
      }

      &--light {
        background: linear-gradient(135deg, light-theme.$bg-primary-color 0%, light-theme.$bg-tertiary-color 100%);

        .preview-header {
          background: light-theme.$fg-primary-color;
        }

        .preview-element {
          background: light-theme.$fg-secondary-color;

          &--small {
            background: light-theme.$fg-tertiary-color;
          }
        }
      }

      &--dark {
        background: linear-gradient(135deg, dark-theme.$bg-primary-color 0%, dark-theme.$bg-secondary-color 100%);

        .preview-header {
          background: dark-theme.$fg-primary-color;
        }

        .preview-element {
          background: dark-theme.$fg-secondary-color;

          &--small {
            background: dark-theme.$fg-tertiary-color;
          }
        }
      }

      &--custom {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        position: relative;

        .custom-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
        }

        .preview-header,
        .preview-element {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
        }

        .preview-element--small {
          background: rgba(255, 255, 255, 0.6);
        }
      }
    }

    &-info {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-tertiary-color);
      flex-shrink: 0;

      svg {
        width: 24px;
        height: 24px;
      }
    }

    &-content {
      flex: 1;
    }

    &-title {
      margin: 0 0 4px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--fg-primary-color);
    }

    &-description {
      margin: 0;
      font-size: 0.9rem;
      color: var(--fg-secondary-color);
      line-height: 1.3;
    }

    &-check {
      width: 24px;
      height: 24px;
      color: var(--border-accent-color);
      flex-shrink: 0;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.theme-editor {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 75vh;

  &-header {
    text-align: center;

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

  .theme-presets {
    .presets-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--fg-primary-color);
      margin-bottom: 12px;
      padding-left: 6px;
    }
    .presets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
      padding: 6px;
    }
    .preset-card {
      border: 1px solid var(--border-primary-color);
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        border-color: var(--border-accent-color);
      }
    }
    .preset-preview {
      display: flex;
      height: 24px;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .preset-color-chip {
      flex: 1;
    }
    .preset-name {
      font-size: 0.85rem;
      text-align: center;
      color: var(--fg-secondary-color);
      margin: 0;
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 6px;
    border-top: 1px solid var(--border-primary-color);
    padding-top: 24px;
  }

  &-item {
    display: flex;
    flex-direction: column;
    padding: 16px;
    border: 1px solid var(--border-primary-color);
    border-radius: 8px;
    background: var(--bg-secondary-color);
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--border-focus-color);
      background: var(--bg-primary-color);
    }
  }

  &-label {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--fg-primary-color);
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--bg-accent-color);
      opacity: 0.6;
    }
  }

  &-input-group {
    display: flex;
    align-items: center;
    gap: 12px;

    .color-picker-wrapper {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 6px;
        background: linear-gradient(45deg, transparent, var(--border-accent-color), transparent);
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: -1;
      }

      &:hover::after {
        opacity: 0.3;
      }
    }
  }

  &-color-swatch {
    width: 40px;
    height: 40px;
    border: 2px solid var(--border-primary-color);
    border-radius: 6px;
    cursor: pointer;
    background-color: transparent;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: var(--border-accent-color);
      transform: scale(1.05);
    }

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }

    &::-moz-color-swatch {
      border: none;
      border-radius: 4px;
    }
  }

  &-hex-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--border-primary-color);
    border-radius: 6px;
    background-color: var(--bg-primary-color);
    color: var(--fg-primary-color);
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--border-accent-color);
      box-shadow: 0 0 0 3px var(--bg-accent-color);
      background-color: var(--bg-secondary-color);
    }

    &::placeholder {
      color: var(--fg-tertiary-color);
    }
  }

  &-actions {
    display: flex;
    justify-content: flex-start;
    gap: 12px;
    padding: 16px 6px 0 6px;
    border-top: 1px solid var(--border-primary-color);
    margin-top: auto;
    position: sticky;
    bottom: 0;
    background: var(--bg-primary-color);
    z-index: 10;

    &::before {
      content: '';
      position: absolute;
      height: 20px;
      background: linear-gradient(transparent, var(--bg-primary-color));
      pointer-events: none;
    }

    .kit-btn {
      min-width: 120px;

      &.kit-btn--color-primary {
        margin-left: auto;
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.theme-editor-item {
  animation: slideIn 0.4s ease;

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.05}s;
    }
  }
}

@include media-down(sm) {
  .theme-chooser {
    min-width: auto;
    padding: 16px;
  }

  .theme-editor {
    min-width: auto;
    padding: 16px;

    &-grid {
      grid-template-columns: 1fr;
    }

    &-actions {
      flex-direction: column-reverse;
      gap: 8px;

      .kit-btn {
        width: 100%;

        &[type='primary'] {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
