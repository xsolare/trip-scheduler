import type { Context } from 'hono'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { HTTPException } from 'hono/http-exception'

export async function uploadFileHandler(c: Context) {
  const formData = await c.req.formData()
  const file = formData.get('file')
  const tripId = formData.get('tripId')
  const section = formData.get('section')

  if (!file || !(file instanceof File)) {
    throw new HTTPException(400, { message: 'Файл не найден в запросе.' })
  }
  if (!tripId || typeof tripId !== 'string') {
    throw new HTTPException(400, { message: 'Необходимо указать ID путешествия (tripId).' })
  }

  const fileExtension = file.name.split('.').pop()
  const filename = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`

  const tripUploadDir = join(`${import.meta.env.STATIC_PATH}/${section}`, tripId)
  const fullPath = join(tripUploadDir, filename)

  try {
    await mkdir(tripUploadDir, { recursive: true })

    await Bun.write(fullPath, await file.arrayBuffer())

    const baseURL = import.meta.env.API_URL
    const url = `${baseURL}${import.meta.env.STATIC_PATH}/${section}/${tripId}/${filename}`

    return c.json({ success: true, url })
  }
  catch (error) {
    console.error('Ошибка при сохранении файла:', error)
    throw new HTTPException(500, { message: 'Не удалось сохранить файл.' })
  }
}
