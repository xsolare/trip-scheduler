<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { ActivitySectionGeolocation, Coordinate, MapPoint } from '../models/types'
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import { toLonLat } from 'ol/proj'
import { v4 as uuidv4 } from 'uuid'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { KitInput } from '~/components/01.kit/kit-input'
import { useToast } from '~/components/01.kit/kit-toast'
import { KitViewSwitcher } from '~/components/01.kit/kit-view-switcher'
import { useGeolocationMap } from '../composables/use-geolocation-map'
import GeolocationContextMenu from './geolocation-context-menu.vue'
import GeolocationMapControls from './geolocation-map-controls.vue'

import 'ol/ol.css'

interface Props {
  section: ActivitySectionGeolocation
  readonly?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  height: '350px',
})

const emit = defineEmits(['update:section'])

const {
  mapInstance,
  isMapLoaded,
  initMap,
  addOrUpdatePoint,
  removePoint,
  fetchAddress,
  flyToLocation,
} = useGeolocationMap()

// --- Цветовая палитра для маркеров ---
const POI_COLORS = [
  '#E6194B',
  '#3CB44B',
  '#FFE119',
  '#4363D8',
  '#F58231',
  '#911EB4',
  '#46F0F0',
  '#F032E6',
  '#BCF60C',
  '#FABEBE',
  '#008080',
  '#E6BEFF',
  '#9A6324',
  '#FFFAC8',
  '#800000',
  '#AAFFC3',
  '#808000',
  '#FFD8B1',
  '#000075',
  '#808080',
]

// --- Глобальное состояние компонента ---
const mapContainerRef = ref<HTMLElement>()
const mode = ref<'pan' | 'add_point' | 'build_route' | 'move_point'>('pan')
const isLoading = ref(false)
const pointToMoveId = ref<string | null>(null)
const points = ref<MapPoint[]>([])
const poiPoints = computed(() => points.value.filter(p => p.type === 'poi'))

// Состояние для полноэкранного режима
const isMapFullscreen = ref(false)
const isPanelVisibleInFullscreen = ref(false)

// Добавляем стиль (цвет) к каждой точке для отображения
const poiPointsWithStyle = computed(() => {
  return poiPoints.value.map((point, index) => {
    const color = POI_COLORS[index % POI_COLORS.length]
    // Обновляем маркер на карте, если цвет изменился
    if (point.style?.color !== color) {
      const updatedPoint = {
        ...point,
        style: { ...point.style, color },
      }
      addOrUpdatePoint(updatedPoint)
      return updatedPoint
    }
    return point
  })
})

// --- Вычисляемые свойства для безопасного доступа к данным ---
const mapCenter = computed<Coordinate>(() => {
  if (props.section.points?.length > 0) {
    return props.section.points[0].coordinates
  }
  return [37.6176, 55.7558] // Значение по умолчанию (Москва), если нет точек
})

// --- Данные для контролов ---
const newPointLat = ref('')
const newPointLon = ref('')

const modeItems: ViewSwitcherItem[] = [
  { id: 'pan', icon: 'mdi:cursor-move', label: 'Панорама' },
  { id: 'add_point', icon: 'mdi:map-marker-plus', label: 'Точка' },
]

// --- Логика для контекстного меню ---
const contextMenuRef = ref<HTMLElement | null>(null)
const isContextMenuVisible = ref(false)
const contextMenuPosition = reactive({ top: 0, left: 0 })

async function handleMapClick(event: MouseEvent) {
  if (props.readonly || !mapInstance.value)
    return

  const coords = toLonLat(mapInstance.value.getEventCoordinate(event)) as Coordinate

  if (mode.value === 'add_point') {
    await addPoiPoint(coords)
    mode.value = 'pan'
    return
  }

  if (mode.value === 'move_point' && pointToMoveId.value) {
    await movePoint(pointToMoveId.value, coords)
    pointToMoveId.value = null
    mode.value = 'pan'
  }
}

