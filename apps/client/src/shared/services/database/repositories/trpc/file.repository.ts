import type { IFileRepository } from '../../model/types'
import type { TripImage, TripImagePlacement } from '~/shared/types/models/trip'
import { trpc } from '~/shared/services/trpc/trpc.service'

export class FileRepository implements IFileRepository {
  /**
   * Загружает файл на сервер.
   * @param file - Объект файла для загрузки.
   * @param tripId - ID путешествия для привязки файла.
   * @param placement - Назначение изображения ('route' или 'memories').
   * @param timestamp - Опциональная временная метка для воспоминаний.
   * @param comment - Опциональный комментарий для воспоминаний.
   * @returns Promise с данными о созданном изображении.
   */
  async uploadFile(file: File, tripId: string, placement: TripImagePlacement, timestamp?: string | null, comment?: string | null): Promise<TripImage> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tripId', tripId)
    formData.append('placement', placement)
    if (timestamp)
      formData.append('timestamp', timestamp)
    if (comment)
      formData.append('comment', comment)

    const response = await fetch(`/api/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка при загрузке файла на сервер.')
    }

    return response.json()
  }

  async listImageByTrip(tripId: string): Promise<TripImage[]> {
    return await trpc.image.listByTrip.query({ tripId })
  }

  // ИСПРАВЛЕНИЕ: Обновляем метод для соответствия интерфейсу и передачи всех данных
  async addImage(tripId: string, imageUrl: string, placement: TripImagePlacement): Promise<TripImage> {
    return await trpc.image.upload.mutate({ tripId, imageUrl, placement })
  }
}
