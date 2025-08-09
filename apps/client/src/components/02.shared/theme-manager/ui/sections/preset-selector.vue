<script setup lang="ts">
import type { ThemePreset } from '../../constants/theme-presets'
import type { ColorPalette } from '~/shared/store/theme.store'

defineProps<{
  presets: ThemePreset[]
}>()

const emit = defineEmits<{
  (e: 'applyPreset', palette: ColorPalette): void
}>()
</script>

<template>
  <div class="preset-selector">
    <div class="presets-description">
      <h4 class="presets-title">
        Вариации пресетов
      </h4>
      <p>
        Пресеты — это готовые наборы цветовых переменных, которые определяют внешний вид интерфейса.
        Вы можете выбрать один из предложенных пресетов в качестве отправной точки для своей
        пользовательской темы. После выбора пресета его цвета будут применены, и вы сможете
        отредактировать их во вкладке «Редактор цветов».
      </p>
    </div>
    <div class="presets-grid">
      <div
        v-for="preset in presets"
        :key="preset.name"
        class="preset-card"
        @click="emit('applyPreset', preset.palette)"
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
</template>

<style lang="scss" scoped>
.presets-description {
  margin-bottom: 24px;
  padding: 0 6px;

  .presets-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--fg-primary-color);
    margin: 0 0 8px 0;
  }

  p {
    font-size: 0.95rem;
    color: var(--fg-secondary-color);
    line-height: 1.5;
    margin: 0;
  }
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
    box-shadow: 0 4px 12px var(--bg-overlay-primary-color);
  }
}

.preset-preview {
  display: flex;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  border: 1px solid var(--border-secondary-color);
}

.preset-color-chip {
  flex: 1;
}

.preset-name {
  font-size: 0.85rem;
  text-align: center;
  color: var(--fg-secondary-color);
  margin: 0;
  font-weight: 500;
}
</style>