// --- Управление одиночными точками (POI) ---
async function addPoiPoint(coords: Coordinate) {
  isLoading.value = true
  const addressInfo = await fetchAddress(coords)
  isLoading.value = false
  if (!addressInfo)
    return

  const newPoint: MapPoint = {
    id: uuidv4(),
    coordinates: coords,
    type: 'poi',
    address: addressInfo.address,
    comment: '',
  }
  points.value.push(newPoint)
  addOrUpdatePoint(newPoint)
}

async function addPointFromInputs() {
  const lat = Number.parseFloat(newPointLat.value)
  const lon = Number.parseFloat(newPointLon.value)

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    useToast().error('Неверный формат координат!')
    return
  }

  await addPoiPoint([lon, lat])
  newPointLat.value = ''
  newPointLon.value = ''
}

async function deletePoiPoint(pointId: string) {
  removePoint(pointId)
  points.value = points.value.filter(p => p.id !== pointId)
}

function startMovePoint(pointId: string) {
  pointToMoveId.value = pointId
  mode.value = 'move_point'
}

async function movePoint(pointId: string, newCoords: Coordinate) {
  const point = points.value.find(p => p.id === pointId)
  if (!point)
    return

  isLoading.value = true
  const addressInfo = await fetchAddress(newCoords)
  isLoading.value = false

  point.coordinates = newCoords
  point.address = addressInfo?.address || 'Адрес не найден'
  addOrUpdatePoint(point)
}

async function updatePointCoords(point: MapPoint) {
  const lon = Number(point.coordinates[0])
  const lat = Number(point.coordinates[1])

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    useToast().error('Неверный формат координат!')
    return
  }
  point.coordinates = [lon, lat]

  await movePoint(point.id, point.coordinates)
  flyToLocation(lon, lat, 16)
}

function focusOnPoint(point: MapPoint) {
  if (props.readonly) {
    flyToLocation(point.coordinates[0], point.coordinates[1], 16)
  }
}

function handlePointUpdate(point: MapPoint) {
  // Обновляем оверлей с комментарием на карте
  addOrUpdatePoint(point)

  // Находим индекс точки и заменяем ее в массиве, чтобы вызвать обновление UI
  const index = points.value.findIndex(p => p.id === point.id)
  if (index !== -1) {
    // Замена элемента в массиве гарантирует срабатывание реактивности Vue
    points.value.splice(index, 1, { ...point })
  }
}

// --- Контекстное меню ---
function openContextMenu(event: MouseEvent) {
  if (props.readonly || !mapInstance.value)
    return

  const mapContainer = mapInstance.value.getTargetElement() as HTMLElement
  const mapRect = mapContainer.getBoundingClientRect()

  contextMenuPosition.top = event.clientY - mapRect.top
  contextMenuPosition.left = event.clientX - mapRect.left

  isContextMenuVisible.value = true
}

function handleContextMenuAction() {
  isContextMenuVisible.value = false
}

// --- Инициализация и обработчики карты ---
onClickOutside(contextMenuRef, () => {
  isContextMenuVisible.value = false
})

watch(points, (newPoints) => {
  emit('update:section', {
    ...props.section,
    points: newPoints,
  })
}, { deep: true })

onMounted(async () => {
  if (!mapContainerRef.value)
    return

  await initMap({
    container: mapContainerRef.value,
    center: mapCenter.value,
    zoom: 14,
    interactive: !props.readonly,
  })

  points.value = JSON.parse(JSON.stringify(props.section.points || []))
  points.value.forEach(addOrUpdatePoint)

  mapInstance.value?.on('click', (event) => {
    handleMapClick(event.originalEvent as MouseEvent)
  })
})
</script>

