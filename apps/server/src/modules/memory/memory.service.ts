import type { z } from 'zod'
import type { CreateMemoryInputSchema, UpdateMemoryInputSchema } from './memory.schemas'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createTRPCError } from '~/lib/trpc'
import { imageRepository } from '~/repositories/image.repository'
import { memoryRepository } from '~/repositories/memory.repository'
import { tripRepository } from '~/repositories/trip.repository'
import { quotaService } from '~/services/quota.service'

export const memoryService = {
  async create(data: z.infer<typeof CreateMemoryInputSchema>) {
    return await memoryRepository.create(data)
  },

  async update(data: z.infer<typeof UpdateMemoryInputSchema>) {
    const updatedMemory = await memoryRepository.update(data)
    if (!updatedMemory) {
      throw createTRPCError('NOT_FOUND', `Воспоминание с ID ${data.id} не найдено.`)
    }
    return updatedMemory
  },

  async delete(id: string) {
    // Этот метод возвращает полный объект `memory` с вложенным `image`
    const deletedMemory = await memoryRepository.delete(id)
    if (!deletedMemory) {
      throw createTRPCError('NOT_FOUND', `Воспоминание с ID ${id} не найдено.`)
    }

    // Если у воспоминания было изображение, удаляем его файлы
    const imageToDelete = deletedMemory.image
    if (deletedMemory.imageId && imageToDelete) {
      try {
        // Получаем ID пользователя для обновления квоты
        const trip = await tripRepository.getById(deletedMemory.tripId)
        if (!trip) {
          throw new Error(`Путешествие ${deletedMemory.tripId} не найдено для обновления квоты.`)
        }

        // 1. Уменьшаем квоту использования хранилища
        if (imageToDelete.sizeBytes) {
          await quotaService.decrementStorageUsage(trip.userId, imageToDelete.sizeBytes)
        }

        // 2. Удаляем запись из таблицы trip_images
        await imageRepository.delete(deletedMemory.imageId)

        // 3. Удаляем физические файлы
        const getFilePathFromUrl = (url: string) => {
          const staticRoot = process.env.STATIC_PATH
          if (!staticRoot) {
            console.error('Переменная окружения STATIC_PATH не установлена.')
            return null
          }
          return path.join(process.cwd(), staticRoot, url)
        }

        const filesToDelete: string[] = []

        if (imageToDelete.url) {
          const mainImagePath = getFilePathFromUrl(imageToDelete.url)
          if (mainImagePath)
            filesToDelete.push(mainImagePath)
        }

        if (imageToDelete.variants) {
          for (const variantPath of Object.values(imageToDelete.variants)) {
            const fullVariantPath = getFilePathFromUrl(variantPath)
            if (fullVariantPath)
              filesToDelete.push(fullVariantPath)
          }
        }

        await Promise.all(
          filesToDelete.map(filePath =>
            fs.unlink(filePath).catch(err =>
              console.error(`Не удалось удалить файл: ${filePath}`, err),
            ),
          ),
        )
      }
      catch (error) {
        console.error(`Ошибка при удалении файлов изображения для воспоминания ${id}:`, error)
        // Не бросаем ошибку клиенту, т.к. основная сущность (воспоминание) уже удалена
      }
    }

    return deletedMemory
  },

  async getByTripId(tripId: string) {
    return await memoryRepository.getByTripId(tripId)
  },
}
