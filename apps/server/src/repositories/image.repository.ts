import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { tripImages } from '~/db/schema'

export const imageRepository = {
  /**
   * Добавляет ссылку на новое изображение для путешествия.
   * @param tripId - ID путешествия.
   * @param url - URL загруженного изображения.
   * @returns Созданная запись об изображении.
   */
  async create(tripId: string, url: string) {
    const [newImage] = await db
      .insert(tripImages)
      .values({ tripId, url })
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