<template>
  <div class="geolocation-section">
    <!-- ПАНЕЛЬ УПРАВЛЕНИЯ (ОБЫЧНЫЙ РЕЖИМ) -->
    <div v-if="!readonly && !isMapFullscreen" class="geolocation-controls-panel">
      <div class="modes-group">
        <KitViewSwitcher v-model="mode" :items="modeItems" />
      </div>
      <div v-if="mode !== 'pan'" class="add-by-coords-group">
        <KitInput v-model="newPointLat" type="text" placeholder="Широта" size="sm" />
        <KitInput v-model="newPointLon" type="text" placeholder="Долгота" size="sm" />
        <KitBtn icon="mdi:plus" aria-label="Добавить точку по координатам" @click="addPointFromInputs" />
      </div>
    </div>

    <!-- СПИСОК ТОЧЕК ИНТЕРЕСА (POI) (ОБЫЧНЫЙ РЕЖИМ) -->
    <div v-if="poiPointsWithStyle.length > 0 && !isMapFullscreen" class="poi-list">
      <div
        v-for="(point, index) in poiPointsWithStyle"
        :key="point.id"
        class="poi-item"
        :class="{ 'is-readonly': readonly }"
        @click="focusOnPoint(point)"
      >
        <div class="poi-marker-visual">
          <span class="poi-number" :style="{ backgroundColor: point.style?.color }">
            {{ index + 1 }}
          </span>
        </div>

        <div class="poi-info">
          <div class="poi-field">
            <Icon icon="mdi:map-marker-outline" class="field-icon" />
            <KitInlineMdEditorWrapper
              v-if="!readonly"
              v-model="point.address!"
              class="poi-editor poi-address"
              :features="{
                'block-edit': false,
                'code-mirror': false,
                'cursor': false,
                'image-block': false,
                'latex': false,
                'link-tooltip': false,
                'table': false,
                'toolbar': false,
              }"
              placeholder="Адрес не найден"
              @blur="handlePointUpdate(point)"
            />
            <span v-else class="poi-text">{{ point.address || 'Адрес не найден' }}</span>
          </div>
          <div class="poi-field">
            <Icon icon="mdi:comment-text-outline" class="field-icon" />
            <KitInlineMdEditorWrapper
              v-if="!readonly"
              v-model="point.comment!"
              class="poi-editor poi-comment"
              :features="{
                'block-edit': false,
                'code-mirror': false,
                'cursor': false,
                'image-block': false,
                'latex': false,
                'link-tooltip': false,
                'table': false,
                'toolbar': false,
              }"
              placeholder="Добавить комментарий"
              @blur="handlePointUpdate(point)"
            />
            <span v-else class="poi-text poi-text-comment">{{ point.comment || 'Нет комментария' }}</span>
          </div>

          <div v-if="!readonly" class="poi-controls">
            <div class="poi-coords">
              <KitInput v-model="point.coordinates[1]" size="sm" type="text" @keydown.enter="updatePointCoords(point)" @blur="updatePointCoords(point)" />
              <KitInput v-model="point.coordinates[0]" size="sm" type="text" @keydown.enter="updatePointCoords(point)" @blur="updatePointCoords(point)" />
            </div>
            <div class="poi-actions">
              <KitBtn icon="mdi:arrow-all" variant="outlined" size="sm" aria-label="Переместить точку" @click="startMovePoint(point.id)" />
              <KitBtn icon="mdi:delete-outline" variant="solid" size="sm" aria-label="Удалить точку" @click="deletePoiPoint(point.id)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- КАРТА -->
    <div
      ref="mapContainerRef"
      class="geolocation-map-container"
      :style="{ height }"
      :class="{ 'cursor-crosshair': mode === 'add_point' || mode === 'move_point', 'cursor-grab': mode === 'pan' }"
      @contextmenu.prevent="openContextMenu"
    >
      <div v-if="!isMapLoaded || isLoading" class="loading-overlay">
        <span>{{ isLoading ? 'Загрузка...' : 'Инициализация карты...' }}</span>
      </div>
      <GeolocationMapControls
        :map-instance="mapInstance"
        :center-coordinates="mapCenter"
        :is-fullscreen="isMapFullscreen"
        @update:is-fullscreen="isMapFullscreen = $event"
        @toggle-panel="isPanelVisibleInFullscreen = !isPanelVisibleInFullscreen"
      />
      <div ref="contextMenuRef">
        <GeolocationContextMenu :visible="isContextMenuVisible" :top="contextMenuPosition.top" :left="contextMenuPosition.left" @action="handleContextMenuAction" />
      </div>

      <!-- ПАНЕЛЬ ДЛЯ ПОЛНОЭКРАННОГО РЕЖИМА -->
      <Transition name="slide-fade">
        <div v-if="isMapFullscreen && isPanelVisibleInFullscreen" class="fullscreen-side-panel">
          <!-- ПАНЕЛЬ УПРАВЛЕНИЯ (ПОЛНОЭКРАННЫЙ РЕЖИМ) -->
          <div v-if="!readonly" class="geolocation-controls-panel">
            <div class="modes-group">
              <KitViewSwitcher v-model="mode" :items="modeItems" />
            </div>
            <div v-if="mode !== 'pan'" class="add-by-coords-group">
              <KitInput v-model="newPointLat" type="text" placeholder="Широта" size="sm" />
              <KitInput v-model="newPointLon" type="text" placeholder="Долгота" size="sm" />
              <KitBtn icon="mdi:plus" aria-label="Добавить точку по координатам" @click="addPointFromInputs" />
            </div>
          </div>
          <!-- СПИСОК ТОЧЕК (ПОЛНОЭКРАННЫЙ РЕЖИМ) -->
          <div v-if="poiPointsWithStyle.length > 0" class="poi-list">
            <div
              v-for="(point, index) in poiPointsWithStyle"
              :key="point.id"
              class="poi-item"
              :class="{ 'is-readonly': readonly }"
              @click="focusOnPoint(point)"
            >
              <div class="poi-marker-visual">
                <span class="poi-number" :style="{ backgroundColor: point.style?.color }">
                  {{ index + 1 }}
                </span>
              </div>
              <div class="poi-info">
                <div class="poi-field">
                  <Icon icon="mdi:map-marker-outline" class="field-icon" />
                  <KitInlineMdEditorWrapper
                    v-if="!readonly"
                    v-model="point.address!"
                    class="poi-editor poi-address" placeholder="Адрес не найден"
                    :features="{
                      'block-edit': false,
                      'code-mirror': false,
                      'cursor': false,
                      'image-block': false,
                      'latex': false,
                      'link-tooltip': false,
                      'table': false,
                      'toolbar': false,
                    }"
                    @blur="handlePointUpdate(point)"
                  />
                  <span v-else class="poi-text">{{ point.address || 'Адрес не найден' }}</span>
                </div>
                <div class="poi-field">
                  <Icon icon="mdi:comment-text-outline" class="field-icon" />
                  <KitInlineMdEditorWrapper
                    v-if="!readonly"
                    v-model="point.comment!"
                    class="poi-editor poi-comment"
                    placeholder="Добавить комментарий"
                    :features="{
                      'block-edit': false,
                      'code-mirror': false,
                      'cursor': false,
                      'image-block': false,
                      'latex': false,
                      'link-tooltip': false,
                      'table': false,
                      'toolbar': false,
                    }"
                    @blur="handlePointUpdate(point)"
                  />
                  <span v-else class="poi-text poi-text-comment">{{ point.comment || 'Нет комментария' }}</span>
                </div>
                <div v-if="!readonly" class="poi-controls">
                  <div class="poi-coords">
                    <KitInput v-model="point.coordinates[1]" size="sm" type="text" @keydown.enter="updatePointCoords(point)" @blur="updatePointCoords(point)" />
                    <KitInput v-model="point.coordinates[0]" size="sm" type="text" @keydown.enter="updatePointCoords(point)" @blur="updatePointCoords(point)" />
                  </div>
                  <div class="poi-actions">
                    <KitBtn icon="mdi:arrow-all" variant="outlined" size="sm" aria-label="Переместить точку" @click="startMovePoint(point.id)" />
                    <KitBtn icon="mdi:delete-outline" variant="solid" size="sm" aria-label="Удалить точку" @click="deletePoiPoint(point.id)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.ol-popup-comment {
  background-color: var(--bg-secondary-color);
  color: var(--fg-primary-color);
  padding: 6px 10px;
  border-radius: var(--r-xs);
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  border: 1px solid var(--border-secondary-color);
  box-shadow: var(--s-m);
}
</style>

