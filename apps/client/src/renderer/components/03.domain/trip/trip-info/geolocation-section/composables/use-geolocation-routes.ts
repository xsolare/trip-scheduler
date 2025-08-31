import type { Ref } from 'vue'
import type { Coordinate, DrawnRoute, MapPoint, MapRoute } from '../models/types'
import type { useGeolocationMap } from './use-geolocation-map'
import { v4 as uuidv4 } from 'uuid'
import { POI_COLORS } from '../constant'

type GeolocationMapApi = ReturnType<typeof useGeolocationMap>

export function useGeolocationRoutes(mapApiRef: Ref<GeolocationMapApi | undefined>) {
  const routes = ref<MapRoute[]>([])
  const drawnRoutes = ref<DrawnRoute[]>([])
  const isLoading = ref(false)

  // --- Управление маршрутами OSRM ---
  async function createNewRoute(startCoords: Coordinate) {
    if (!mapApiRef.value)
      return
    isLoading.value = true
    const addressInfo = await mapApiRef.value.fetchAddress(startCoords)
    isLoading.value = false

    const startPoint: MapPoint = {
      id: uuidv4(),
      coordinates: startCoords,
      type: 'start',
      address: addressInfo?.address || 'Начальная точка',
    }

    const newRoute: MapRoute = {
      id: uuidv4(),
      title: `Маршрут ${routes.value.length + 1}`,
      points: [startPoint],
      isVisible: true,
      isFetching: false,
      color: POI_COLORS[routes.value.length % POI_COLORS.length],
    }

    routes.value.push(newRoute)
    mapApiRef.value.addOrUpdatePoint(startPoint)
    return newRoute
  }

  async function addPointToRoute(routeId: string, coords: Coordinate) {
    const route = routes.value.find(r => r.id === routeId)
    if (!route || !mapApiRef.value)
      return

    isLoading.value = true
    const addressInfo = await mapApiRef.value.fetchAddress(coords)
    isLoading.value = false

    if (route.points.length > 0) {
      const lastPoint = route.points[route.points.length - 1]
      if (lastPoint.type === 'start' || lastPoint.type === 'via')
        lastPoint.type = 'via'
    }

    const newPoint: MapPoint = {
      id: uuidv4(),
      coordinates: coords,
      type: 'end',
      address: addressInfo?.address || 'Промежуточная точка',
    }

    route.points.push(newPoint)
    mapApiRef.value.addOrUpdatePoint(newPoint)
    await updateRouteGeometry(routeId)
  }

  async function deleteRoute(routeId: string) {
    const routeIndex = routes.value.findIndex(r => r.id === routeId)
    if (routeIndex !== -1) {
      const routeToDelete = routes.value[routeIndex]
      routeToDelete.points.forEach(p => mapApiRef.value!.removePoint(p.id))
      mapApiRef.value!.removeRoute(routeId)
      routes.value.splice(routeIndex, 1)
      return
    }

    const drawnRouteIndex = drawnRoutes.value.findIndex(r => r.id === routeId)
    if (drawnRouteIndex !== -1) {
      mapApiRef.value!.removeRoute(routeId)
      drawnRoutes.value.splice(drawnRouteIndex, 1)
    }
  }

  async function deletePointFromRoute(routeId: string, pointId: string) {
    const route = routes.value.find(r => r.id === routeId)
    if (!route || !mapApiRef.value)
      return

    route.points = route.points.filter(p => p.id !== pointId)
    mapApiRef.value.removePoint(pointId)

    if (route.points.length > 0) {
      route.points[0].type = 'start'
      if (route.points.length > 1)
        route.points[route.points.length - 1].type = 'end'
    }

    await updateRouteGeometry(routeId)
  }

  async function updatePointInRoute(pointId: string, newCoords: Coordinate, shouldUpdateAddress: boolean = true) {
    let routeOfPoint: MapRoute | undefined
    for (const route of routes.value) {
      const point = route.points.find(p => p.id === pointId)
      if (point) {
        routeOfPoint = route
        point.coordinates = newCoords

        if (shouldUpdateAddress) {
          isLoading.value = true
          const addressInfo = await mapApiRef.value?.fetchAddress(newCoords)
          isLoading.value = false
          point.address = addressInfo?.address || 'Адрес не найден'
        }

        mapApiRef.value?.addOrUpdatePoint(point)
        break
      }
    }
    if (routeOfPoint)
      await updateRouteGeometry(routeOfPoint.id)
  }

  function handlePointDataUpdate(routeId: string, point: MapPoint) {
    if (!mapApiRef.value)
      return
    const route = routes.value.find(r => r.id === routeId)
    if (!route)
      return
    const index = route.points.findIndex(p => p.id === point.id)
    if (index !== -1)
      route.points.splice(index, 1, { ...point })
    mapApiRef.value.addOrUpdatePoint(point)
  }

  async function updateRouteGeometry(routeId: string) {
    const route = routes.value.find(r => r.id === routeId)
    if (!route || !mapApiRef.value)
      return
    if (route.points.length < 2) {
      route.geometry = []
      route.distance = 0
      mapApiRef.value.removeRoute(routeId)
      return
    }

    route.isFetching = true
    const routeData = await mapApiRef.value.fetchRoute(route.points)
    route.isFetching = false

    if (routeData) {
      route.geometry = routeData.geometry
      route.distance = routeData.distance
      route.duration = routeData.duration
      route.isDirect = routeData.isDirect
      // FIX: Принудительно обновляем маршрут на карте, чтобы применился новый стиль (например, пунктир)
      mapApiRef.value.addOrUpdateRoute(route)
    }
  }

  function setInitialRoutes(initialData: { routes?: MapRoute[], drawnRoutes?: DrawnRoute[] }) {
    if (!mapApiRef.value)
      return

    routes.value = JSON.parse(JSON.stringify(initialData.routes || []))
    drawnRoutes.value = JSON.parse(JSON.stringify(initialData.drawnRoutes || []))

    routes.value.forEach((route) => {
      route.points.forEach(point => mapApiRef.value!.addOrUpdatePoint(point))
      updateRouteGeometry(route.id)
    })
    drawnRoutes.value.forEach((route) => {
      mapApiRef.value!.addOrUpdateDrawnRoute(route)
    })
  }

  // --- Управление нарисованными маршрутами ---
  function addDrawnRoute(coords: Coordinate[]) {
    const newDrawnRoute: DrawnRoute = {
      id: uuidv4(),
      title: `Рисованный маршрут ${drawnRoutes.value.length + 1}`,
      segments: [coords],
      isVisible: true,
      color: POI_COLORS[(routes.value.length + drawnRoutes.value.length) % POI_COLORS.length],
    }
    drawnRoutes.value.push(newDrawnRoute)
    mapApiRef.value?.addOrUpdateDrawnRoute(newDrawnRoute)
  }

  function addSegmentToDrawnRoute(routeId: string, segmentCoords: Coordinate[]) {
    const route = drawnRoutes.value.find(r => r.id === routeId)
    if (route && mapApiRef.value) {
      route.segments.push(segmentCoords)
      mapApiRef.value.addOrUpdateDrawnRoute(route)
    }
  }

  function deleteSegmentFromDrawnRoute(routeId: string, segmentIndex: number) {
    const route = drawnRoutes.value.find(r => r.id === routeId)
    if (route && mapApiRef.value) {
      route.segments.splice(segmentIndex, 1)
      if (route.segments.length === 0)
        deleteRoute(routeId)
      else
        mapApiRef.value.addOrUpdateDrawnRoute(route)
    }
  }

  return {
    routes,
    drawnRoutes,
    isLoading,
    createNewRoute,
    addPointToRoute,
    deleteRoute,
    deletePointFromRoute,
    updatePointInRoute,
    handlePointDataUpdate,
    setInitialRoutes,
    addDrawnRoute,
    addSegmentToDrawnRoute,
    deleteSegmentFromDrawnRoute,
  }
}
