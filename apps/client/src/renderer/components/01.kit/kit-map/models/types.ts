/**
 * Интерфейс для хранения географических координат.
 * [Долгота, Широта]
 */
export interface LocationCoords {
  lat: number
  lon: number
}

/**
 * Описывает маркер для отображения на карте.
 */
export interface MapMarker {
  id: string
  coords: LocationCoords
  iconUrl?: string
  color?: string
  draggable?: boolean
}
