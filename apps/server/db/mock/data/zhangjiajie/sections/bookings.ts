import { TRIP_ID } from '../constants'

export const MOCK_SECTION_BOOKINGS = {
  id: crypto.randomUUID(),
  tripId: TRIP_ID,
  type: 'bookings' as const,
  title: 'Бронирования',
  icon: 'mdi:ticket-confirmation-outline',
  content: {
    bookings: [
      // Отели
      { id: 'b8c1b2a9-7c1c-4b5c-9c1c-1a2b3c4d5e6f', type: 'hotel', icon: 'mdi:hotel', title: 'FUNGEE S Hotel, Changsha', data: { hotelName: 'FUNGEE S Hotel, Wuyi Square, Huangxing Square Station, Changsha', address: 'No.265 Renmin West Road, Furong District, Changsha, Hunan, China', checkInDate: '2025-10-19', checkOutDate: '2025-10-22', phone: '+86-731-82233088-8888' } },
      { id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c', type: 'hotel', icon: 'mdi:hotel', title: 'Vienna 3 Best Hotel, Zhangjiajie', data: { hotelName: 'Vienna 3 Best Hotel (Zhangjiajie Tianmenshan Cableway Station)', address: 'Yongding District, Zhangjiajie, Hunan, China', checkInDate: '2025-10-22', checkOutDate: '2025-10-26', phone: '+86-17774431215, +86-744-8296888' } },
      { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', type: 'hotel', icon: 'mdi:hotel', title: 'Fenghuang Jinshuian River View Hotel', data: { hotelName: 'Fenghuang Jinshuian River View Hotel', address: 'No.59-2 Jinjiayuan Road, Fenghuang County, Hunan, China', checkInDate: '2025-10-26', checkOutDate: '2025-10-27', phone: '+86-13397632336' } },
      { id: 'e6f7a8b9-c0d1-4e2f-b3c4-d5e6f7a8b9c0', type: 'hotel', icon: 'mdi:hotel', title: 'Homeinn Plus Hotel, Chongqing', data: { hotelName: 'Homeinn Plus Hotel (Chongqing Liziba Niujiaotuo Light Rail Station)', address: '114 Shangqingsi Road, Yuzhong District, Chongqing, China', checkInDate: '2025-10-27', checkOutDate: '2025-11-03', phone: '+86-23-63266888-9' } },
      // Авиаперелеты
      { id: 'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6a', type: 'flight', icon: 'mdi:airplane', title: 'Перелет Ульяновск - Москва', data: { bookingReference: '6K84TK', notes: 'Без багажа. Ручная кладь 10 кг на пассажира. Рейс выполняет а/к "Россия".', segments: [{ departureCity: 'Ульяновск', arrivalCity: 'Москва', departureAirport: 'ULV', arrivalAirport: 'SVO', departureDateTime: '2025-10-18T17:10:00', departureTimeZone: '+04:00', arrivalDateTime: '2025-10-18T17:40:00', arrivalTimeZone: '+03:00', flightNumber: '6080', airline: 'Аэрофлот (Россия)', aircraft: 'Сухой Суперджет 100-95 SU9' }] } },
      { id: 'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d', type: 'flight', icon: 'mdi:airplane', title: 'Перелет: Москва → Чанша', data: { bookingReference: '88YBQL', notes: 'Общий номер электронного билета: 876-2899402792. Пассажир: Ivan Kornilov.', segments: [{ departureCity: 'Москва', arrivalCity: 'Чэнду', departureAirport: 'SVO', arrivalAirport: 'TFU', departureDateTime: '2025-10-18T22:40:00', departureTimeZone: '+03:00', arrivalDateTime: '2025-10-19T11:35:00', arrivalTimeZone: '+08:00', flightNumber: '3U 3888', airline: 'Sichuan Airlines', aircraft: 'Airbus A350-900', terminalDeparture: 'C', terminalArrival: '1' }, { departureCity: 'Чэнду', arrivalCity: 'Чанша', departureAirport: 'TFU', arrivalAirport: 'CSX', departureDateTime: '2025-10-19T15:30:00', departureTimeZone: '+08:00', arrivalDateTime: '2025-10-19T17:25:00', arrivalTimeZone: '+08:00', flightNumber: '3U 6741', airline: 'Sichuan Airlines', aircraft: 'Airbus A320', terminalDeparture: '2', terminalArrival: '1' }] } },
      { id: 'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c7d', type: 'flight', icon: 'mdi:airplane', title: 'Перелет Чунцин - Москва', data: { bookingReference: 'GS6581 / JD607', notes: 'Пересадка в г. Ханчжоу (3ч 35мин). Требуется получить и повторно зарегистрировать багаж. Пересадка в другом терминале.', segments: [{ departureCity: 'Чунцин', arrivalCity: 'Ханчжоу', departureAirport: 'CKG', arrivalAirport: 'HGH', departureDateTime: '2025-11-02T08:15:00', departureTimeZone: '+08:00', arrivalDateTime: '2025-11-02T10:20:00', arrivalTimeZone: '+08:00', flightNumber: 'GS6581', airline: 'Tianjin Airlines', aircraft: 'Airbus A32C (средний)', terminalDeparture: 'T3', terminalArrival: 'T3' }, { departureCity: 'Ханчжоу', arrivalCity: 'Москва', departureAirport: 'HGH', arrivalAirport: 'SVO', departureDateTime: '2025-11-02T13:55:00', departureTimeZone: '+08:00', arrivalDateTime: '2025-11-02T19:15:00', arrivalTimeZone: '+03:00', flightNumber: 'JD607', airline: 'Capital Airlines', aircraft: 'Airbus A330 (большой)', terminalDeparture: 'T4', terminalArrival: 'C' }] } },
    ],
  },
  order: 1,
}
