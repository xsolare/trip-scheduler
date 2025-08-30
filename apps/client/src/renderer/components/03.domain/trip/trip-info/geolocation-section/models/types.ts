// models/types.ts

/**
 * Координаты в формате [долгота, широта].
 * Стандарт для GeoJSON и OpenLayers.
 */
export type Coordinate = [number, number];

/**
 * Тип точки на карте.
 * - `poi`: Point of Interest - обычная точка интереса (как в исходной версии).
 * - `start`: Начальная точка маршрута.
 * - `via`: Промежуточная точка маршрута.
 * - `end`: Конечная точка маршрута.
 */
export type PointType = 'poi' | 'start' | 'via' | 'end';

/**
 * Стиль для маркера на карте.
 * Позволяет гибко настраивать внешний вид.
 */
export interface MarkerStyle {
  iconUrl?: string; // URL для кастомной иконки (SVG или PNG).
  color?: string;   // Цвет заливки для стандартной иконки, если iconUrl не указан.
  scale?: number;   // Масштаб иконки.
}

/**
 * Стиль для линии маршрута.
 */
export interface LineStyle {
  color?: string;   // Цвет линии (например, '#ff0000').
  width?: number;   // Ширина линии в пикселях.
}

/**
 * Основной интерфейс для представления точки (маркера) на карте.
 * Заменяет собой GeolocationMarkerOptions для большей гибкости.
 */
export interface MapPoint {
  id: string;                 // Уникальный идентификатор точки.
  coordinates: Coordinate;      // Координаты точки.
  type: PointType;            // Тип точки для стилизации и логики.
  popupContent?: string;      // HTML-содержимое для всплывающего окна.
  style?: MarkerStyle;        // Индивидуальные стили для маркера.
  address?: string;
}

/**
 * Представление построенного маршрута на карте.
 */
export interface MapRoute {
  id: string;                 // Уникальный идентификатор маршрута.
  waypoints: MapPoint[];      // Точки, через которые проходит маршрут.
  geometry: Coordinate[];     // Геометрия линии маршрута (массив координат).
  distance: number;           // Дистанция в метрах.
  duration: number;           // Примерное время в пути в секундах.
  style?: LineStyle;          // Стили для линии маршрута.
}

/**
 * Результат обратного геокодирования (координаты -> адрес).
 * Используется для функций "Показать адрес" и "Что здесь?".
 */
export interface ReverseGeocodingResult {
  coordinates: Coordinate;
  address: string; // Полный отформатированный адрес.
  // Опциональные детальные поля для будущего расширения.
  country?: string;
  city?: string;
  road?: string;
  houseNumber?: string;
}


// --- Исходные интерфейсы (модифицированы или оставлены для обратной совместимости) ---

/**
 * Данные секции с геолокацией, приходящие извне.
 * Остается без изменений, так как это структура входных данных.
 */
export interface ActivitySectionGeolocation {
  id: string;
  isAttached?: boolean;
  title?: string;
  icon?: string;
  latitude: number;
  longitude: number;
  address: string;
}

/**
 * Опции для инициализации карты.
 * Остается без изменений.
 */
export interface GeolocationMapOptions {
  container: string | HTMLElement;
  center: [number, number];
  zoom?: number;
  interactive?: boolean;
}

/**
 * @deprecated Заменен на более гибкий интерфейс `MapPoint`.
 * Этот интерфейс больше не требуется.
 */
export interface GeolocationMarkerOptions {
  showPopup?: boolean;
  popupText?: string;
  color?: string;
}
