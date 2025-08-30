<!-- ui/geolocation-section.vue -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { Coordinate, MapPoint, MapRoute } from '../models/types'
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import type { ActivitySectionGeolocation } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import { toLonLat } from 'ol/proj'
import { v4 as uuidv4 } from 'uuid'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitInput } from '~/components/01.kit/kit-input'
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
  drawOrUpdateRoute,
  removeRoute,
  fetchRoute,
  fetchAddress,
  flyToLocation,
  fitToExtent,
} = useGeolocationMap()

// --- Глобальное состояние компонента ---
const mapContainerRef = ref<HTMLElement>()
const mode = ref<'pan' | 'add_point' | 'build_route' | 'move_point'>('pan')
const isLoading = ref(false)
const pointToMoveId = ref<string | null>(null)

const points = ref<MapPoint[]>([])
const routes = ref<MapRoute[]>([])
const activeRouteId = ref<string | null>(null)

const activeRoute = computed(() => routes.value.find(r => r.id === activeRouteId.value))
const poiPoints = computed(() => points.value.filter(p => p.type === 'poi'))

// --- Данные для контролов ---
const newPointLat = ref('')
const newPointLon = ref('')

const modeItems: ViewSwitcherItem[] = [
  { id: 'pan', icon: 'mdi:cursor-move', label: 'Панорама' },
  { id: 'add_point', icon: 'mdi:map-marker-plus', label: 'Точка' },
  { id: 'build_route', icon: 'mdi:routes', label: 'Маршрут' },
]

// --- Логика для контекстного меню ---
const contextMenuRef = ref<HTMLElement | null>(null)
const isContextMenuVisible = ref(false)
const contextMenuPosition = reactive({ top: 0, left: 0 })
let clickedCoordinates: Coordinate | null = null
onClickOutside(contextMenuRef, () => { isContextMenuVisible.value = false })

// --- Инициализация и обработчики карты ---
onMounted(async () => {
  if (!mapContainerRef.value)
    return
  await initMap({
    container: mapContainerRef.value,
    center: [props.section.longitude, props.section.latitude],
    zoom: 14,
    interactive: !props.readonly,
  })

  const initialPoint: MapPoint = {
    id: `poi-${props.section.id}`,
    coordinates: [props.section.longitude, props.section.latitude],
    type: 'poi',
    address: props.section.address,
  }
  points.value.push(initialPoint)
  addOrUpdatePoint(initialPoint)

  mapInstance.value?.on('click', (event) => {
    handleMapClick(event.originalEvent as MouseEvent)
  })
})

async function handleMapClick(event: MouseEvent) {
  if (props.readonly || !mapInstance.value)
    return
  const coords = toLonLat(mapInstance.value.getEventCoordinate(event)) as Coordinate

  if (mode.value === 'add_point') {
    await addPoiPoint(coords)
    mode.value = 'pan'
  }
  else if (mode.value === 'build_route') {
    await addWaypointToActiveRoute(coords)
  }
  else if (mode.value === 'move_point' && pointToMoveId.value) {
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
  }
  points.value.push(newPoint)
  addOrUpdatePoint(newPoint)
}

