<script setup lang="ts">
import type { TripImage } from '~/shared/types/models/trip'
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'

interface Props {
  visible: boolean
  image: TripImage
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const panelRef = ref<HTMLElement | null>(null)
const mapChoicePanelRef = ref<HTMLElement | null>(null)
const showExtended = ref(false)

// --- Состояния для управления картами ---
const isMapChoiceVisible = ref(false)
const isMapVisible = ref(false)
const selectedMapUrl = ref<string | null>(null)

// --- Провайдеры карт ---
const mapProviders = [
  {
    name: 'Google Maps',
    icon: 'mdi:google-maps',
    urlTemplate: 'https://www.google.com/maps?q={lat},{lon}&output=embed',
  },
  {
    name: 'OpenStreetMap',
    icon: 'mdi:map-marker-outline',
    urlTemplate: 'https://www.openstreetmap.org/export/embed.html?bbox={bbox}&layer=mapnik&marker={lat},{lon}',
  },
]

onClickOutside(panelRef, () => {
  if (props.visible) {
    emit('close')
  }
})

onClickOutside(mapChoicePanelRef, () => {
  isMapChoiceVisible.value = false
})

// Приоритет отдается полям верхнего уровня `latitude` и `longitude`.
const gpsCoordinates = computed(() => {
  if (props.image.latitude != null && props.image.longitude != null) {
    return { latitude: props.image.latitude, longitude: props.image.longitude }
  }
  // Fallback на парсинг из metadata, если поля верхнего уровня отсутствуют
  const meta = props.image.metadata
  if (!meta || !meta.GPSLatitude || !meta.GPSLongitude || !meta.GPSLatitudeRef || !meta.GPSLongitudeRef) {
    return null
  }

  try {
    const parseGpsValue = (dms: string | number[], ref: string): number => {
      const parts: number[] = Array.isArray(dms) ? dms.map(Number) : String(dms).split(',').map(part => Number.parseFloat(part.trim()))
      if (parts.length !== 3 || parts.some(Number.isNaN))
        throw new Error('Invalid DMS format')
      const [degrees, minutes, seconds] = parts
      let decimal = degrees + minutes / 60 + seconds / 3600
      if (ref === 'S' || ref === 'W') {
        decimal = -decimal
      }
      return decimal
    }
    const latitude = parseGpsValue(meta.GPSLatitude, meta.GPSLatitudeRef)
    const longitude = parseGpsValue(meta.GPSLongitude, meta.GPSLongitudeRef)
    return { latitude, longitude }
  }
  catch (error) {
    console.error('Error parsing GPS coordinates from metadata:', error)
    return null
  }
})

function openMapChoice() {
  if (gpsCoordinates.value) {
    isMapChoiceVisible.value = true
  }
}

function selectMapProvider(provider: typeof mapProviders[0]) {
  const coords = gpsCoordinates.value
  if (!coords)
    return

  let url = ''
  if (provider.name === 'OpenStreetMap') {
    const delta = 0.008
    const bbox = [coords.longitude - delta, coords.latitude - delta, coords.longitude + delta, coords.latitude + delta].join(',')
    url = provider.urlTemplate.replace('{bbox}', bbox).replace('{lat}', String(coords.latitude)).replace('{lon}', String(coords.longitude))
  }
  else {
    url = provider.urlTemplate.replace('{lat}', String(coords.latitude)).replace('{lon}', String(coords.longitude))
  }

  selectedMapUrl.value = url
  isMapChoiceVisible.value = false
  isMapVisible.value = true
}

function closeMap() {
  isMapVisible.value = false
  selectedMapUrl.value = null
}

const resolution = computed(() => {
  if (!props.image.width || !props.image.height)
    return ''
  return `${props.image.width} x ${props.image.height}px`
})

const cameraName = computed(() => [props.image.metadata?.cameraMake, props.image.metadata?.cameraModel].filter(Boolean).join(' '))

const formattedExposureTime = computed(() => {
  const exposureTime = props.image.metadata?.exposureTime
  if (exposureTime === undefined || exposureTime === null)
    return ''
  if (exposureTime < 1 && exposureTime > 0) {
    const reciprocal = Math.round(1 / exposureTime)
    return `1/${reciprocal}s`
  }
  return `${exposureTime}s`
})

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

const basicInfo = computed(() => {
  const meta = props.image.metadata
  const items: Array<{ label: string, value: any, icon: string, isMap?: boolean }> = [
    { label: 'Камера', value: cameraName.value, icon: 'mdi:camera' },
    { label: 'Разрешение', value: resolution.value, icon: 'mdi:aspect-ratio' },
    { label: 'Диафрагма', value: meta?.fNumber ? `ƒ/${meta.fNumber}` : '', icon: 'mdi:camera-iris' },
    { label: 'Выдержка', value: formattedExposureTime.value, icon: 'mdi:timer-outline' },
    { label: 'ISO', value: meta?.iso, icon: 'mdi:brightness-6' },
    { label: 'Фокусное расстояние', value: meta?.focalLength ? `${meta.focalLength}mm` : '', icon: 'mdi:image-filter-center-focus' },
    { label: 'Дата съемки', value: takenAtDate.value, icon: 'mdi:calendar-clock' },
  ]
  if (gpsCoordinates.value) {
    items.push({ label: 'GPS Координаты', value: 'Показать на карте', icon: 'mdi:map-marker', isMap: true })
  }
  return items.filter(item => item.value)
})

const extendedInfo = computed(() => {
  if (!props.image.metadata)
    return []

  const excludedKeys = new Set([
    'orientation',
    'timezoneOffset',
    'cameraMake',
    'cameraModel',
    'fNumber',
    'exposureTime',
    'iso',
    'focalLength',
    'apertureValue',
    'GPSLatitude',
    'GPSLongitude',
    'GPSLatitudeRef',
    'GPSLongitudeRef', 
  ])

  return Object.entries(props.image.metadata)
    .filter(([key]) => !excludedKeys.has(key))
    .map(([key, value]) => ({
      key,
      value: Array.isArray(value) ? value.join(', ') : (typeof value === 'object' ? JSON.stringify(value) : value),
    }))
})
</script>

<template>
  <Teleport to="body">
    <!-- Метаданные -->
    <Transition name="slide-from-right">
      <div v-if="visible" class="metadata-overlay">
        <div ref="panelRef" class="metadata-panel">
          <header class="panel-header">
            <h3>Информация о снимке</h3>
            <button class="close-btn-panel" title="Закрыть" @click="$emit('close')">
              <Icon icon="mdi:close" />
            </button>
          </header>
          <div class="panel-content">
            <section class="info-section">
              <h4>Основные параметры</h4>
              <dl class="info-list">
                <div v-for="item in basicInfo" :key="item.label" class="info-item">
                  <dt>
                    <Icon :icon="item.icon" class="info-icon" />
                    <span>{{ item.label }}</span>
                  </dt>
                  <dd>
                    <button v-if="item.isMap" class="map-link" @click="openMapChoice">
                      <span>{{ item.value }}</span>
                      <Icon icon="mdi:map-search-outline" class="link-icon" />
                    </button>
                    <template v-else>
                      {{ item.value }}
                    </template>
                  </dd>
                </div>
              </dl>
            </section>
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

