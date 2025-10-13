import type { GeneratedBooking, ILLMRepository } from '../../model/types'
import { TOKEN_KEY } from '~/shared/store/auth.store'

export class LLMRepository implements ILLMRepository {
  async generateBookingFromData(formData: FormData): Promise<GeneratedBooking> {
    const accessToken = useStorage<string | null>(TOKEN_KEY, null)

    const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/booking/generate`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка при генерации бронирования.')
    }

    return response.json()
  }
}
