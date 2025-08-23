import type { z } from 'zod'
import type { CreateMemoryInputSchema, UpdateMemoryInputSchema } from './memory.schemas'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createTRPCError } from '~/lib/trpc'
import { imageRepository } from '~/repositories/image.repository'
import { memoryRepository } from '~/repositories/memory.repository'

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
        // Сначала удаляем запись из таблицы trip_images
        await imageRepository.delete(deletedMemory.imageId)

        const getFilePathFromUrl = (url: string) => {
          const staticRoot = process.env.STATIC_PATH
          if (!staticRoot) {
            console.error('Переменная окружения STATIC_PATH не установлена.')
            return null
          }
          return path.join(process.cwd(), staticRoot, url)
        }

        const filesToDelete: string[] = []

        // 1. Добавляем оригинал в список на удаление
        if (imageToDelete.url) {
          const mainImagePath = getFilePathFromUrl(imageToDelete.url)
          if (mainImagePath)
            filesToDelete.push(mainImagePath)
        }

        // 2. Добавляем все варианты в список на удаление
        if (imageToDelete.variants) {
          for (const variantPath of Object.values(imageToDelete.variants)) {
            const fullVariantPath = getFilePathFromUrl(variantPath)
            if (fullVariantPath)
              filesToDelete.push(fullVariantPath)
          }
        }

        // 3. Параллельно удаляем все найденные файлы
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
      }
    }

    return deletedMemory
  },

  async getByTripId(tripId: string) {
    return await memoryRepository.getByTripId(tripId)
  },

}
