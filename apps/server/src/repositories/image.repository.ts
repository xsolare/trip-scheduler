import type { tripImagePlacementEnum } from '~/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { tripImages } from '~/db/schema'

type Placement = (typeof tripImagePlacementEnum.enumValues)[number]

export const imageRepository = {
  /**
   * Добавляет ссылку на новое изображение для путешествия.
   * @param tripId - ID путешествия.
   * @param url - URL загруженного изображения.
   * @param placement - Тип размещения изображения.
   * @returns Созданная запись об изображении.
   */
  async create(tripId: string, url: string, placement: Placement) {
    const [newImage] = await db
      .insert(tripImages)
      .values({ tripId, url, placement })
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
