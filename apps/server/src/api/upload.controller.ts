// src/api/upload.controller.ts

import type { Context } from 'hono'
import type { ImageMetadata } from '~/repositories/image.repository'
import { tripImagePlacementEnum } from 'db/schema'
import { HTTPException } from 'hono/http-exception'
import { imageRepository } from '~/repositories/image.repository'
import { generateFilePaths, saveFile } from '~/services/file-storage.service'
import { extractAndStructureMetadata, generateImageVariants } from '~/services/image-metadata.service'

export async function uploadFileController(c: Context) {
  // 1. Валидация HTTP-запроса (без изменений)
  const formData = await c.req.formData()
  const file = formData.get('file')
  const tripId = formData.get('tripId')
  const placement = formData.get('placement') as 'route' | 'memories'

  if (!file || !(file instanceof File)) {
    throw new HTTPException(400, { message: 'Файл не найден в запросе.' })
  }
  if (!tripId || typeof tripId !== 'string') {
    throw new HTTPException(400, { message: 'Необходимо указать ID путешествия (tripId).' })
  }
  if (!placement || !tripImagePlacementEnum.enumValues.includes(placement)) {
    throw new HTTPException(400, { message: 'Необходимо указать корректный тип размещения.' })
  }

  try {
    // 2. Подготовка данных
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const paths = generateFilePaths(`trips/${tripId}/${placement}`, file.name)

    // 3. Извлечение метаданных
    const { metadata } = await extractAndStructureMetadata(fileBuffer)

    // 4. Генерация и сохранение вариантов
    const imageVariants = await generateImageVariants(fileBuffer)
    const variantUrls: Record<string, string> = {}

    // Используем Promise.all для параллельного сохранения
    await Promise.all(
      Object.entries(imageVariants).map(async ([name, buffer]) => {
        const variantPaths = paths.getVariantPaths(name)
        await saveFile(variantPaths.diskPath, buffer)
        variantUrls[name] = variantPaths.dbPath
      }),
    )

    // 5. Сохранение основного файла
    await saveFile(paths.original.diskPath, fileBuffer)

    // 6. Сохранение записи в БД
    const newImageRecord = await imageRepository.create(
      tripId,
      paths.original.dbPath, // URL оригинала
      placement,
      {
        ...metadata,
        variants: variantUrls, // Объект с URL вариантов
      } as ImageMetadata,
    )

    // 7. Отправка ответа
    return c.json(newImageRecord)
  }
  catch (error) {
    console.error('Ошибка при обработке загруженного файла:', error)
    throw new HTTPException(500, { message: 'Внутренняя ошибка при обработке файла.' })
  }
}
