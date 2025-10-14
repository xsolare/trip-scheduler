import type { GeneratedBooking, GeneratedTransaction, ILLMRepository } from '../../model/types'

export class LLMRepository implements ILLMRepository {
  async generateBookingFromData(formData: FormData): Promise<GeneratedBooking> {
    // eslint-disable-next-line no-console
    console.log('[Mock] Generating booking from FormData:', formData.get('bookingType'), formData.get('file'))
    await new Promise(resolve => setTimeout(resolve, 1500))

    const bookingType = formData.get('bookingType') as string

    if (bookingType === 'flight') {
      return {
        type: 'flight',
        title: 'Перелет Москва-Шанхай (из файла)',
        data: {
          segments: [
            {
              departureCity: 'Москва',
              arrivalCity: 'Шанхай',
              departureAirport: 'SVO',
              arrivalAirport: 'PVG',
              departureDateTime: '2025-10-18T22:40:00',
              arrivalDateTime: '2025-10-19T11:35:00',
              departureTimeZone: '+03:00',
              arrivalTimeZone: '+08:00',
              airline: 'Mock Air',
              airlineIataCode: 'MA',
              flightNumber: 'MA123',
            },
          ],
          bookingReference: 'MOCK123',
        },
      }
    }

    // Дефолтный мок-ответ для других типов
    return {
      type: 'hotel',
      title: 'Отель (из файла)',
      data: {
        hotelName: 'Mock Hotel',
        checkInDate: '2025-11-01',
        checkOutDate: '2025-11-05',
      },
    }
  }

  async generateFinancesFromData(formData: FormData): Promise<GeneratedTransaction[]> {
    // eslint-disable-next-line no-console
    console.log('[Mock] Generating finances from FormData:', formData.get('bookingType'), formData.get('file'))
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Пример ответа, имитирующий распознавание
    return [
      {
        title: 'Обед в кафе (из текста)',
        amount: 500,
        currency: 'RUB',
        date: '2025-10-13', // Имитация "вчера"
      },
      {
        title: 'Такси (из текста)',
        amount: 1200,
        currency: 'RUB',
        notes: 'До дома',
      },
    ]
  }
}