async function addPointFromInputs() {
  const lat = Number.parseFloat(newPointLat.value)
  const lon = Number.parseFloat(newPointLon.value)

  if (isNaN(lat) || isNaN(lon)) {
    alert('Неверный формат координат!')
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
  // Приводим строковые значения из инпутов к числам
  const lon = Number(point.coordinates[0])
  const lat = Number(point.coordinates[1])
  if (isNaN(lat) || isNaN(lon)) {
    alert('Неверный формат координат!')
    return
  }
  point.coordinates = [lon, lat]

  await movePoint(point.id, point.coordinates)
  flyToLocation(lon, lat, 16)
}

// --- Управление маршрутами ---
function startNewRoute(startCoords?: Coordinate) {
  const newRoute: MapRoute = { id: uuidv4(), waypoints: [], geometry: [], distance: 0, duration: 0 }
  routes.value.push(newRoute)
  activeRouteId.value = newRoute.id
  mode.value = 'build_route'
  if (startCoords) {
    addWaypointToActiveRoute(startCoords)
  }
}

function handleModeChange(newMode: string) {
  if (newMode === 'build_route') {
    // Чтобы избежать создания множества пустых маршрутов при повторном клике,
    // создаем новый маршрут, только если текущий уже содержит точки.
    if (!activeRoute.value || activeRoute.value.waypoints.length > 0)
      startNewRoute()
  }
}

async function addWaypointToActiveRoute(coords: Coordinate) {
  if (!activeRoute.value)
    return

  isLoading.value = true
  const addressInfo = await fetchAddress(coords)
  isLoading.value = false
  if (!addressInfo)
    return

  const newWaypoint: MapPoint = {
    id: uuidv4(),
    coordinates: coords,
    type: 'via',
    address: addressInfo.address,
  }

  activeRoute.value.waypoints.push(newWaypoint)
  updateWaypointTypes(activeRoute.value)

  addOrUpdatePoint(newWaypoint)
  await rebuildActiveRoute()
}

async function removeWaypoint(pointId: string) {
  if (!activeRoute.value)
    return
  const index = activeRoute.value.waypoints.findIndex(p => p.id === pointId)
  if (index === -1)
    return

  removePoint(pointId)
  activeRoute.value.waypoints.splice(index, 1)

  if (activeRoute.value.waypoints.length === 0) {
    if (activeRoute.value.id)
      removeRoute(activeRoute.value.id)
    routes.value = routes.value.filter(r => r.id !== activeRoute.value!.id)
    activeRouteId.value = null
    mode.value = 'pan'
  }
  else {
    updateWaypointTypes(activeRoute.value)
    activeRoute.value.waypoints.forEach(addOrUpdatePoint)
    await rebuildActiveRoute()
  }
}

async function rebuildActiveRoute() {
  if (!activeRoute.value)
    return

  if (activeRoute.value.waypoints.length < 2) {
    removeRoute(activeRoute.value.id)
    return
  }

  isLoading.value = true
  const routeData = await fetchRoute(activeRoute.value.waypoints)
  isLoading.value = false

  if (routeData) {
    activeRoute.value.geometry = routeData.geometry
    activeRoute.value.distance = routeData.distance
    activeRoute.value.duration = routeData.duration
    drawOrUpdateRoute({ ...activeRoute.value, id: activeRoute.value.id })
    fitToExtent(activeRoute.value.waypoints.map(p => p.coordinates))
  }
}

function updateWaypointTypes(route: MapRoute) {
  route.waypoints.forEach((p, index) => {
    if (route.waypoints.length === 1) {
      p.type = 'start'
    }
    else if (index === 0) {
      p.type = 'start'
    }
    else if (index === route.waypoints.length - 1) {
      p.type = 'end'
    }
    else {
      p.type = 'via'
    }
  })
}

// --- Контекстное меню ---
function openContextMenu(event: MouseEvent) {
  if (props.readonly || !mapInstance.value)
    return

  const mapContainer = mapInstance.value.getTargetElement() as HTMLElement
  const mapRect = mapContainer.getBoundingClientRect()
  contextMenuPosition.top = event.clientY - mapRect.top
  contextMenuPosition.left = event.clientX - mapRect.left
  const mapCoords = mapInstance.value.getEventCoordinate(event)

  if (mapCoords) {
    clickedCoordinates = toLonLat(mapCoords) as Coordinate
  }
  isContextMenuVisible.value = true
}

function handleContextMenuAction(actionId: string) {
  isContextMenuVisible.value = false
  if (!clickedCoordinates)
    return

  if (actionId === 'route-from') {
    startNewRoute(clickedCoordinates)
  }
}
</script>

<template>
  <div class="geolocation-section">
    <!-- ПАНЕЛЬ УПРАВЛЕНИЯ -->
    <div v-if="!readonly" class="geolocation-controls-panel">
      <!-- Кнопки режимов -->
      <div class="modes-group">
        <KitViewSwitcher
          v-model="mode"
          :items="modeItems"
          @change="handleModeChange"
        />
      </div>

      <!-- Блок добавления точки по координатам -->
      <div v-if="mode !== 'pan'" class="add-by-coords-group">
        <KitInput v-model="newPointLat" type="text" placeholder="Широта" size="sm" />
        <KitInput v-model="newPointLon" type="text" placeholder="Долгота" size="sm" />
        <KitBtn icon="mdi:plus" aria-label="Добавить точку по координатам" @click="addPointFromInputs" />
      </div>
    </div>

    <!-- СПИСОК ТОЧЕК ИНТЕРЕСА (POI) -->
    <div v-if="poiPoints.length > 0 && !readonly" class="poi-list">
      <div v-for="point in poiPoints" :key="point.id" class="poi-item">
        <div class="poi-info">
          <span class="poi-address">{{ point.address }}</span>
          <div class="poi-coords">
            <KitInput v-model="point.coordinates[1]" size="sm" type="text" @keydown.enter="updatePointCoords(point)" />
            <KitInput v-model="point.coordinates[0]" size="sm" type="text" @keydown.enter="updatePointCoords(point)" />
            <KitBtn icon="mdi:check" variant="text" size="sm" @click="updatePointCoords(point)" />
          </div>
        </div>
        <div class="poi-actions">
          <KitBtn icon="mdi:arrow-all" variant="text" size="sm" aria-label="Переместить точку" @click="startMovePoint(point.id)" />
          <KitBtn icon="mdi:delete-outline" variant="text" size="sm" aria-label="Удалить точку" @click="deletePoiPoint(point.id)" />
        </div>
      </div>
    </div>

    <!-- ИНФО О МАРШРУТЕ -->
    <div v-if="!readonly && activeRoute" class="route-info-panel">
      <div class="route-header">
        <h4>Активный маршрут</h4>
        <div v-if="activeRoute.distance > 0" class="route-meta">
          {{ (activeRoute.distance / 1000).toFixed(1) }} км / {{ Math.round(activeRoute.duration / 60) }} мин
        </div>
      </div>
      <ul class="waypoints-list">
        <li v-for="point in activeRoute.waypoints" :key="point.id">
          <Icon :icon="point.type === 'start' ? 'mdi:flag-checkered' : point.type === 'end' ? 'mdi:flag-variant' : 'mdi:map-marker'" />
          <span class="waypoint-address">{{ point.address }}</span>
          <KitBtn
            icon="mdi:close"
            size="sm"
            variant="text"
            @click="removeWaypoint(point.id)"
          />
        </li>
      </ul>
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
      <GeolocationMapControls :map-instance="mapInstance" :center-coordinates="[section.longitude, section.latitude]" />
      <div ref="contextMenuRef">
        <GeolocationContextMenu :visible="isContextMenuVisible" :top="contextMenuPosition.top" :left="contextMenuPosition.left" @action="handleContextMenuAction" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.geolocation-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
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
    max-width: 110px;
    width: 110px;
  }
}

.modes-group {
  display: flex;
  gap: 8px;
}

.poi-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.poi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-xs);
  gap: 12px;
}

.poi-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.poi-address {
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.poi-coords {
  display: flex;
  align-items: center;
  gap: 4px;
  .kit-input {
    max-width: 100px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }
}

.poi-actions {
  display: flex;
  align-items: center;
}

.route-info-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-xs);
}
.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h4 {
    margin: 0;
    font-size: 1rem;
  }
  .route-meta {
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
  }
}

.waypoints-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    .waypoint-address {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
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
</style>
