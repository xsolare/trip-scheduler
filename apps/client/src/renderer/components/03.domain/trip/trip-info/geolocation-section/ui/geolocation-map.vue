<script setup lang="ts">
import type { Coordinate, MapPoint } from '../models/types'
import { onClickOutside } from '@vueuse/core'
import { toLonLat } from 'ol/proj'
import { useGeolocationMap } from '../composables/use-geolocation-map'
import GeolocationContextMenu from './geolocation-context-menu.vue'
import GeolocationMapControls from './geolocation-map-controls.vue'

import 'ol/ol.css'

interface Props {
  points: MapPoint[]
  mode: 'pan' | 'add_point' | 'build_route' | 'move_point'
  center: Coordinate
  height: string
  isLoading: boolean
  readonly?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'mapClick', coords: Coordinate): void
  (e: 'update:is-fullscreen', value: boolean): void
  (e: 'mapReady', controller: ReturnType<typeof useGeolocationMap>): void
}>()

const {
  mapInstance,
  isMapLoaded,
  initMap,
  addOrUpdatePoint,
  removePoint,
  ...restMapController
} = useGeolocationMap()

const mapContainerRef = ref<HTMLElement>()

// Состояние для полноэкранного режима
const isMapFullscreen = ref(false)

// --- Логика для контекстного меню ---
const contextMenuRef = ref<HTMLElement | null>(null)
const isContextMenuVisible = ref(false)
const contextMenuPosition = reactive({ top: 0, left: 0 })

onClickOutside(contextMenuRef, () => {
  isContextMenuVisible.value = false
})

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
  // TODO: emit action to parent
}

// Отслеживаем изменения в точках и обновляем карту
watch(() => props.points, (newPoints, oldPoints = []) => {
  const newPointIds = new Set(newPoints.map(p => p.id))

  // Удаляем старые точки
  oldPoints.forEach((point) => {
    if (!newPointIds.has(point.id)) {
      removePoint(point.id)
    }
  })

  // Добавляем/обновляем новые
  newPoints.forEach((point) => {
    addOrUpdatePoint(point)
  })
}, { deep: true })

watch(isMapFullscreen, (value) => {
  emit('update:is-fullscreen', value)
})

onMounted(async () => {
  if (!mapContainerRef.value)
    return

  await initMap({
    container: mapContainerRef.value,
    center: props.center,
    zoom: 14,
    interactive: !props.readonly,
  })

  props.points.forEach(addOrUpdatePoint)

  mapInstance.value?.on('click', (event) => {
    const coords = toLonLat(event.coordinate) as Coordinate
    emit('mapClick', coords)
  })

  // Передаем контроллер карты родительскому компоненту
  emit('mapReady', { mapInstance, isMapLoaded, initMap, addOrUpdatePoint, removePoint, ...restMapController })
})
</script>

<template>
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
    <slot name="controls" :map-instance="mapInstance" :center-coordinates="center">
      <GeolocationMapControls
        :map-instance="mapInstance"
        :center-coordinates="center"
        :is-fullscreen="isMapFullscreen"
        @update:is-fullscreen="isMapFullscreen = $event"
      />
    </slot>
    <div ref="contextMenuRef">
      <GeolocationContextMenu :visible="isContextMenuVisible" :top="contextMenuPosition.top" :left="contextMenuPosition.left" @action="handleContextMenuAction" />
    </div>
    <slot name="fullscreen-panel" />
  </div>
</template>

<style>
/* Глобальные стили для оверлеев карты */
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
  background-color: rgba(var(--bg-primary-color-rgb), 0.7);
  color: var(--fg-primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  font-weight: 500;
}
</style>
