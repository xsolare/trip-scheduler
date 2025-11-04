import type { IFileRepository } from '../../model/types'
import type { TripImage, TripImagePlacement } from '~/shared/types/models/trip'

export class FileRepository implements IFileRepository {
  async uploadFileWithProgress(file: File, tripId: string, placement: TripImagePlacement, onProgress: (percentage: number) => void, signal: AbortSignal): Promise<TripImage> {
    console.warn('Mock uploadFileWithProgress called, simulating upload.', { file, tripId, placement })

    return new Promise((resolve, reject) => {
      let progress = 0
      const interval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(interval)
          reject(new DOMException('Upload aborted', 'AbortError'))
          return
        }
        progress += 25
        onProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          resolve({
            id: `mock-img-${Date.now()}`,
            url: URL.createObjectURL(file),
            originalName: file.name,
            sizeBytes: file.size,
            tripId,
            placement,
            createdAt: new Date().toISOString(),
          } as TripImage)
        }
      }, 300)

      signal.addEventListener('abort', () => {
        clearInterval(interval)
        reject(new DOMException('Upload aborted', 'AbortError'))
      })
    })
  }

  /**
   * Загружает файл на сервер.
   * @param _file - Объект файла для загрузки.
   * @param _tripId - ID путешествия для привязки файла.
   * @returns Promise с URL загруженного файла.
   */
  async uploadFile(_file: File, _tripId: string, _placement: TripImagePlacement): Promise<TripImage> {
    return Promise.resolve({} as TripImage)
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
