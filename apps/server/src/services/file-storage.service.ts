import { mkdir } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'

/**
 * Генерирует уникальное имя файла, сохраняя исходное расширение.
 */
function createUniqueFilename(originalFilename: string): { base: string, ext: string } {
  const ext = extname(originalFilename)
  const base = `${Date.now()}-${crypto.randomUUID()}`

  return { base, ext }
}

/**
 * Генерирует пути для нового изображения и его вариантов.
 * @param relativeDirPath - Относительный путь для сохранения (e.g., 'trips/trip-id/memories').
 * @param originalFilename - Исходное имя загруженного файла.
 * @returns Объект с путями.
 */
export function generateFilePaths(
  relativeDirPath: string,
  originalFilename: string,
) {
  const staticRoot = process.env.STATIC_PATH
  if (!staticRoot) {
    throw new Error('Переменная окружения STATIC_PATH должна быть установлена.')
  }

  const { base, ext } = createUniqueFilename(originalFilename)
  const filename = `${base}${ext}`

  // Пути для оригинала
  const original = {
    dbPath: join(relativeDirPath, filename),
    diskPath: join(staticRoot, relativeDirPath, filename),
  }

  /**
   * Генерирует пути для конкретного варианта.
   * @param variantName - Название варианта (e.g., 'small').
   */
  const getVariantPaths = (variantName: string) => {
    const variantFilename = `${base}-${variantName}.webp`
    return {
      dbPath: join(relativeDirPath, variantFilename),
      diskPath: join(staticRoot, relativeDirPath, variantFilename),
    }
  }

  return {
    original,
    getVariantPaths,
  }
}

/**
 * Сохраняет буфер в файл, создавая директории при необходимости.
 */
export async function saveFile(fullPath: string, fileBuffer: Buffer): Promise<void> {
  const dir = dirname(fullPath)
  await mkdir(dir, { recursive: true })
  await Bun.write(fullPath, fileBuffer)
}
