import type { ImageMetadata, TripImage } from 'db/schema' // Предполагается, что типы импортируются отсюда
import exifreader from 'exifreader'
import sharp from 'sharp'

// --- Константы ---
const THUMBNAIL_SIZE = 500 // 500px по большей стороне

// --- Типы для внутреннего использования ---
// Описываем только ту часть TripImage, которую мы конструируем в этом сервисе
type ExtractedImageData = Omit<TripImage, 'id' | 'tripId' | 'url' | 'placement' | 'createdAt' | 'thumbnailUrl'>

interface MetadataExtractionResult {
  metadata: ExtractedImageData
  embeddedThumbnailBuffer: Buffer | null
}

// --- Вспомогательные функции ---

/**
 * Преобразует дату из формата EXIF (YYYY:MM:DD HH:MM:SS) в строку ISO 8601.
 * @param exifDate - Строка с датой из EXIF.
 * @returns Строка в формате ISO 8601 или null, если формат неверный.
 */
function parseExifDate(exifDate: string): string | null {
  if (!exifDate || typeof exifDate !== 'string')
    return null
  try {
    // Заменяем первые два ':' на '-', чтобы строка соответствовала формату ISO
    const formattedDate = exifDate.replace(':', '-').replace(':', '-')
    return new Date(formattedDate).toISOString()
  }
  catch (error) {
    console.error('Не удалось распарсить EXIF дату:', exifDate, error)
    return null
  }
}

/**
 * Конвертирует GPS-координаты из формата DMS (градусы, минуты, секунды) в десятичные градусы.
 * @param dms - Массив из трех чисел [градусы, минуты, секунды].
 * @param ref - Направление ('N', 'S', 'E', 'W').
 * @returns Координата в формате десятичных градусов или null.
 */
function convertDmsToDecimal(dms: number[], ref: 'N' | 'S' | 'E' | 'W'): number | null {
  if (!dms || dms.length !== 3 || !ref)
    return null

  const [degrees, minutes, seconds] = dms
  let decimal = degrees + minutes / 60 + seconds / 3600

  if (ref === 'S' || ref === 'W') {
    decimal = -decimal
  }

  return decimal
}

// --- Основные функции сервиса ---

/**
 * Извлекает, структурирует метаданные из буфера изображения и возвращает встроенный thumbnail.
 * @param fileBuffer - Буфер с данными файла изображения.
 * @returns Объект с метаданными и буфером встроенного thumbnail (если есть).
 */
export async function extractAndStructureMetadata(fileBuffer: Buffer): Promise<MetadataExtractionResult> {
  try {
    const tags = exifreader.load(fileBuffer, { thumbnail: true })

    // --- Извлечение ключевых, часто запрашиваемых данных ---
    const takenAt = parseExifDate(tags.DateTimeOriginal?.description)
      ?? parseExifDate(tags.CreateDate?.description)
      ?? parseExifDate(tags.DateTime?.description)

    if (takenAt) {
      console.log(takenAt)
      console.log(`Локальное время снимка: ${new Date(takenAt).toLocaleString('ru-RU')}`)
    }

    const latitude = tags.GPSLatitude && tags.GPSLatitudeRef
      ? convertDmsToDecimal(tags.GPSLatitude.value, tags.GPSLatitudeRef.value[0])
      : null

    const longitude = tags.GPSLongitude && tags.GPSLongitudeRef
      ? convertDmsToDecimal(tags.GPSLongitude.value, tags.GPSLongitudeRef.value[0])
      : null

    const width = tags.ExifImageWidth?.value ?? tags.ImageWidth?.value ?? null
    const height = tags.ExifImageHeight?.value ?? tags.ImageHeight?.value ?? null

    // --- Структурирование всех остальных метаданных в JSONB ---
    const metadata: ImageMetadata = {
      camera: {
        make: tags.Make?.description,
        model: tags.Model?.description,
        lens: tags.LensModel?.description,
      },
      settings: {
        iso: tags.ISOSpeedRatings?.value,
        aperture: tags.FNumber?.value,
        shutterSpeed: tags.ExposureTime?.description,
        focalLength: tags.FocalLength?.value,
        flash: tags.Flash?.description.includes('fired'),
      },
      technical: {
        format: tags.FileType?.description,
        colorSpace: tags.ColorSpace?.description,
        orientation: tags.Orientation?.value,
        fileSize: fileBuffer.length,
      },
      software: {
        software: tags.Software?.description,
        creator: tags.Artist?.description,
        copyright: tags.Copyright?.description,
      },
      // Сохраняем все "сырые" теги на всякий случай
      rawExif: tags,
    }

    // --- Извлечение встроенного thumbnail ---
    const embeddedThumbnailBuffer = tags.Thumbnail?.buffer ? Buffer.from(tags.Thumbnail.buffer) : null

    return {
      metadata: {
        takenAt,
        latitude,
        longitude,
        width,
        height,
        metadata,
      },
      embeddedThumbnailBuffer,
    }
  }
  catch (error) {
    console.error('Ошибка при извлечении метаданных EXIF:', error)
    // Возвращаем пустую структуру, если метаданные извлечь не удалось
    return {
      metadata: {
        metadata: {
          technical: {
            fileSize: fileBuffer.length,
          },
        },
      },
      embeddedThumbnailBuffer: null,
    }
  }
}

/**
 * Генерирует thumbnail из буфера изображения с помощью Sharp.
 * @param fileBuffer - Буфер с данными исходного файла.
 * @returns Promise, который разрешается буфером с thumbnail в формате WebP.
 */
export async function generateThumbnail(fileBuffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(fileBuffer)
      .rotate() // Автоматически поворачивает изображение согласно EXIF-тегу Orientation
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'inside', // Сохраняет пропорции, вписывая в квадрат THUMBNAIL_SIZE x THUMBNAIL_SIZE
        withoutEnlargement: true, // Не увеличивает изображения, которые меньше THUMBNAIL_SIZE
      })
      .webp({ quality: 80 }) // Конвертируем в WebP для лучшего сжатия
      .toBuffer()
  }
  catch (error) {
    console.error('Ошибка при генерации thumbnail с помощью Sharp:', error)
    throw new Error('Не удалось сгенерировать thumbnail.')
  }
}
