<script setup lang="ts">
import type { ActivitySectionGeolocation } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { Feature, Map, Overlay, View } from 'ol'
import { Point } from 'ol/geom'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { fromLonLat } from 'ol/proj'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Icon as OlIcon, Style } from 'ol/style'

export interface GeolocationMapOptions {
  container: string | HTMLElement
  center: [number, number]
  zoom?: number
  interactive?: boolean
}

export interface GeolocationMarkerOptions {
  showPopup?: boolean
  popupText?: string
  color?: string
}

interface Props {
  section: ActivitySectionGeolocation
  readonly?: boolean
  height?: string
  showAddress?: boolean
  showControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  height: '300px',
  showAddress: true,
  showControls: false,
})

function useGeolocationMap() {
  const mapInstance: Ref<Map | null> = ref(null)
  const isMapLoaded = ref(false)
  const mapContainer = ref<HTMLElement | null>(null)
  const markerLayer: Ref<VectorLayer<VectorSource> | null> = ref(null)
  const overlays: Ref<Overlay[]> = ref([])

  const initMap = async (options: GeolocationMapOptions) => {
    if (!options.container) {
      console.error('Map container is required')
      return
    }

    await nextTick()

    try {
      const vectorSource = new VectorSource()
      markerLayer.value = new VectorLayer({
        source: vectorSource,
      })

      mapInstance.value = new Map({
        target: options.container,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          markerLayer.value,
        ],
        view: new View({
          center: fromLonLat(options.center),
          zoom: options.zoom || 12,
        }),
        interactions: options.interactive ?? true ? undefined : [],
        controls: options.interactive ?? true ? undefined : [],
      })

      setTimeout(() => {
        isMapLoaded.value = true
      }, 100)
    }
    catch (error) {
      console.error('Failed to initialize map:', error)
    }
  }

  const addMarker = (
    longitude: number,
    latitude: number,
    options: GeolocationMarkerOptions = {},
  ) => {
    if (!mapInstance.value || !markerLayer.value)
      return null

    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    })

    const markerStyle = new Style({
      image: new OlIcon({
        src: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${options.color || '#e74c3c'}"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    `)}`,
        scale: 1.5,
        anchor: [0.5, 1],
      }),
    })
    marker.setStyle(markerStyle)

    markerLayer.value.getSource()?.addFeature(marker)

    if (options.showPopup && options.popupText) {
      const popupElement = document.createElement('div')
      popupElement.innerHTML = options.popupText
      popupElement.className = 'ol-popup'

      const popup = new Overlay({
        element: popupElement,
        position: fromLonLat([longitude, latitude]),
        positioning: 'bottom-center',
        offset: [0, -40],
      })

      mapInstance.value.addOverlay(popup)
      overlays.value.push(popup)
    }

    return marker
  }

  const flyToLocation = (longitude: number, latitude: number, zoom = 14) => {
    if (!mapInstance.value)
      return

    const view = mapInstance.value.getView()
    view.animate({
      center: fromLonLat([longitude, latitude]),
      zoom,
      duration: 1000,
    })
  }

  const destroyMap = () => {
    if (mapInstance.value) {
      overlays.value.forEach((overlay) => {
        mapInstance.value?.removeOverlay(overlay)
      })
      overlays.value = []

      mapInstance.value.setTarget(undefined)
      mapInstance.value = null
      markerLayer.value = null
      isMapLoaded.value = false
    }
  }

  onUnmounted(() => {
    destroyMap()
  })

  return {
    mapInstance: readonly(mapInstance),
    isMapLoaded: readonly(isMapLoaded),
    mapContainer,
    initMap,
    addMarker,
    flyToLocation,
    destroyMap,
  }
}

const mapContainerRef = ref<HTMLElement>()
const {
  isMapLoaded,
  initMap,
  addMarker,
  flyToLocation,
} = useGeolocationMap()

const coordinates = computed(() => [
  props.section.longitude,
  props.section.latitude,
])

const mapId = computed(() => `map-${props.section.id || Date.now()}`)

async function initializeMap() {
  if (!mapContainerRef.value)
    return

  await initMap({
    container: mapContainerRef.value,
    center: coordinates.value as [number, number],
    zoom: 14,
    interactive: !props.readonly,
  })

  addMarker(
    props.section.longitude,
    props.section.latitude,
    {
      showPopup: props.showAddress,
      popupText: props.section.address,
    },
  )
}

function handleCenterOnLocation() {
  flyToLocation(props.section.longitude, props.section.latitude, 16)
}

onMounted(() => {
  initializeMap()
})
</script>

<template>
  <div class="geolocation-section">
    <div v-if="showAddress" class="geolocation-section-header">
      <div class="geolocation-section-address">
        <Icon icon="map-pin" class="geolocation-section-icon" />
        <span class="geolocation-section-address-text">{{ section.address }}</span>
      </div>

      <button
        v-if="showControls && isMapLoaded"
        class="geolocation-section-center-btn"
        type="button"
        @click="handleCenterOnLocation"
      >
        <Icon icon="crosshairs" />
        <span class="sr-only">Центрировать на локации</span>
      </button>
    </div>

    <div
      :id="mapId"
      ref="mapContainerRef"
      class="geolocation-section-map"
      :style="{ height }"
    >
      <div
        v-if="!isMapLoaded"
        class="geolocation-section-loading"
      >
        <span>Загрузка карты...</span>
      </div>
    </div>

    <div v-if="showControls" class="geolocation-section-coordinates">
      <small class="geolocation-section-coords-text">
        {{ section.latitude.toFixed(6) }}, {{ section.longitude.toFixed(6) }}
      </small>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Импорт стилей OpenLayers
@import 'ol/ol.css';

.geolocation-section {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &-address {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  &-icon {
    color: var(--text-secondary-color);
    flex-shrink: 0;
  }

  &-address-text {
    font-size: 14px;
    color: var(--text-primary-color);
    font-weight: 500;
    word-break: break-word;
  }

  &-center-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var(--bg-primary-color);
    border: 1px solid var(--border-primary-color);
    border-radius: var(--r-xs);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background-color: var(--bg-hover-color);
      border-color: var(--border-hover-color);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &-map {
    width: 100%;
    border-radius: var(--r-xs);
    overflow: hidden;
    position: relative;
    background-color: var(--bg-tertiary-color);
  }

  &-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary-color);
    font-size: 14px;
  }

  &-coordinates {
    text-align: center;
  }

  &-coords-text {
    font-family: var(--font-mono);
    color: var(--text-tertiary-color);
    font-size: 12px;
  }
}

:deep(.ol-popup) {
  background: white;
  border-radius: var(--r-2xs);
  padding: 8px;
  font-size: 12px;
  box-shadow: var(--s-m);
  max-width: 200px;
  word-wrap: break-word;

  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
  }
}
</style>
