import type { EActivitySectionType } from '~/shared/types/models/activity'

/**
 * Координаты в формате [долгота, широта].
 * Стандарт для GeoJSON и OpenLayers.
 */
export type Coordinate = [number, number]

/**
 * Тип точки на карте.
 * - `poi`: Point of Interest - обычная точка интереса.
 * - `start`: Начальная точка маршрута.
 * - `via`: Промежуточная точка маршрута.
 * - `end`: Конечная точка маршрута.
 */
export type PointType = 'poi' | 'start' | 'via' | 'end'

/**
 * Стиль для маркера на карте.
 * Позволяет гибко настраивать внешний вид.
 */
export interface MarkerStyle {
  iconUrl?: string // URL для кастомной иконки (SVG или PNG).
  color?: string // Цвет заливки для стандартной иконки, если iconUrl не указан.
  scale?: number // Масштаб иконки.
}

/**
 * Основной интерфейс для представления точки (маркера) на карте.
 * Заменяет собой GeolocationMarkerOptions для большей гибкости.
 */
export interface MapPoint {
  id: string // Уникальный идентификатор точки.
  coordinates: Coordinate // Координаты точки.
  type: PointType // Тип точки для стилизации и логики.
  style?: MarkerStyle // Индивидуальные стили для маркера.
  address?: string
  comment?: string // Комментарий который будет отображен над маркером
}

export interface ActivitySectionGeolocation {
  // Общие метаданные
  id: string
  type: EActivitySectionType.GEOLOCATION
  isAttached?: boolean
  title?: string
  icon?: string
  // Данные связанные с геолокацией
  points: MapPoint[] // Point of Interest - обычные точки интереса
  routes: unknown[] // Later
}

/**
 * Опции для инициализации карты.
 */
export interface GeolocationMapOptions {
  container: string | HTMLElement
  center: [number, number]
  zoom?: number
  interactive?: boolean
}
