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

/**
 * Тип данных для билета на поезд.
 */
export interface TrainData {
  departureStation?: string
  arrivalStation?: string
  departureDateTime?: string // ISO 8601 format
  arrivalDateTime?: string // ISO 8601 format
  trainNumber?: string
  carriage?: string
  seat?: string
  bookingReference?: string
  notes?: string
}

/**
 * Тип данных для билета на достопримечательность/мероприятие.
 */
export interface AttractionData {
  attractionName?: string
  address?: string
  location?: LocationCoords
  dateTime?: string // ISO 8601 format
  ticketType?: string
  guests?: string
  bookingReference?: string
  notes?: string
}

// --- Общий тип бронирования ---

export type Booking
  = | (BookingBase & { type: 'flight', data: FlightData })
    | (BookingBase & { type: 'hotel', data: HotelData })
    | (BookingBase & { type: 'train', data: TrainData })
    | (BookingBase & { type: 'attraction', data: AttractionData })

export type BookingType = Booking['type']

export interface BookingSectionContent {
  bookings: Booking[]
}
