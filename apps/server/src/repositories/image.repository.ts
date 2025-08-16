import type { tripImagePlacementEnum } from '../../db/schema'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db'
import { tripImages } from '../../db/schema'

type Placement = (typeof tripImagePlacementEnum.enumValues)[number]

/**
 * Определяет структуру метаданных, извлекаемых из изображения.
 */
export interface ImageMetadata {
  gps: { latitude: number, longitude: number } | null
  takenAt: Date | null
  width: number | null
  height: number | null
  orientation: number | null
  thumbnailUrl: string | null
  metadata: {
    cameraMake: string | null
    cameraModel: string | null
    fNumber: number | null
    exposureTime: number | null
    iso: number | null
    focalLength: number | null
    apertureValue: number | null
  } | null
  extendedMetadata: Record<string, any> | null
}

export const imageRepository = {
  /**
   * Добавляет новое изображение и его метаданные для путешествия.
   * @param tripId - ID путешествия.
   * @param url - URL загруженного изображения.
   * @param placement - Тип размещения изображения.
   * @param metadata - Объект с извлеченными метаданными изображения.
   * @returns Созданная запись об изображении.
   */
  async create(tripId: string, url: string, placement: Placement, metadata: ImageMetadata) {
    const [newImage] = await db
      .insert(tripImages)
      .values({
        tripId,
        url,
        placement,
        takenAt: metadata.takenAt,
        latitude: metadata.gps?.latitude ?? null,
        longitude: metadata.gps?.longitude ?? null,
        width: metadata.width,
        height: metadata.height,
        orientation: metadata.orientation,
        thumbnailUrl: metadata.thumbnailUrl,
        cameraMake: metadata.metadata?.cameraMake,
        cameraModel: metadata.metadata?.cameraModel,
        fNumber: metadata.metadata?.fNumber,
        exposureTime: metadata.metadata?.exposureTime,
        iso: metadata.metadata?.iso,
        focalLength: metadata.metadata?.focalLength,
        apertureValue: metadata.metadata?.apertureValue,
        extendedMetadata: metadata.extendedMetadata,
      })
      .returning()

    return newImage
  },

  /**
   * Получает все изображения для конкретного путешествия.
   * @param tripId - ID путешествия.
   * @param placement - Опциональный фильтр по типу размещения.
   * @returns Массив изображений.
   */
  async getByTripId(tripId: string, placement?: Placement) {
    const conditions = [eq(tripImages.tripId, tripId)]
    if (placement) {
      conditions.push(eq(tripImages.placement, placement))
    }

    return await db.query.tripImages.findMany({
      where: and(...conditions),
      orderBy: (images, { desc }) => [desc(images.createdAt)],
    })
  },

  /**
   * Удаляет изображение по его ID.
   * @param id - ID изображения для удаления.
   * @returns Объект удаленного изображения или null, если не найден.
   */
  async delete(id: string) {
    const [deletedImage] = await db
      .delete(tripImages)
      .where(eq(tripImages.id, id))
      .returning()

    return deletedImage || null
  },
}
