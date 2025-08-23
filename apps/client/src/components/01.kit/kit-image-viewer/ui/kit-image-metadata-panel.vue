<script setup lang="ts">
import type { IImageViewerImageMeta } from '../models/types'
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'

interface Props {
  visible: boolean
  meta: IImageViewerImageMeta
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
  if (props.visible && !isMapChoiceVisible.value) {
    emit('close')
  }
})

onClickOutside(mapChoicePanelRef, () => {
  isMapChoiceVisible.value = false
})

const gpsCoordinates = computed(() => {
  if (props.meta.latitude != null && props.meta.longitude != null) {
    return { latitude: props.meta.latitude, longitude: props.meta.longitude }
  }
  return null
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

const takenAtDate = computed(() => {
  if (!props.meta.takenAt)
    return ''

  return new Date(props.meta.takenAt).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
  })
})

function formatFlash(flashValue: number | boolean | undefined): string {
  if (flashValue === null || typeof flashValue === 'undefined')
    return ''

  if (typeof flashValue === 'boolean')
    return flashValue ? 'Сработала' : 'Не сработала'

  const flashMap: Record<number, string> = {
    0: 'Не сработала',
    1: 'Сработала',
    5: 'Сработала (без детекции света)',
    7: 'Сработала (с детекцией света)',
    9: 'Принудительно',
    15: 'Принудительно (с детекцией)',
    16: 'Не сработала (принудительно)',
    24: 'Авто (не сработала)',
    25: 'Авто (сработала)',
    31: 'Авто (сработала, с детекцией)',
  }

  return flashMap[flashValue] ?? `Код ${flashValue}`
}

// --- Вычисляемые свойства для категорий ---

const cameraInfo = computed(() => {
  const meta = props.meta
  const items = [
    { label: 'Производитель', value: meta?.camera?.make, icon: 'mdi:factory' },
    { label: 'Модель', value: meta?.camera?.model, icon: 'mdi:camera' },
    { label: 'Объектив', value: meta?.camera?.lens, icon: 'mdi:lens' },
  ]
  return items.filter(item => item.value)
})

const settingsInfo = computed(() => {
  const settings = props.meta?.settings
  if (!settings)
    return []

  const shutterSpeed = settings.shutterSpeed
    ? settings.shutterSpeed
    : settings.exposureTime && settings.exposureTime < 1 && settings.exposureTime > 0
      ? `1/${Math.round(1 / settings.exposureTime)}s`
      : `${settings.exposureTime}s`

  const flashDisplayValue = formatFlash(settings.flash)
  const exposureModeValue = { 0: 'Авто' }[settings.exposureMode as number] ?? String(settings.exposureMode)
  const meteringModeValue = { 2: 'По центру' }[settings.meteringMode as number] ?? String(settings.meteringMode)
  const whiteBalanceValue = { 0: 'Авто' }[settings.whiteBalance as number] ?? String(settings.whiteBalance)

  const items = [
    { label: 'Диафрагма', value: settings.aperture ? `ƒ/${settings.aperture}` : '', icon: 'mdi:camera-iris' },
    { label: 'Выдержка', value: shutterSpeed, icon: 'mdi:timer-outline' },
    { label: 'ISO', value: settings.iso, icon: 'mdi:brightness-6' },
    { label: 'Фокусное расстояние', value: settings.focalLength ? `${settings.focalLength}mm` : '', icon: 'mdi:image-filter-center-focus' },
    { label: 'Вспышка', value: flashDisplayValue, icon: 'mdi:flash' },
    { label: 'Режим экспозиции', value: exposureModeValue, icon: 'mdi:camera-control' },
    { label: 'Режим замера', value: meteringModeValue, icon: 'mdi:camera-metering-center' },
    { label: 'Баланс белого', value: whiteBalanceValue, icon: 'mdi:white-balance-auto' },
  ]
  return items.filter(item => item.value)
})

const technicalInfo = computed(() => {
  const tech = props.meta?.technical
  const items = [
    { label: 'Разрешение', value: (props.meta.width && props.meta.height) ? `${props.meta.width} x ${props.meta.height}px` : '', icon: 'mdi:aspect-ratio' },
    { label: 'Размер файла', value: tech?.fileSize ? `${(tech.fileSize / 1024 / 1024).toFixed(2)} МБ` : '', icon: 'mdi:file-chart-outline' },
    { label: 'Формат', value: tech?.format, icon: 'mdi:file-outline' },
  ]
  return items.filter(item => item.value)
})

const generalInfo = computed(() => {
  const items: Array<{ label: string, value: any, icon: string, isMap?: boolean }> = [
    { label: 'Дата съемки', value: takenAtDate.value, icon: 'mdi:calendar-clock' },
  ]
  if (gpsCoordinates.value) {
    items.push({ label: 'GPS Координаты', value: 'Показать на карте', icon: 'mdi:map-marker', isMap: true })
  }
  return items.filter(item => item.value)
})

/**
 * Рекурсивно "уплощает" вложенный объект метаданных для удобного отображения.
 */
