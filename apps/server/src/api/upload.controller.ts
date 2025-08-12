import type { Context } from 'hono'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { HTTPException } from 'hono/http-exception'
import { imageRepository } from '~/repositories/image.repository'
import { memoryRepository } from '~/repositories/memory.repository'
import { tripImagePlacementEnum } from '../../db/schema'

export async function uploadFileController(c: Context) {
  const formData = await c.req.formData()
  const file = formData.get('file')
  const tripId = formData.get('tripId')
  const placement = formData.get('placement') as 'route' | 'memories'
  const timestampStr = formData.get('timestamp') as string | null
  const comment = formData.get('comment') as string | null

  if (!file || !(file instanceof File)) {
    throw new HTTPException(400, { message: 'Файл не найден в запросе.' })
  }
  if (!tripId || typeof tripId !== 'string') {
    throw new HTTPException(400, { message: 'Необходимо указать ID путешествия (tripId).' })
  }
  if (!placement || !tripImagePlacementEnum.enumValues.includes(placement)) {
    throw new HTTPException(400, { message: 'Необходимо указать корректный тип размещения (placement): "route" или "memories".' })
  }

  const fileExtension = file.name.split('.').pop()
  const filename = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`

  const tripUploadDir = join(`${import.meta.env.STATIC_PATH}/${tripId}`, placement)
  const fullPath = join(tripUploadDir, filename)

  try {
    await mkdir(tripUploadDir, { recursive: true })
    await Bun.write(fullPath, await file.arrayBuffer())

    const baseURL = import.meta.env.API_URL
    const url = `${baseURL}/${import.meta.env.STATIC_PATH}/${tripId}/${placement}/${filename}`

    const newImageRecord = await imageRepository.create(tripId, url, placement)

    if (placement === 'memories') {
      await memoryRepository.create({
        tripId,
        imageId: newImageRecord.id,
        timestamp: timestampStr || null,
        comment: comment || null,
      })
    }

    return c.json(newImageRecord)
  }
  catch (error) {
    console.error('Ошибка при сохранении файла:', error)
    throw new HTTPException(500, { message: 'Не удалось сохранить файл.' })
  }
}
