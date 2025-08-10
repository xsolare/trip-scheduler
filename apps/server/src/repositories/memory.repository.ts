import type { z } from 'zod'
import type { CreateMemoryInputSchema, UpdateMemoryInputSchema } from '~/lib/schemas'
import { db } from 'db'
import { memories, tripImages } from 'db/schema'
import { eq } from 'drizzle-orm'
import { createTRPCError } from '~/lib/trpc'

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
   */
  async update(data: z.infer<typeof UpdateMemoryInputSchema>) {
    const { id, ...updateData } = data
    const [updatedMemory] = await db
      .update(memories)
      .set({
        ...updateData,
        timestamp: updateData.timestamp ? new Date(updateData.timestamp) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(memories.id, id))
      .returning()

    if (!updatedMemory)
      createTRPCError('NOT_FOUND', `Воспоминание с ID ${id} не найдено.`)

    return updatedMemory
  },

  /**
   * Удаляет воспоминание по ID.
   */
  async delete(id: string) {
    const [deletedMemory] = await db
      .delete(memories)
      .where(eq(memories.id, id))
      .returning()

    if (!deletedMemory)
      createTRPCError('NOT_FOUND', `Воспоминание с ID ${id} не найдено.`)

    return deletedMemory
  },
}
