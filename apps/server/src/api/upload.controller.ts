import type { Context } from 'hono'
import type { ImageMetadata } from '~/repositories/image.repository'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import exifr from 'exifr'
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

  const fileBuffer = await file.arrayBuffer()
  const fileExtension = file.name.split('.').pop()
  const baseFilename = `${Date.now()}-${crypto.randomUUID()}`
  const filename = `${baseFilename}.${fileExtension}`
  const tripUploadDir = join(`${import.meta.env.STATIC_PATH}/${tripId}`, placement)
  const fullPath = join(tripUploadDir, filename)
  const baseURL = import.meta.env.API_URL

  const metadata: ImageMetadata = {
    gps: null,
    takenAt: null,
    width: null,
    height: null,
    orientation: null,
    cameraMake: null,
    cameraModel: null,
    thumbnailUrl: null,
    fNumber: null,
    exposureTime: null,
    iso: null,
    focalLength: null,
    apertureValue: null,
    otherMetadata: null,
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
      metadata.takenAt = exifrData.DateTimeOriginal || exifrData.CreateDate || null
      if (exifrData.latitude && exifrData.longitude) {
        metadata.gps = { latitude: exifrData.latitude, longitude: exifrData.longitude }
      }

      const rawWidth = exifrData.ImageWidth || exifrData.width || exifrData.ExifImageWidth
      const rawHeight = exifrData.ImageHeight || exifrData.height || exifrData.ExifImageHeight

      if (rawWidth && rawHeight) {
        if (rotationData?.dimensionSwapped) {
          metadata.width = rawHeight
          metadata.height = rawWidth
        }
        else {
          metadata.width = rawWidth
          metadata.height = rawHeight
        }
      }

      metadata.orientation = exifrData.Orientation || 1
      metadata.cameraMake = exifrData.Make || null
      metadata.cameraModel = exifrData.Model || null
      metadata.fNumber = exifrData.FNumber || null
      metadata.exposureTime = exifrData.ExposureTime || null
      metadata.iso = exifrData.ISO || null
      metadata.focalLength = exifrData.FocalLength || null
      metadata.apertureValue = exifrData.ApertureValue || null

      const primaryKeys = new Set([
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
        'Make',
        'Model',
        'FNumber',
        'ExposureTime',
        'ISO',
        'FocalLength',
        'ApertureValue',
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

      const otherMeta: Record<string, any> = {}
      for (const key in exifrData) {
        if (!primaryKeys.has(key) && Object.prototype.hasOwnProperty.call(exifrData, key)) {
          const value = exifrData[key]
          // eslint-disable-next-line node/prefer-global/buffer
          if (!(value instanceof Buffer)) {
            otherMeta[key] = value
          }
        }
      }
      metadata.otherMetadata = otherMeta
    }

    if (thumbnailBuffer) {
      const thumbFilename = `${baseFilename}-thumb.jpg`
      const thumbFullPath = join(tripUploadDir, thumbFilename)
      await mkdir(tripUploadDir, { recursive: true })
      await Bun.write(thumbFullPath, thumbnailBuffer)
      metadata.thumbnailUrl = `${baseURL}/${import.meta.env.STATIC_PATH}/${tripId}/${placement}/${thumbFilename}`
    }
  }
  catch (err) {
    console.warn('Не удалось прочитать все метаданные:', (err as Error).message)
  }

  try {
    await mkdir(tripUploadDir, { recursive: true })
    await Bun.write(fullPath, fileBuffer)

    const url = `${baseURL}/${import.meta.env.STATIC_PATH}/${tripId}/${placement}/${filename}`
    const newImageRecord = await imageRepository.create(tripId, url, placement, metadata)

    if (placement === 'memories') {
      await memoryRepository.create({
        tripId,
        imageId: newImageRecord.id,
        timestamp: metadata.takenAt?.toISOString() ?? timestampStr,
        comment: comment || null,
      })
    }

    return c.json(newImageRecord)
  }
  catch (error) {
    console.error('Ошибка при сохранении файла или записи в БД:', error)
    throw new HTTPException(500, { message: 'Не удалось сохранить файл.' })
  }
}
