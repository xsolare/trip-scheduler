import type { IFileRepository } from '../../model/types'
import type { TripImage } from '~/shared/types/models/trip'
import { trpc } from '~/shared/services/trpc/trpc.service'

export class FileRepository implements IFileRepository {
  /**
   * Загружает файл на сервер.
   * @param file - Объект файла для загрузки.
   * @param tripId - ID путешествия для привязки файла.
   * @returns Promise с URL загруженного файла.
   */
  async uploadFile(file: File, tripId: string): Promise<TripImage> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tripId', tripId)

    // const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/upload`, {
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

  async addImage(tripId: string, imageUrl: string): Promise<TripImage> {
    return await trpc.image.upload.mutate({ tripId, imageUrl })
  }
}
