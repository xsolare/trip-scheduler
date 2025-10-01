import type { Ref } from 'vue'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

export interface KitMapOptions {
  center: [number, number]
  zoom?: number
}

export function useKitMap() {
  const mapInstance: Ref<Map | null> = ref(null)
  const isMapReady = ref(false)
  let resizeObserver: ResizeObserver | null = null

  const initMap = async (container: HTMLElement, options: KitMapOptions) => {
    if (!container) {
      console.error('Map container is required')
      return
    }
    await nextTick()

    try {
      mapInstance.value = new Map({
        target: container,
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({
          center: options.center,
          zoom: options.zoom || 12,
        }),
        controls: [], // Используем кастомные контроли
      })

      mapInstance.value.once('postrender', () => {
        isMapReady.value = true
        mapInstance.value?.updateSize()
      })

      resizeObserver = new ResizeObserver(() => {
        mapInstance.value?.updateSize()
      })
      resizeObserver.observe(container)
    }
    catch (error) {
      console.error('Failed to initialize map:', error)
    }
  }

  const destroyMap = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (mapInstance.value) {
      mapInstance.value.setTarget(undefined)
      mapInstance.value = null
      isMapReady.value = false
    }
  }

  const zoomIn = () => {
    const view = mapInstance.value?.getView()
    const currentZoom = view?.getZoom()
    if (view && currentZoom !== undefined)
      view.animate({ zoom: currentZoom + 1, duration: 250 })
  }

  const zoomOut = () => {
    const view = mapInstance.value?.getView()
    const currentZoom = view?.getZoom()
    if (view && currentZoom !== undefined)
      view.animate({ zoom: currentZoom - 1, duration: 250 })
  }

  onUnmounted(destroyMap)

  return {
    mapInstance,
    isMapReady: readonly(isMapReady),
    initMap,
    zoomIn,
    zoomOut,
  }
}
