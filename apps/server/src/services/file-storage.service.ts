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
  const baseURL = process.env.API_URL

  if (!staticRoot || !baseURL) {
    throw new Error('Переменные окружения STATIC_PATH и API_URL должны быть установлены.')
  }

  const { base, ext } = createUniqueFilename(originalFilename)
  const filename = `${base}${ext}`

  // Стандартизируем формат thumbnail для консистентности
  const thumbFilename = `${base}-thumb.webp`

  // Относительный путь от корня статики
  const relativeDir = join(path)

  // Абсолютные пути в файловой системе для сохранения
  const fullPath = join(staticRoot, relativeDir, filename)
  const thumbFullPath = join(staticRoot, relativeDir, thumbFilename)

  // Публичные URL-адреса, используя URL конструктор для надежности
  const url = new URL(join(staticRoot, relativeDir, filename), baseURL).toString()
  const thumbnailUrl = new URL(join(staticRoot, relativeDir, thumbFilename), baseURL).toString()

  return {
    fullPath, // e.g., /var/www/static/images/trips/trip-uuid/memories/12345.jpg
    thumbFullPath, // e.g., /var/www/static/images/trips/trip-uuid/memories/12345-thumb.webp
    url, // e.g., http://api.example.com/static/images/trips/trip-uuid/memories/12345.jpg
    thumbnailUrl, // e.g., http://api.example.com/static/images/trips/trip-uuid/memories/12345-thumb.webp
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
