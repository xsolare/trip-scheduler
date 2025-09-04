/**
 * Базовая структура для любого типа бронирования.
 */
export interface BookingBase {
  id: string
  icon: string
  title: string
}

/**
 * Интерфейс для хранения географических координат.
 */
export interface LocationCoords {
  lat: number
  lon: number
}

/**
 * Тип данных для авиаперелета.
 * Добавлены поля для дат, аэропортов и времени.
 */
export interface FlightData {
  departureCity?: string
  arrivalCity?: string
  departureAirport?: string
  arrivalAirport?: string
  departureAirportLocation?: LocationCoords
  arrivalAirportLocation?: LocationCoords
  departureDateTime?: string // ISO 8601 format
  arrivalDateTime?: string // ISO 8601 format
  flightNumber?: string
  airline?: string
  bookingReference?: string
  seat?: string
  notes?: string
}

/**
 * Тип данных для бронирования отеля.
 */
export interface HotelData {
  hotelName?: string
  address?: string
  location?: LocationCoords
  checkInDate?: string // YYYY-MM-DD
  checkOutDate?: string // YYYY-MM-DD
  roomType?: string
  guests?: string
  confirmationNumber?: string
  phone?: string
  email?: string
  website?: string
  notes?: string
}

// --- Общий тип бронирования ---

export type Booking = (BookingBase & { type: 'flight', data: FlightData })
  | (BookingBase & { type: 'hotel', data: HotelData })

export interface BookingSectionContent {
  bookings: Booking[]
}
