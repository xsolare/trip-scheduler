import type { tripImagePlacementEnum } from '../../db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { tripImages } from '../../db/schema'

type Placement = (typeof tripImagePlacementEnum.enumValues)[number]

/**
 * Определяет структуру метаданных, извлекаемых из изображения.
 */
export interface ImageMetadata {
  takenAt: Date | null
  latitude: number | null
  longitude: number | null
  width: number | null
  height: number | null
  thumbnailUrl: string | null
  metadata: {
    orientation?: number
    timezoneOffset?: number
    cameraMake?: string
    cameraModel?: string
    fNumber?: number
    exposureTime?: number
    iso?: number
    focalLength?: number
    apertureValue?: number
    [key: string]: any // Для всех остальных расширенных метаданных
  } | null
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
        latitude: metadata.latitude,
        longitude: metadata.longitude,
        width: metadata.width,
        height: metadata.height,
        thumbnailUrl: metadata.thumbnailUrl,
        metadata: metadata.metadata,
      })
      .returning()

    return newImage
  },

  /**
   * Получает все изображения для конкретного путешествия.
   * Для 'route' возвращает урезанный набор полей для оптимизации.
   * @param tripId - ID путешествия.
   * @param placement - Опциональный фильтр по типу размещения.
   * @returns Массив изображений.
   */
  async getByTripId(tripId: string, placement?: Placement) {
    const conditions = [eq(tripImages.tripId, tripId)]
    if (placement) {
      conditions.push(eq(tripImages.placement, placement))
    }

    // Если запрашиваются изображения для маршрута, возвращаем только необходимые поля
    if (placement === 'route') {
      return await db
        .select({
          id: tripImages.id,
          tripId: tripImages.tripId,
          url: tripImages.url,
          placement: tripImages.placement,
          createdAt: tripImages.createdAt,
        })
        .from(tripImages)
        .where(and(...conditions))
        .orderBy(desc(tripImages.createdAt))
    }

    // В остальных случаях (например, для 'memories') возвращаем все поля
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
