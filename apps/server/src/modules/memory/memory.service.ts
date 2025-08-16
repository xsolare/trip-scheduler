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
    const deletedMemory = await memoryRepository.delete(id)
    if (!deletedMemory) {
      throw createTRPCError('NOT_FOUND', `Воспоминание с ID ${id} не найдено.`)
    }

    // Если у воспоминания было изображение, удаляем его файлы и запись в БД
    if (deletedMemory.imageId && deletedMemory.image?.url) {
      try {
        // Сначала удаляем запись из таблицы trip_images
        await imageRepository.delete(deletedMemory.imageId)

        const getFilePathFromUrl = (url: string) => {
          try {
            const urlObject = new URL(url)
            // pathname это /static/tripId/placement/filename.jpg
            // process.cwd() - это корень проекта, где находится папка static
            return path.join(process.cwd(), urlObject.pathname.slice(1))
          }
          catch {
            console.error('Невалидный URL для удаления файла:', url)
            return null
          }
        }

        // Удаляем основной файл
        const mainImagePath = getFilePathFromUrl(deletedMemory.image.url)
        if (mainImagePath) {
          await fs.unlink(mainImagePath).catch(err => console.error(`Не удалось удалить основной файл изображения: ${mainImagePath}`, err))
        }

        // Удаляем превью (thumbnail)
        if (deletedMemory.image.thumbnailUrl) {
          const thumbPath = getFilePathFromUrl(deletedMemory.image.thumbnailUrl)
          if (thumbPath) {
            await fs.unlink(thumbPath).catch(err => console.error(`Не удалось удалить превью изображения: ${thumbPath}`, err))
          }
        }
      }
      catch (error) {
        console.error(`Ошибка при удалении файла/записи изображения для воспоминания ${id}:`, error)
      }
    }

    return deletedMemory
  },

  async getByTripId(tripId: string) {
    return await memoryRepository.getByTripId(tripId)
  },

}