    <!-- Модальное окно выбора карты -->
    <Transition name="fade">
      <div v-if="isMapChoiceVisible" class="map-choice-overlay">
        <div ref="mapChoicePanelRef" class="map-choice-panel">
          <h4>Выберите карту</h4>
          <div class="map-provider-list">
            <button
              v-for="provider in mapProviders"
              :key="provider.name"
              class="map-provider-btn"
              @click="selectMapProvider(provider)"
            >
              <Icon :icon="provider.icon" class="provider-icon" />
              <span>{{ provider.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Карта в iframe -->
    <Transition name="fade">
      <div v-if="isMapVisible" class="map-overlay-iframe">
        <div class="map-container">
          <iframe
            v-if="selectedMapUrl"
            :src="selectedMapUrl"
            width="100%"
            height="100%"
            frameborder="0"
            style="border:0;"
            allowfullscreen
          />
        </div>
        <button class="close-map-btn" title="Закрыть карту" @click="closeMap">
          <Icon icon="mdi:close" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.metadata-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(2px);
}

.metadata-panel {
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: var(--bg-secondary-color);
  color: var(--fg-primary-color);
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-primary-color);
  box-shadow: var(--s-l);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-primary-color);
  flex-shrink: 0;
  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.close-btn-panel {
  color: var(--fg-tertiary-color);
  font-size: 24px;
  transition: color 0.2s;
  &:hover {
    color: var(--fg-primary-color);
  }
}

.panel-content {
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-primary-color);
    border-radius: var(--r-2xs);
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.info-section {
  margin-bottom: 24px;
  h4 {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--fg-tertiary-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-bottom: 12px;
    margin: 0;
  }
}

.extended-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  span {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--fg-tertiary-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  button {
    color: var(--fg-accent-color);
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;
    &:hover {
      color: var(--bg-action-hover-color);
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
  padding: 12px 0;
  border-bottom: 1px solid var(--border-primary-color);
  &:last-child {
    border-bottom: none;
  }
  dt {
    color: var(--fg-secondary-color);
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }
  dd {
    margin: 0;
    color: var(--fg-primary-color);
    text-align: right;
    word-break: break-all;
  }
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--fg-accent-color);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
  font-size: inherit;
  &:hover {
    color: var(--bg-action-hover-color);
    text-decoration: underline;
  }
  .link-icon {
    font-size: 1.1em;
    opacity: 0.9;
  }
}

.info-icon {
  font-size: 18px;
  color: var(--fg-muted-color);
}

.extended-list {
  font-size: 0.85rem;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-s);
  padding: 0 12px;
  .info-item {
    border-color: var(--border-secondary-color);
  }
  dt {
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--fg-tertiary-color);
  }
  dd {
    color: var(--fg-secondary-color);
  }
}

/* Стили для модального окна выбора карты */
.map-choice-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-choice-panel {
  background-color: var(--bg-secondary-color);
  color: var(--fg-primary-color);
  padding: 24px;
  border-radius: var(--r-m);
  border: 1px solid var(--border-primary-color);
  box-shadow: var(--s-xl);
  width: 90%;
  max-width: 320px;

  h4 {
    margin: 0 0 20px 0;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--fg-secondary-color);
  }
}

.map-provider-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.map-provider-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  border-radius: var(--r-s);
  background-color: var(--bg-tertiary-color);
  color: var(--fg-primary-color);
  font-size: 1rem;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
    transform: translateY(-2px);
  }

  .provider-icon {
    font-size: 22px;
    color: var(--fg-accent-color);
  }
}

/* Стили для оверлея с картой */
.map-overlay-iframe {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10002; /* Выше чем оверлей выбора */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.map-container {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  max-height: 90vh;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-m);
  border: 1px solid var(--border-primary-color);
  overflow: hidden;
  box-shadow: var(--s-xl);
}

.close-map-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.1);
  }
}

.slide-from-right-enter-active,
.slide-from-right-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-from-right-enter-from,
.slide-from-right-leave-to {
  transform: translateX(100%);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
