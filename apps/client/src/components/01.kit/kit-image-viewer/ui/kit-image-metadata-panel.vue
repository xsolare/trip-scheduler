<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'

/**
 * Определяем интерфейс для метаданных.
 * Он основан на предоставленной вами структуре объекта `image`.
 */
interface ImageMetadata {
  width?: number
  height?: number
  cameraMake?: string
  cameraModel?: string
  fNumber?: number
  exposureTime?: number
  iso?: number
  focalLength?: number
  takenAt?: string
  extendedMetadata?: Record<string, any>
}

interface Props {
  visible: boolean
  image: ImageMetadata
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const panelRef = ref<HTMLElement | null>(null)
const showExtended = ref(false)

onClickOutside(panelRef, () => {
  if (props.visible) {
    emit('close')
  }
})

// Разрешение изображения
const resolution = computed(() => {
  if (!props.image.width || !props.image.height)
    return ''
  return `${props.image.width} x ${props.image.height}px`
})

// Название камеры
const cameraName = computed(() => [props.image.cameraMake, props.image.cameraModel].filter(Boolean).join(' '))

// Форматирование выдержки (например, 1/125s)
const formattedExposureTime = computed(() => {
  if (props.image.exposureTime === undefined)
    return ''
  if (props.image.exposureTime < 1 && props.image.exposureTime > 0) {
    const reciprocal = Math.round(1 / props.image.exposureTime)
    return `1/${reciprocal}s`
  }
  return `${props.image.exposureTime}s`
})

// Дата съемки
const takenAtDate = computed(() => {
  if (!props.image.takenAt)
    return 'N/A'
  return new Date(props.image.takenAt).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// Группировка основных данных
const basicInfo = computed(() => ([
  { label: 'Камера', value: cameraName.value, icon: 'mdi:camera' },
  { label: 'Разрешение', value: resolution.value, icon: 'mdi:aspect-ratio' },
  { label: 'Диафрагма', value: props.image.fNumber ? `ƒ/${props.image.fNumber}` : '', icon: 'mdi:camera-iris' },
  { label: 'Выдержка', value: formattedExposureTime.value, icon: 'mdi:timer-outline' },
  { label: 'ISO', value: props.image.iso, icon: 'mdi:brightness-6' },
  { label: 'Фокусное расстояние', value: props.image.focalLength ? `${props.image.focalLength}mm` : '', icon: 'mdi:image-filter-center-focus' },
  { label: 'Дата съемки', value: takenAtDate.value, icon: 'mdi:calendar-clock' },
].filter(item => item.value)))

// Подготовка расширенных данных
const extendedInfo = computed(() => {
  if (!props.image.extendedMetadata)
    return []
  return Object.entries(props.image.extendedMetadata).map(([key, value]) => ({
    key,
    value: Array.isArray(value) ? value.join(', ') : (typeof value === 'object' ? JSON.stringify(value) : value),
  }))
})
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-fade">
      <div v-if="visible" class="metadata-overlay">
        <div ref="panelRef" class="metadata-panel">
          <header class="panel-header">
            <h3>Информация о снимке</h3>
            <button class="close-btn-panel" title="Закрыть" @click="$emit('close')">
              <Icon icon="mdi:close" />
            </button>
          </header>

          <div class="panel-content">
            <!-- Основная информация -->
            <section class="info-section">
              <h4>Основные параметры</h4>
              <dl class="info-list">
                <div v-for="item in basicInfo" :key="item.label" class="info-item">
                  <dt>
                    <Icon :icon="item.icon" class="info-icon" />
                    <span>{{ item.label }}</span>
                  </dt>
                  <dd>{{ item.value }}</dd>
                </div>
              </dl>
            </section>

            <!-- Расширенная информация (EXIF) -->
            <section v-if="extendedInfo.length" class="info-section">
              <h4 class="extended-header">
                <span>Расширенные данные (EXIF)</span>
                <button @click="showExtended = !showExtended">
                  <Icon :icon="showExtended ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
                  {{ showExtended ? 'Скрыть' : 'Показать' }}
                </button>
              </h4>
              <Transition name="fade-height">
                <div v-if="showExtended">
                  <dl class="info-list extended-list">
                    <div v-for="item in extendedInfo" :key="item.key" class="info-item">
                      <dt>{{ item.key }}</dt>
                      <dd>{{ item.value }}</dd>
                    </div>
                  </dl>
                </div>
              </Transition>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.metadata-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  display: flex;
  justify-content: flex-end;
}

.metadata-panel {
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: #1c1c1e;
  color: #f0f0f0;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
  border-left: 1px solid #333;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #333;
  flex-shrink: 0;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.close-btn-panel {
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: white;
  }
}

.panel-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: #1c1c1e;
  }
}

.info-section {
  margin-bottom: 24px;
  h4 {
    font-size: 0.9rem;
    font-weight: 500;
    color: #aaa;
    margin: 0 0 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.extended-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: none;
    border: none;
    color: #8a8a8e;
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 4px;
    &:hover {
      color: white;
    }
  }
}

.info-list {
  margin: 0;
  font-size: 0.95rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #2a2a2c;

  &:last-child {
    border-bottom: none;
  }

  dt {
    color: #aaa;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  dd {
    margin: 0;
    color: #f0f0f0;
    text-align: right;
    word-break: break-all;
  }
}

.info-icon {
  font-size: 18px;
  color: #666;
}

.extended-list {
  font-size: 0.85rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 0 12px;
  margin-top: 12px;

  dt {
    font-family: monospace;
    font-size: 0.8rem;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-height-enter-active,
.fade-height-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}
.fade-height-enter-from,
.fade-height-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-height-enter-to,
.fade-height-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
