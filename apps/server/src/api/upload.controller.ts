import type { Context } from 'hono'
import type { ImageMetadata } from '~/repositories/image.repository'
import { tripImagePlacementEnum } from 'db/schema'
import { HTTPException } from 'hono/http-exception'
import sharp from 'sharp'
import { authUtils } from '~/lib/auth.utils'
import { imageService } from '~/modules/image/image.service'
import { userRepository } from '~/repositories/user.repository'
import { generateFilePaths, saveFile } from '~/services/file-storage.service'
import { extractAndStructureMetadata, generateImageVariants } from '~/services/image-metadata.service'
import { fileUploadsCounter, fileUploadSizeBytesHistogram } from '~/services/metrics.service'
import { quotaService } from '~/services/quota.service'

export async function uploadFileController(c: Context) {
  // --- АУТЕНТИФИКАЦИЯ ---
  const authHeader = c.req.header('authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) {
    throw new HTTPException(401, { message: 'Токен аутентификации не предоставлен.' })
  }
  const payload = await authUtils.verifyToken(token)
  if (!payload) {
    throw new HTTPException(401, { message: 'Невалидный или истекший токен.' })
  }
  const userId = payload.id

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

    // Предварительная проверка по размеру исходного файла
    await quotaService.checkStorageQuota(userId, fileBuffer.length)

    const paths = generateFilePaths(`trips/${tripId}/${placement}`, file.name)

    // 3. Извлечение метаданных
    const { metadata } = await extractAndStructureMetadata(fileBuffer)

    // 4. Генерация и сохранение вариантов
    const imageVariants = await generateImageVariants(fileBuffer)
    const variantUrls: Record<string, string> = {}
    let variantsTotalSize = 0

    // Используем Promise.all для параллельного сохранения
    await Promise.all(
      Object.entries(imageVariants).map(async ([name, buffer]) => {
        const variantPaths = paths.getVariantPaths(name)
        await saveFile(variantPaths.diskPath, buffer)
        variantUrls[name] = variantPaths.dbPath
        variantsTotalSize += buffer.length
      }),
    )

    // 5. Сохранение основного файла
    await saveFile(paths.original.diskPath, fileBuffer)

    // 6. Сохранение записи в БД
    const totalSize = fileBuffer.length + variantsTotalSize
    const newImageRecord = await imageService.create(
      tripId,
      paths.original.dbPath, // URL оригинала
      file.name, // Сохраняем оригинальное имя
      placement,
      totalSize,
      {
        ...metadata,
        variants: variantUrls, // Объект с URL вариантов
      } as ImageMetadata,
    )

    await quotaService.incrementStorageUsage(userId, totalSize)

    fileUploadsCounter.inc({ placement })
    fileUploadSizeBytesHistogram.observe({ placement }, file.size)

    // 7. Отправка ответа
    return c.json(newImageRecord)
  }
  catch (error: any) {
    console.error('Ошибка при обработке загруженного файла:', error)

    if (error instanceof HTTPException) {
      throw error
    }

    return c.json(
      { message: error.message || 'Внутренняя ошибка при обработке файла.' },
      500,
    )
  }
}

export async function uploadAvatarController(c: Context) {
  const authHeader = c.req.header('authorization')
  const token = authHeader?.split(' ')[1]
  if (!token)
    throw new HTTPException(401, { message: 'Токен не предоставлен.' })

  const payload = await authUtils.verifyToken(token)
  if (!payload)
    throw new HTTPException(401, { message: 'Невалидный токен.' })

  const userId = payload.id
  const formData = await c.req.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File))
    throw new HTTPException(400, { message: 'Файл аватара не найден.' })

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const paths = generateFilePaths(`avatars/${userId}`, file.name)

    // Для аватаров создаем только один вариант
    const avatarBuffer = await sharp(fileBuffer).resize(200, 200).webp({ quality: 85 }).toBuffer()
    await saveFile(paths.original.diskPath, avatarBuffer)

    const updatedUser = await userRepository.update(userId, { avatarUrl: paths.original.dbPath })

    return c.json(updatedUser)
  }
  catch (error: any) {
    console.error('Ошибка при загрузке аватара:', error)

    if (error instanceof HTTPException) {
      throw error
    }

    return c.json(
      { message: error.message || 'Не удалось загрузить аватар.' },
      500,
    )
  }
}
