import type { IFileRepository } from '../../model/types'
import type { TripImage, TripImageSection } from '~/shared/types/models/trip'

export class FileRepository implements IFileRepository {
  /**
   * Загружает файл на сервер.
   * @param _file - Объект файла для загрузки.
   * @param _tripId - ID путешествия для привязки файла.
   * @returns Promise с URL загруженного файла.
   */
  async uploadFile(_file: File, _tripId: string, _section: TripImageSection): Promise<TripImage> {
    return Promise.resolve({} as TripImage)
  }

  async listImageByTrip(_tripId: string): Promise<TripImage[]> {
    return Promise.resolve([])
  }

  async addImage(_tripId: string, _imageUrl: string): Promise<TripImage> {
    return Promise.resolve({} as TripImage)
  }
}
