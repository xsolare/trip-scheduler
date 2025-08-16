import type { Context } from 'hono'
import type { ImageMetadata } from '~/repositories/image.repository'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import exifr from 'exifr'
import { HTTPException } from 'hono/http-exception'
import sharp from 'sharp'
import { imageRepository } from '~/repositories/image.repository'
import { tripImagePlacementEnum } from '../../db/schema'

export async function uploadFileController(c: Context) {
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
    throw new HTTPException(400, { message: 'Необходимо указать корректный тип размещения (placement): "route" или "memories".' })
  }

  const fileBuffer = await file.arrayBuffer()
  const fileExtension = file.name.split('.').pop()
  const baseFilename = `${Date.now()}-${crypto.randomUUID()}`
  const filename = `${baseFilename}.${fileExtension}`
  const tripUploadDir = join(`${import.meta.env.STATIC_PATH}/${tripId}`, placement)
  const fullPath = join(tripUploadDir, filename)
  const baseURL = import.meta.env.API_URL

  const finalMetadata: ImageMetadata = {
    gps: null,
    takenAt: null,
    width: null,
    height: null,
    orientation: null,
    thumbnailUrl: null,
    metadata: {
      cameraMake: null,
      cameraModel: null,
      fNumber: null,
      exposureTime: null,
      iso: null,
      focalLength: null,
      apertureValue: null,
    },
    extendedMetadata: null,
  }

  try {
    const exifrOptions = {
      xmp: true,
      icc: true,
      iptc: true,
      exif: true,
      gps: true,
      interop: true,
      translateValues: false,
      reviveValues: true,
    }

    const [exifrData, rotationData, thumbnailBuffer] = await Promise.all([
      exifr.parse(fileBuffer, exifrOptions),
      exifr.rotation(fileBuffer),
      exifr.thumbnail(fileBuffer),
    ])

    if (exifrData) {
      finalMetadata.takenAt = exifrData.DateTimeOriginal || exifrData.CreateDate || null
      if (exifrData.latitude && exifrData.longitude) {
        finalMetadata.gps = { latitude: exifrData.latitude, longitude: exifrData.longitude }
      }

      const rawWidth = exifrData.ImageWidth || exifrData.width || exifrData.ExifImageWidth
      const rawHeight = exifrData.ImageHeight || exifrData.height || exifrData.ExifImageHeight

      if (rawWidth && rawHeight) {
        if (rotationData?.dimensionSwapped) {
          finalMetadata.width = rawHeight
          finalMetadata.height = rawWidth
        }
        else {
          finalMetadata.width = rawWidth
          finalMetadata.height = rawHeight
        }
      }

      finalMetadata.orientation = exifrData.Orientation || 1

      // --- Переносим основные поля в `metadata` ---
      if (finalMetadata.metadata) {
        finalMetadata.metadata.cameraMake = exifrData.Make || null
        finalMetadata.metadata.cameraModel = exifrData.Model || null
        finalMetadata.metadata.fNumber = exifrData.FNumber || null
        finalMetadata.metadata.exposureTime = exifrData.ExposureTime || null
        finalMetadata.metadata.iso = exifrData.ISO || null
        finalMetadata.metadata.focalLength = exifrData.FocalLength || null
        finalMetadata.metadata.apertureValue = exifrData.ApertureValue || null
      }

      // --- Фильтруем и собираем `extendedMetadata` ---
      const fieldsToExclude = new Set([
        'RedTRC',
        'Cameras',
        'Profiles',
        'BlueTRC',
        'GreenTRC',
        'Directory',
        'ModifyDate',
        'OffsetTime',
        'GPSDateStamp',
        'GPSTimeStamp',
        'HasExtendedXMP',
        'MediaBlackPoint',
        'MediaWhitePoint',
        'ProfileDateTime',
        'RedMatrixColumn',
        'RenderingIntent',
        'BlueMatrixColumn',
        'HdrPlusMakernote',
        'GreenMatrixColumn',
        'OffsetTimeOriginal',
        'ChromaticAdaptation',
        'GPSProcessingMethod',
        'OffsetTimeDigitized',
        'ComponentsConfiguration',
      ])

      const primaryKeys = new Set([
        // Ключи, уже обработанные выше
        'DateTimeOriginal',
        'CreateDate',
        'latitude',
        'longitude',
        'ImageWidth',
        'width',
        'ExifImageWidth',
        'ImageHeight',
        'height',
        'ExifImageHeight',
        'Orientation',
        // Ключи, перенесенные в `finalMetadata.metadata`
        'Make',
        'Model',
        'FNumber',
        'ExposureTime',
        'ISO',
        'FocalLength',
        'ApertureValue',

        // Системные/вложенные объекты exifr
        'thumbnail',
        'gps',
        'iptc',
        'xmp',
        'icc',
        'makerNote',
        'ifd0',
        'ifd1',
        'exif',
      ])

      const extendedMeta: Record<string, any> = {}
      for (const key in exifrData) {
        if (
          Object.prototype.hasOwnProperty.call(exifrData, key)
          && !primaryKeys.has(key)
          && !fieldsToExclude.has(key)
        ) {
          const value = exifrData[key]
          // eslint-disable-next-line node/prefer-global/buffer
          if (!(value instanceof Buffer)) {
            extendedMeta[key] = value
          }
        }
      }
      finalMetadata.extendedMetadata = extendedMeta
    }

    if (thumbnailBuffer) {
      const thumbFilename = `${baseFilename}-thumb.jpg`
      const thumbFullPath = join(tripUploadDir, thumbFilename)
      await mkdir(tripUploadDir, { recursive: true })
      await Bun.write(thumbFullPath, thumbnailBuffer)
      finalMetadata.thumbnailUrl = `${baseURL}/${import.meta.env.STATIC_PATH}/${tripId}/${placement}/${thumbFilename}`
    }
  }
  catch (err) {
    console.warn('Не удалось прочитать все метаданные:', (err as Error).message)
  }

  // Если thumbnailUrl все еще null, генерируем его с помощью sharp
  if (!finalMetadata.thumbnailUrl) {
    try {
      const thumbFilename = `${baseFilename}-thumb.webp`
      const thumbFullPath = join(tripUploadDir, thumbFilename)
      await mkdir(tripUploadDir, { recursive: true })

      // eslint-disable-next-line node/prefer-global/buffer
      await sharp(Buffer.from(fileBuffer))
        .resize(200, 200, {
          fit: 'cover',
          position: 'entropy',
        })
        .webp({ quality: 75 })
        .toFile(thumbFullPath)

      finalMetadata.thumbnailUrl = `${baseURL}/${import.meta.env.STATIC_PATH}/${tripId}/${placement}/${thumbFilename}`
    }
    catch (sharpError) {
      console.error('Ошибка при генерации thumbnail с помощью sharp:', sharpError)
    }
  }

  try {
    await mkdir(tripUploadDir, { recursive: true })
    await Bun.write(fullPath, fileBuffer)

    const url = `${baseURL}/${import.meta.env.STATIC_PATH}/${tripId}/${placement}/${filename}`
    const newImageRecord = await imageRepository.create(tripId, url, placement, finalMetadata)

    return c.json(newImageRecord)
  }
  catch (error) {
    console.error('Ошибка при сохранении файла или записи в БД:', error)
    throw new HTTPException(500, { message: 'Не удалось сохранить файл.' })
  }
}
