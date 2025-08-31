<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { useGeolocationMap } from '../composables/use-geolocation-map'
import type { ActivitySectionGeolocation, Coordinate, MapPoint } from '../models/types'
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitInput } from '~/components/01.kit/kit-input'
import { useToast } from '~/components/01.kit/kit-toast'
import { KitViewSwitcher } from '~/components/01.kit/kit-view-switcher'
import { useGeolocationPoints } from '../composables/use-geolocation-points'
import { POI_COLORS } from '../constant'
import GeolocationMapControls from './geolocation-map-controls.vue'
import GeolocationMap from './geolocation-map.vue'
import GeolocationPoiList from './geolocation-poi-list.vue'

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

// --- Состояние компонента ---
const mode = ref<'pan' | 'add_point' | 'build_route' | 'move_point'>('pan')
const mapController = ref<ReturnType<typeof useGeolocationMap>>()

const {
  points,
  isLoading,
  pointToMoveId,
  addPoiPoint,
  deletePoiPoint,
  startMovePoint,
  movePoint,
  updatePointCoords,
  handlePointUpdate,
} = useGeolocationPoints(mapController)

const poiPoints = computed(() => points.value.filter(p => p.type === 'poi'))

// Состояние для полноэкранного режима
const isMapFullscreen = ref(false)
const isPanelVisibleInFullscreen = ref(false)

// Добавляем стиль (цвет) к каждой точке для отображения
const poiPointsWithStyle = computed(() => {
  return poiPoints.value.map((point, index) => ({
    ...point,
    style: { ...point.style, color: POI_COLORS[index % POI_COLORS.length] },
  }))
})

// --- Вычисляемые свойства для безопасного доступа к данным ---
const mapCenter = computed<Coordinate>(() => {
  if (props.section.points?.length > 0) {
    return props.section.points[0].coordinates
  }
  return [37.6176, 55.7558] // Значение по умолчанию (Москва)
})

// --- Данные для контролов ---
const newPointLat = ref('')
const newPointLon = ref('')

const modeItems: ViewSwitcherItem[] = [
  { id: 'pan', icon: 'mdi:cursor-move', label: 'Панорама' },
  { id: 'add_point', icon: 'mdi:map-marker-plus', label: 'Точка' },
]

// --- Обработчики событий от дочерних компонентов ---
async function handleMapClick(coords: Coordinate) {
  if (props.readonly)
    return

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

function handleStartMovePoint(pointId: string) {
  startMovePoint(pointId)
  mode.value = 'move_point'
}

function handleFocusOnPoint(point: MapPoint) {
  mapController.value?.flyToLocation(point.coordinates[0], point.coordinates[1], 16)
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

// --- Инициализация и синхронизация ---
function onMapReady(controller: ReturnType<typeof useGeolocationMap>) {
  mapController.value = controller
  // Инициализируем точки после того, как карта будет готова
  points.value = JSON.parse(JSON.stringify(props.section.points || []))
}

watch(points, (newPoints) => {
  emit('update:section', {
    ...props.section,
    points: newPoints,
  })
}, { deep: true })
</script>

<template>
  <div class="geolocation-section">
    <!-- ПАНЕЛЬ УПРАВЛЕНИЯ -->
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

    <!-- СПИСОК ТОЧЕК ИНТЕРЕСА (POI) -->
    <GeolocationPoiList
      v-if="poiPointsWithStyle.length > 0 && !isMapFullscreen"
      :points="poiPointsWithStyle"
      :readonly="readonly"
      @focus-on-point="handleFocusOnPoint"
      @update-point="handlePointUpdate"
      @update-point-coords="updatePointCoords"
      @start-move-point="handleStartMovePoint"
      @delete-point="deletePoiPoint"
    />

    <!-- КАРТА -->
    <GeolocationMap
      :points="poiPointsWithStyle"
      :mode="mode"
      :center="mapCenter"
      :height="height"
      :is-loading="isLoading"
      :readonly="readonly"
      @map-ready="onMapReady"
      @map-click="handleMapClick"
      @update:is-fullscreen="isMapFullscreen = $event"
    >
      <template #controls="{ mapInstance, centerCoordinates }">
        <GeolocationMapControls
          :map-instance="mapInstance"
          :center-coordinates="centerCoordinates"
          :is-fullscreen="isMapFullscreen"
          @update:is-fullscreen="isMapFullscreen = $event"
          @toggle-panel="isPanelVisibleInFullscreen = !isPanelVisibleInFullscreen"
        />
      </template>

      <!-- ПАНЕЛЬ ДЛЯ ПОЛНОЭКРАННОГО РЕЖИМА -->
      <template #fullscreen-panel>
        <Transition name="slide-fade">
          <div v-if="isMapFullscreen && isPanelVisibleInFullscreen" class="fullscreen-side-panel">
            <!-- Панель управления (полноэкранный режим) -->
            <div v-if="!readonly" class="geolocation-controls-panel">
              <div class="modes-group">
                <KitViewSwitcher v-model="mode" :items="modeItems" />
              </div>
            </div>
            <!-- Список точек (полноэкранный режим) -->
            <GeolocationPoiList
              v-if="poiPointsWithStyle.length > 0"
              :points="poiPointsWithStyle"
              :readonly="readonly"
              @focus-on-point="handleFocusOnPoint"
              @update-point="handlePointUpdate"
              @update-point-coords="updatePointCoords"
              @start-move-point="handleStartMovePoint"
              @delete-point="deletePoiPoint"
            />
          </div>
        </Transition>
      </template>
    </GeolocationMap>
  </div>
</template>

<style scoped lang="scss">
/* Стили, относящиеся к geolocation-section и его элементам управления */
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
