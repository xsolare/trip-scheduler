// composables/use-geolocation-map.ts

import type { Coordinate, GeolocationMapOptions, MapPoint, MapRoute, ReverseGeocodingResult } from '../models/types'
import { Feature, Map, Overlay, View } from 'ol'
import { LineString, Point } from 'ol/geom'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { fromLonLat, get, transform, transformExtent } from 'ol/proj'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Circle as CircleStyle, Fill, Icon as OlIcon, Stroke, Style } from 'ol/style'

function useGeolocationMap() {
  const mapInstance: Ref<Map | null> = ref(null)
  const isMapLoaded = ref(false)

  // Слои для точек и маршрутов
  const pointSource = new VectorSource()
  const routeSource = new VectorSource()
  const pointLayer = new VectorLayer({ source: pointSource, zIndex: 10 })
  const routeLayer = new VectorLayer({ source: routeSource, zIndex: 5 })

  // Управление оверлеями (всплывающими окнами)
  const popups: Ref<Overlay[]> = ref([])
  let resizeObserver: ResizeObserver | null = null

  // --- Инициализация и уничтожение карты ---

  const initMap = async (options: GeolocationMapOptions) => {
    if (!options.container) {
      console.error('Map container is required')
      return
    }
    await nextTick()
    try {
      mapInstance.value = new Map({
        target: options.container,
        layers: [new TileLayer({ source: new OSM() }), routeLayer, pointLayer],
        view: new View({
          center: fromLonLat(options.center),
          zoom: options.zoom || 12,
        }),
        controls: [],
      })

      mapInstance.value.once('postrender', () => {
        isMapLoaded.value = true
        mapInstance.value?.updateSize()
      })

      const container = typeof options.container === 'string'
        ? document.getElementById(options.container)
        : options.container
      if (container) {
        resizeObserver = new ResizeObserver(() => {
          mapInstance.value?.updateSize()
        })
        resizeObserver.observe(container)
      }
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
      isMapLoaded.value = false
    }
  }

  // --- Управление точками (маркерами) ---

  function getPointStyle(point: MapPoint): Style {
    const colors = {
      poi: '#3498db',
      start: '#2ecc71',
      via: '#f1c40f',
      end: '#e74c3c',
    }
    const color = point.style?.color || colors[point.type] || '#3498db'

    // Используем кастомный SVG, чтобы цвет можно было менять динамически
    const svg = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    `
    return new Style({
      image: new OlIcon({
        src: `data:image/svg+xml;base64,${btoa(svg)}`,
        scale: point.style?.scale || 1.5,
        anchor: [0.5, 1],
      }),
    })
  }

  const addOrUpdatePoint = (point: MapPoint) => {
    if (!mapInstance.value)
      return
    let feature = pointSource.getFeatureById(point.id)
    const coordinates = fromLonLat(point.coordinates)

    if (feature) {
      feature.setGeometry(new Point(coordinates))
    }
    else {
      feature = new Feature({ geometry: new Point(coordinates) })
      feature.setId(point.id)
      pointSource.addFeature(feature)
    }
    feature.setStyle(getPointStyle(point))

    if (point.popupContent) {
      showPopup(point.coordinates, point.popupContent)
    }
  }

  const removePoint = (pointId: string) => {
    const feature = pointSource.getFeatureById(pointId)
    if (feature) {
      pointSource.removeFeature(feature)
    }
  }

  const clearPoints = () => {
    pointSource.clear()
  }

  // --- Управление маршрутами ---

  const drawOrUpdateRoute = (route: MapRoute) => {
    if (!mapInstance.value)
      return
    const routeStyle = new Style({
      stroke: new Stroke({
        color: route.style?.color || '#007bff',
        width: route.style?.width || 5,
      }),
    })

    let feature = routeSource.getFeatureById(route.id)
    const geometry = new LineString(route.geometry.map(coord => fromLonLat(coord)))

    if (feature) {
      feature.setGeometry(geometry)
    }
    else {
      feature = new Feature({ geometry })
      feature.setId(route.id)
      routeSource.addFeature(feature)
    }
    feature.setStyle(routeStyle)
  }

  const removeRoute = (routeId: string) => {
    const feature = routeSource.getFeatureById(routeId)
    if (feature) {
      routeSource.removeFeature(feature)
    }
  }

  // --- Взаимодействие с API ---

  const fetchRoute = async (waypoints: MapPoint[]): Promise<MapRoute | null> => {
    const coordsString = waypoints
      .map(p => p.coordinates.join(','))
      .join(';')
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        console.error('OSRM error:', data.message)
        return null
      }
      const routeData = data.routes[0]
      return {
        id: `route-${Date.now()}`,
        waypoints,
        geometry: routeData.geometry.coordinates, // OSRM с geojson возвращает [lon, lat]
        distance: routeData.distance, // в метрах
        duration: routeData.duration, // в секундах
      }
    }
    catch (error) {
      console.error('Failed to fetch route from OSRM:', error)
      return null
    }
  }

  const fetchAddress = async (coordinates: Coordinate): Promise<ReverseGeocodingResult | null> => {
    const [lon, lat] = coordinates
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}&accept-language=ru`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.error) {
        console.error('Nominatim error:', data.error)
        return null
      }
      return {
        coordinates,
        address: data.display_name || 'Адрес не найден',
        raw: data,
      }
    }
    catch (error) {
      console.error('Failed to fetch address from Nominatim:', error)
      return null
    }
  }

  // --- Утилиты ---

  function showPopup(coordinates: Coordinate, content: string, id: string = `popup-${Date.now()}`) {
    if (!mapInstance.value)
      return

    const popupElement = document.createElement('div')
    popupElement.innerHTML = content
    popupElement.className = 'ol-popup'

    const popup = new Overlay({
      element: popupElement,
      position: fromLonLat(coordinates),
      positioning: 'bottom-center',
      offset: [0, -40],
      id,
    })

    mapInstance.value.addOverlay(popup)
    popups.value.push(popup)
    return popup
  }

  function clearPopups() {
    popups.value.forEach(p => mapInstance.value?.removeOverlay(p))
    popups.value = []
  }

  function flyToLocation(longitude: number, latitude: number, zoom = 14) {
    if (!mapInstance.value)
      return
    mapInstance.value.getView().animate({
      center: fromLonLat([longitude, latitude]),
      zoom,
      duration: 1000,
    })
  }

  function fitToExtent(coordinates: Coordinate[]) {
    if (!mapInstance.value || coordinates.length === 0)
      return

    const extent = coordinates.reduce((ext, coord) => {
      return [
        Math.min(coord[0], ext[0]),
        Math.min(coord[1], ext[1]),
        Math.max(coord[0], ext[2]),
        Math.max(coord[1], ext[3]),
      ]
    }, [Infinity, Infinity, -Infinity, -Infinity])

    const transformedExtent = transformExtent(extent, 'EPSG:4326', mapInstance.value.getView().getProjection())

    mapInstance.value.getView().fit(transformedExtent, {
      duration: 1000,
      padding: [50, 50, 50, 50], // отступы, чтобы маркеры не прилипали к краям
      maxZoom: 16,
    })
  }

  onUnmounted(destroyMap)

  return {
    mapInstance,
    isMapLoaded: readonly(isMapLoaded),
    initMap,
    addOrUpdatePoint,
    removePoint,
    clearPoints,
    drawOrUpdateRoute,
    removeRoute,
    fetchRoute,
    fetchAddress,
    flyToLocation,
    showPopup,
    clearPopups,
    fitToExtent,
  }
}

export { useGeolocationMap }
