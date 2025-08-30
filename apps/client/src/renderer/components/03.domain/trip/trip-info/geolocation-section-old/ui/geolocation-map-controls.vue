<script setup lang="ts">
import type { Map } from 'ol'
import { fromLonLat } from 'ol/proj'
import { KitBtn } from '~/components/01.kit/kit-btn'

interface Props {
  mapInstance: Map | null
  centerCoordinates: [number, number]
}

const props = defineProps<Props>()

const isFullscreen = ref(false)

function zoomIn() {
  const view = props.mapInstance?.getView()
  const currentZoom = view?.getZoom()
  if (view && currentZoom !== undefined) {
    view.animate({ zoom: currentZoom + 1, duration: 250 })
  }
}

function zoomOut() {
  const view = props.mapInstance?.getView()
  const currentZoom = view?.getZoom()
  if (view && currentZoom !== undefined) {
    view.animate({ zoom: currentZoom - 1, duration: 250 })
  }
}

function centerOnMarker() {
  const view = props.mapInstance?.getView()
  if (view) {
    view.animate({
      center: fromLonLat(props.centerCoordinates),
      zoom: 16,
      duration: 1000,
    })
  }
}

function toggleFullscreen() {
  const mapElement = props.mapInstance?.getTargetElement()
  if (!mapElement)
    return

  if (document.fullscreenElement) {
    document.exitFullscreen()
    isFullscreen.value = false
  }
  else {
    mapElement.requestFullscreen()
    isFullscreen.value = true
  }
}

document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})
</script>

<template>
  <div class="custom-map-controls">
    <KitBtn
      variant="outlined"
      color="secondary"
      icon="mdi:crosshairs-gps"
      aria-label="Центрировать на маркере"
      @click="centerOnMarker"
    />
    <div class="zoom-controls">
      <KitBtn
        variant="outlined"
        color="secondary"
        icon="mdi:plus"
        aria-label="Приблизить"
        @click="zoomIn"
      />
      <KitBtn
        variant="outlined"
        color="secondary"
        icon="mdi:minus"
        aria-label="Отдалить"
        @click="zoomOut"
      />
    </div>
    <KitBtn
      variant="outlined"
      color="secondary"
      :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"
      aria-label="Во весь экран"
      @click="toggleFullscreen"
    />
  </div>
</template>

<style scoped lang="scss">
.custom-map-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;

  .kit-btn {
    padding: 0;
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    background-color: var(--bg-secondary-color);
  }
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
