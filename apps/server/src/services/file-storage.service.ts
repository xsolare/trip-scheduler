import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Генерирует уникальные имена и пути для сохранения изображения и его thumbnail.
 */
export function generateFilePaths(tripId: string, placement: string, originalFileName: string) {
  const fileExtension = originalFileName.split('.').pop() || 'tmp'
  const baseFilename = `${Date.now()}-${crypto.randomUUID()}`

  const filename = `${baseFilename}.${fileExtension}`
  const thumbFilename = `${baseFilename}-thumb.webp`

  const tripUploadDir = join(`${import.meta.env.STATIC_PATH}/${tripId}`, placement)
  const baseURL = import.meta.env.API_URL
  const baseStaticURL = `${baseURL}/${import.meta.env.STATIC_PATH}/${tripId}/${placement}`

  return {
    uploadDir: tripUploadDir,
    fullPath: join(tripUploadDir, filename),
    thumbFullPath: join(tripUploadDir, thumbFilename),
    url: `${baseStaticURL}/${filename}`,
    thumbnailUrl: `${baseStaticURL}/${thumbFilename}`,
  }
}

/**
 * Сохраняет буфер файла на диск, предварительно создав необходимые директории.
 * @param fullPath - Полный путь для сохранения файла.
 * @param fileBuffer - Буфер с данными файла.
 */
export async function saveFile(fullPath: string, fileBuffer: Buffer): Promise<void> {
  const dir = join(fullPath, '..')
  await mkdir(dir, { recursive: true })
  await Bun.write(fullPath, fileBuffer)
}
