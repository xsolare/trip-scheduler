/* eslint-disable node/prefer-global/buffer */
import type { Context } from 'hono'
import { tripImagePlacementEnum } from 'db/schema'
import { HTTPException } from 'hono/http-exception'
import { imageRepository } from '~/repositories/image.repository'
import { generateFilePaths, saveFile } from '~/services/file-storage.service'
import { extractAndStructureMetadata, generateThumbnail } from '~/services/image-metadata.service'

export async function uploadFileController(c: Context) {
  // 1. Валидация HTTP-запроса
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
    const paths = generateFilePaths(tripId, placement, file.name)

    // 3. Извлечение метаданных (делегировано сервису)
    const { metadata, embeddedThumbnailBuffer } = await extractAndStructureMetadata(fileBuffer)

    // 4. Обработка Thumbnail (оркестрация)
    let finalThumbnailUrl: string | null = null
    try {
      const thumbnailBuffer = embeddedThumbnailBuffer ?? await generateThumbnail(fileBuffer)
      await saveFile(paths.thumbFullPath, thumbnailBuffer)
      finalThumbnailUrl = paths.thumbnailUrl
    }
    catch (thumbError) {
      console.error('Не удалось создать или сохранить thumbnail:', thumbError)
    }

    // 5. Сохранение основного файла (делегировано сервису)
    await saveFile(paths.fullPath, fileBuffer)

    // Выведи в консоль локальное время снимка
    console.log('> TIME', TODO)
    
    // 6. Сохранение записи в БД
    const newImageRecord = await imageRepository.create(tripId, paths.url, placement, {
      ...metadata,
      thumbnailUrl: finalThumbnailUrl,
    })

    // 7. Отправка ответа
    return c.json(newImageRecord)
  }
  catch (error) {
    console.error('Ошибка при обработке загруженного файла:', error)
    throw new HTTPException(500, { message: 'Внутренняя ошибка при обработке файла.' })
  }
}
