import type { GeneratedBooking, ILLMRepository } from '../../model/types'

export class LLMRepository implements ILLMRepository {
  async generateBookingFromData(_formData: FormData): Promise<GeneratedBooking> {
    console.warn('LLMRepository.generateBookingFromData is not implemented for the SQL client.')
    // Эта функция зависит от удаленного сервера, который недоступен в оффлайн SQL-режиме.
    throw new Error('Генерация бронирований с помощью ИИ доступна только в онлайн-режиме.')
  }
}
