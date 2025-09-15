import type { IFileRepository } from '../../model/types'
import type { User } from '~/shared/types/models/auth'
import type { TripImage, TripImagePlacement } from '~/shared/types/models/trip'

export class FileRepository implements IFileRepository {
  /**
   * Загружает файл на сервер.
   * @param _file - Объект файла для загрузки.
   * @param _tripId - ID путешествия для привязки файла.
   * @returns Promise с URL загруженного файла.
   */
  async uploadFile(_file: File, _tripId: string, _placement: TripImagePlacement): Promise<TripImage> {
    return Promise.resolve({} as TripImage)
  }

  async uploadAvatar(_file: File): Promise<User> {
    console.warn('uploadAvatar is not implemented for SQL client and uses a mock.')
    return Promise.resolve({} as User)
  }

  async listImageByTrip(_tripId: string): Promise<TripImage[]> {
    return Promise.resolve([])
  }

  async getAllUserFiles(): Promise<TripImage[]> {
    return Promise.resolve([])
  }

  async deleteFile(_id: string): Promise<void> {
    return Promise.resolve()
  }
}