<style scoped lang="scss">
.modes-group {
  .kit-view-switcher {
    background-color: var(--bg-tertiary-color);

    :deep(.kit-view-switcher-button) {
      &.is-active {
        background-color: var(--bg-secondary-color);
      }
    }
  }
}

.geolocation-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
}

.geolocation-controls-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.add-by-coords-group {
  display: flex;
  align-items: center;
  gap: 8px;

  .kit-input-group {
    max-width: 150px;
  }
}

.poi-list {
  display: flex;
  flex-direction: column;
}

.poi-item {
  position: relative;
  display: flex;
  padding: 12px;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-xs);
  transition: background-color 0.2s ease;
  margin: 4px;

  &.is-readonly {
    cursor: pointer;

    &:hover {
      background-color: var(--bg-hover-color);
    }
  }
}

.poi-marker-visual {
  position: absolute;
  left: -4px;
  top: -4px;
  opacity: 0.6;

  .poi-number {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sansation';
    width: 20px;
    height: 20px;
    border-radius: var(--r-xs);
    color: white;
    font-size: 0.65rem;
    line-height: 20px;
    font-weight: 600;
    flex-shrink: 0;
  }
}

.poi-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.poi-field {
  display: flex;
  align-items: center;
  gap: 8px;

  .field-icon {
    font-size: 1.1rem;
    color: var(--fg-secondary-color);
    flex-shrink: 0;
  }
}

