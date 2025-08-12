import type { z } from 'zod'
import type { CreateMemoryInputSchema, UpdateMemoryInputSchema } from '~/modules/memory/memory.schemas'
import { db } from 'db'
import { memories, tripImages } from 'db/schema'
import { eq } from 'drizzle-orm'

export const memoryRepository = {
  /**
   * Создает новое воспоминание (текст или фото).
   */
  async create(data: z.infer<typeof CreateMemoryInputSchema>) {
    const [newMemory] = await db
      .insert(memories)
      .values({
        ...data,
        timestamp: data.timestamp ? new Date(data.timestamp) : null,
      })
      .returning()

    return newMemory
  },

  /**
   * Получает все воспоминания для путешествия, включая URL изображений.
   */
  async getByTripId(tripId: string) {
    return await db
      .select({
        id: memories.id,
        tripId: memories.tripId,
        timestamp: memories.timestamp,
        comment: memories.comment,
        imageId: memories.imageId,
        imageUrl: tripImages.url,
        createdAt: memories.createdAt,
        updatedAt: memories.updatedAt,
      })
      .from(memories)
      .leftJoin(tripImages, eq(memories.imageId, tripImages.id))
      .where(eq(memories.tripId, tripId))
      .orderBy(memories.timestamp, memories.createdAt)
  },

  /**
   * Обновляет воспоминание (комментарий или временную метку).
   * @returns Обновленный объект или null
   */
  async update(data: z.infer<typeof UpdateMemoryInputSchema>) {
    const { id, ...updateData } = data

    // Создаем объект для обновления
    const payload: Record<string, any> = { ...updateData, updatedAt: new Date() }

    // Явно обрабатываем поле timestamp, чтобы можно было установить его в null
    if (Object.prototype.hasOwnProperty.call(updateData, 'timestamp')) {
      payload.timestamp = updateData.timestamp ? new Date(updateData.timestamp) : null
    }

    const [updatedMemory] = await db
      .update(memories)
      .set(payload)
      .where(eq(memories.id, id))
      .returning()

    return updatedMemory || null
  },

  /**
   * Удаляет воспоминание по ID.
   * @returns Удаленный объект или null
   */
  async delete(id: string) {
    const [deletedMemory] = await db
      .delete(memories)
      .where(eq(memories.id, id))
      .returning()

    return deletedMemory || null
  },

  /**
   * Устанавливает timestamp для воспоминания, используя 'takenAt' из связанного изображения.
   * @param id - ID воспоминания.
   * @returns Обновленный объект или null.
   */
  async applyTakenAtTimestamp(id: string) {
    const memory = await db.query.memories.findFirst({
      where: eq(memories.id, id),
      columns: { imageId: true },
    })

    if (!memory?.imageId) {
      return null
    }

    const image = await db.query.tripImages.findFirst({
      where: eq(tripImages.id, memory.imageId),
      columns: { takenAt: true },
    })

    if (!image?.takenAt) {
      return null
    }

    const [updatedMemory] = await db
      .update(memories)
      .set({ timestamp: image.takenAt, updatedAt: new Date() })
      .where(eq(memories.id, id))
      .returning()

    return updatedMemory || null
  },

  /**
   * Отвязывает воспоминание от даты, устанавливая timestamp в null.
   * @param id - ID воспоминания.
   * @returns Обновленный объект или null.
   */
  async unassignTimestamp(id: string) {
    const [updatedMemory] = await db
      .update(memories)
      .set({ timestamp: null, updatedAt: new Date() })
      .where(eq(memories.id, id))
      .returning()

    return updatedMemory || null
  },
}