function flattenMetadata(obj: Record<string, any> | null | undefined, parentKey = ''): Record<string, any> {
  if (!obj)
    return {}
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenMetadata(value, newKey))
    }
    else {
      acc[newKey] = value
    }
    return acc
  }, {} as Record<string, any>)
}

const extendedInfo = computed(() => {
  const metadata = props.meta
  if (!metadata)
    return []

  const excludedKeys = new Set([
    'camera.make',
    'camera.model',
    'camera.lens',
    'settings.aperture',
    'settings.apertureValue',
    'settings.shutterSpeed',
    'settings.exposureTime',
    'settings.iso',
    'settings.focalLength',
    'settings.flash',
    'settings.exposureMode',
    'settings.meteringMode',
    'settings.whiteBalance',
    'technical.orientation',
    'technical.fileSize',
    'technical.format',
    'gps.bearing',
    'gps.gpsDate',
    'gps.altitude',
    'software.modifyDate',
  ])

  const flattened = flattenMetadata(metadata)

  return Object.entries(flattened)
    .filter(([key]) => !excludedKeys.has(key) && !key.startsWith('rawExif'))
    .map(([key, value]) => ({
      key,
      value: Array.isArray(value) ? value.join(', ') : (typeof value === 'object' ? JSON.stringify(value) : value),
    }))
    .filter(item => item.value !== null && item.value !== undefined)
})
</script>

<template>
  <Teleport to="body">
    <!-- Метаданные -->
    <Transition name="slide-from-right">
      <div v-if="visible" class="metadata-overlay">
        <div ref="panelRef" class="metadata-panel">
          <header class="panel-header">
            <div class="panel-title">
              <Icon icon="mdi:image-text" />
              <h3>Информация о снимке</h3>
            </div>
            <button class="close-btn-panel" title="Закрыть" @click="$emit('close')">
              <Icon icon="mdi:close" />
            </button>
          </header>
          <div class="panel-content">
            <!-- Общая информация -->
            <section class="info-section">
              <dl class="info-list">
                <div v-for="item in generalInfo" :key="item.label" class="info-item">
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

            <!-- Камера и объектив -->
            <section v-if="cameraInfo.length" class="info-section">
              <h4>Камера и объектив</h4>
              <dl class="info-list">
                <div v-for="item in cameraInfo" :key="item.label" class="info-item">
                  <dt>
                    <Icon :icon="item.icon" class="info-icon" />
                    <span>{{ item.label }}</span>
                  </dt>
                  <dd>{{ item.value }}</dd>
                </div>
              </dl>
            </section>

            <!-- Параметры съёмки -->
            <section v-if="settingsInfo.length" class="info-section">
              <h4>Параметры съёмки</h4>
              <dl class="info-list">
                <div v-for="item in settingsInfo" :key="item.label" class="info-item">
                  <dt>
                    <Icon :icon="item.icon" class="info-icon" />
                    <span>{{ item.label }}</span>
                  </dt>
                  <dd>{{ item.value }}</dd>
                </div>
              </dl>
            </section>

            <!-- Техническая информация -->
            <section v-if="technicalInfo.length" class="info-section">
              <h4>Техническая информация</h4>
              <dl class="info-list">
                <div v-for="item in technicalInfo" :key="item.label" class="info-item">
                  <dt>
                    <Icon :icon="item.icon" class="info-icon" />
                    <span>{{ item.label }}</span>
                  </dt>
                  <dd>{{ item.value }}</dd>
                </div>
              </dl>
            </section>

            <!-- Расширенные данные -->
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
  z-index: 13;
  display: flex;
  justify-content: flex-end;
}

.metadata-panel {
  width: 100%;
  max-width: 420px;
  height: 100%;
  background: var(--bg-secondary-color);
  color: var(--fg-primary-color);
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-primary-color);
  box-shadow: var(--s-l);

  @include media-down(sm) {
    max-width: 100%;
    width: 100%;
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-primary-color);
  flex-shrink: 0;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  color: var(--fg-secondary-color);

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--fg-primary-color);
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
  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--fg-tertiary-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-bottom: 8px;
    margin: 0 0 4px 0;
    border-bottom: 1px solid var(--border-secondary-color);
  }
}

.extended-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px !important;
  border-bottom: 1px solid var(--border-secondary-color) !important;

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
  padding: 10px 0;
  border-bottom: 1px solid var(--border-secondary-color);
  &:last-child {
    border-bottom: none;
  }
  dt {
    color: var(--fg-secondary-color);
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
  }
  dd {
    margin: 0;
    color: var(--fg-primary-color);
    text-align: right;
    word-break: break-all;
    font-weight: 500;
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
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.extended-list {
  font-size: 0.85rem;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-s);
  padding: 0 12px;

  .info-item {
    border-color: var(--border-primary-color);
  }
  dt {
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--fg-tertiary-color);
  }
  dd {
    color: var(--fg-secondary-color);
    font-weight: 400;
  }
}

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

.map-overlay-iframe {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @include media-down(sm) {
    padding: 12px;
  }
}

.map-container {
  width: 100%;
  height: 100%;
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