.poi-text {
  font-weight: 500;
  font-size: 0.9rem;
  padding: 4px 0;
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;

  &-comment {
    font-size: 0.85rem;
    color: var(--fg-secondary-color);
    font-style: italic;
  }
}

.poi-editor {
  width: 100%;
  padding: 4px 0;
  line-height: 1.4;
  min-height: 25px;
}

.poi-address {
  :deep() {
    .milkdown .ProseMirror p {
      font-weight: 500;
      font-size: 0.9rem;
      color: var(--fg-primary-color);
    }
  }
}

.poi-comment {
  :deep() {
    .milkdown .ProseMirror p {
      font-size: 0.85rem;
      color: var(--fg-secondary-color);
    }
  }
}

.poi-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.poi-coords {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 1;
  min-width: 0;

  .kit-input-group {
    max-width: 150px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }
}

.poi-actions {
  display: flex;
  gap: 4px;
}

.geolocation-map-container {
  position: relative;
  width: 100%;
  border-radius: var(--r-xs);
  overflow: hidden;
  &.cursor-crosshair {
    cursor: crosshair;
  }
  &.cursor-grab {
    cursor: grab;
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  color: var(--fg-primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  font-weight: 500;
}

// Стили для полноэкранной панели
.fullscreen-side-panel {
  position: absolute;
  top: 4px;
  left: 4px;
  bottom: 12px;
  width: 420px;
  z-index: 1000;
  border-radius: var(--r-m);
  box-shadow: var(--s-xl);

  backdrop-filter: blur(10px);
  background-color: rgba(var(--bg-secondary-color-rgb), 0.85);
  border: 1px solid var(--border-secondary-color);

  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;

  .poi-list {
    overflow-y: auto;
    flex-grow: 1;
  }

  .modes-group {
    width: 100%;
    :deep() {
      .kit-view-switcher {
        width: 100%;
        .kit-view-switcher-button {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }

  .poi-address {
    :deep() {
      .milkdown .ProseMirror p {
        font-size: 0.8rem;
        line-height: 18px;
      }
    }
  }
  .poi-comment {
    :deep() {
      .milkdown .ProseMirror p {
        font-size: 0.7rem;
        line-height: 16px;
      }
    }
  }
  .add-by-coords-group {
    display: none;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>
