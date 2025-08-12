import type { tripImagePlacementEnum } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { tripImages } from '../../db/schema'

type Placement = (typeof tripImagePlacementEnum.enumValues)[number]

export interface ImageMetadata {
  gps: { latitude: number, longitude: number } | null
  takenAt: Date | null
  width: number | null
  height: number | null
  orientation: number | null
  cameraMake: string | null
  cameraModel: string | null
  thumbnailUrl: string | null
  fNumber: number | null
  exposureTime: number | null
  iso: number | null
  focalLength: number | null
  apertureValue: number | null
  otherMetadata?: Record<string, any> | null
}

export const imageRepository = {
  /**
   * Добавляет ссылку на новое изображение для путешествия со всеми метаданными.
   */
  async create(tripId: string, url: string, placement: Placement, metadata: Partial<ImageMetadata> = {}) {
    const [newImage] = await db
      .insert(tripImages)
      .values({
        tripId,
        url,
        placement,
        latitude: metadata.gps?.latitude ?? null,
        longitude: metadata.gps?.longitude ?? null,
        takenAt: metadata.takenAt ?? null,
        width: metadata.width ?? null,
        height: metadata.height ?? null,
        orientation: metadata.orientation ?? null,
        cameraMake: metadata.cameraMake ?? null,
        cameraModel: metadata.cameraModel ?? null,
        thumbnailUrl: metadata.thumbnailUrl ?? null,
        fNumber: metadata.fNumber ?? null,
        exposureTime: metadata.exposureTime ?? null,
        iso: metadata.iso ?? null,
        focalLength: metadata.focalLength ?? null,
        apertureValue: metadata.apertureValue ?? null,
        otherMetadata: metadata.otherMetadata ?? null,
      })
      .returning()

    return newImage
  },

  /**
   * Получает все изображения для конкретного путешествия.
   * @param tripId - ID путешествия.
   * @returns Массив изображений.
   */
  async getByTripId(tripId: string) {
    return await db.query.tripImages.findMany({
      where: eq(tripImages.tripId, tripId),
      orderBy: (images, { desc }) => [desc(images.createdAt)],
    })
  },
}
