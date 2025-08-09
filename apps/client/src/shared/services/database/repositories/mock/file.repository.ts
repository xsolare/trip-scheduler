import type { IFileRepository } from '../../model/types'
import type { TripImage, TripImagePlacement } from '~/shared/types/models/trip'
import { throttle } from '../../lib/decorators'

class FileRepository implements IFileRepository {
  /**
   * Загружает файл на сервер.
   * @param _file - Объект файла для загрузки.
   * @param _tripId - ID путешествия для привязки файла.
   * @returns Promise с URL загруженного файла.
   */
  @throttle(1_000)
  async uploadFile(_file: File, _tripId: string, _placement: TripImagePlacement): Promise<TripImage> {
    return Promise.resolve({} as TripImage)
  }

  @throttle(1_000)
  async listImageByTrip(_tripId: string): Promise<TripImage[]> {
    return Promise.resolve([])
  }

  @throttle(1_000)
  async addImage(_tripId: string, _imageUrl: string): Promise<TripImage> {
    return Promise.resolve({} as TripImage)
  }
}

export { FileRepository }
