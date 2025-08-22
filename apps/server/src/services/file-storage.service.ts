import { mkdir } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'

/**
 * Генерирует уникальное имя файла, сохраняя исходное расширение.
 * @param originalFilename - Исходное имя файла.
 * @returns Объект с базовым именем и расширением.
 */
function createUniqueFilename(originalFilename: string): { base: string, ext: string } {
  const ext = extname(originalFilename)
  const base = `${Date.now()}-${crypto.randomUUID()}`

  return { base, ext }
}

/**
 * Генерирует все необходимые пути и URL для нового изображения.
 * @param path - Место размещения.
 * @param originalFilename - Исходное имя загруженного файла.
 * @returns Объект с путями и URL для основного файла и его thumbnail.
 */
export function generateFilePaths(
  path: string,
  originalFilename: string,
) {
  const staticRoot = process.env.STATIC_PATH

  if (!staticRoot) {
    throw new Error('Переменная окружения STATIC_PATH должна быть установлена.')
  }

  const { base, ext } = createUniqueFilename(originalFilename)
  const filename = `${base}${ext}`
  const thumbFilename = `${base}-thumb.webp`

  // Относительный путь от корня статики (e.g. trips/trip-id/placement)
  const relativeDir = join(path)

  // Путь для сохранения в БД (e.g. trips/trip-id/placement/filename.jpg)
  const dbPath = join(relativeDir, filename)
  const thumbDbPath = join(relativeDir, thumbFilename)

  // Полный путь для записи на диск (e.g. static/images/trips/trip-id/placement/filename.jpg)
  const diskPath = join(staticRoot, dbPath)
  const thumbDiskPath = join(staticRoot, thumbDbPath)

  return {
    diskPath,
    thumbDiskPath,
    dbPath,
    thumbDbPath,
  }
}

/**
 * Сохраняет буфер в файл, создавая директории при необходимости.
 * @param fullPath - Абсолютный путь для сохранения файла.
 * @param fileBuffer - Буфер данных для записи.
 */
export async function saveFile(fullPath: string, fileBuffer: Buffer): Promise<void> {
  const dir = dirname(fullPath)
  await mkdir(dir, { recursive: true })
  await Bun.write(fullPath, fileBuffer)
}
