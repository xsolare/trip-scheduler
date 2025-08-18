import type { TripImage } from '~/models/image'
import exifr from 'exifr'
import sharp from 'sharp'

type ExtractedImageData = Omit<TripImage, 'id' | 'tripId' | 'url' | 'placement' | 'createdAt'>

interface Params {
  metadata: Partial<ExtractedImageData>
  embeddedThumbnailBuffer: Buffer | null
}

function parseTimezoneOffset(offsetString: string | undefined): number | undefined {
  if (!offsetString) {
    return undefined
  }
  if (offsetString.toUpperCase() === 'Z') {
    return 0
  }
  const matches = offsetString.match(/([+-])(\d{2}):(\d{2})/)
  if (!matches) {
    return undefined
  }
  const sign = matches[1] === '-' ? -1 : 1
  const hours = Number.parseInt(matches[2], 10)
  const minutes = Number.parseInt(matches[3], 10)
  return sign * (hours * 60 + minutes)
}

export async function generateThumbnail(fileBuffer: Buffer): Promise<Buffer> {
  return sharp(fileBuffer)
    .resize(400, 400, {
      fit: 'cover',
      position: 'entropy',
    })
    .webp({ quality: 80 })
    .toBuffer()
}

export async function extractAndStructureMetadata(fileBuffer: Buffer): Promise<Params> {
  try {
    const exifrOptions = {
      exif: true,
      gps: true,
      iptc: true,
      xmp: true,
      icc: true,
      interop: true,
      reviveValues: true,
      translateValues: false,
    }

    const [exifData, embeddedThumbnailBuffer] = await Promise.all([
      exifr.parse(fileBuffer, exifrOptions),
      exifr.thumbnail(fileBuffer).catch(() => null),
    ])

    if (!exifData) {
      console.warn('Не удалось извлечь EXIF данные из файла.')
      return { metadata: {}, embeddedThumbnailBuffer: null }
    }

    const sharpMeta = await sharp(fileBuffer).metadata()
    const structuredMeta: Partial<ExtractedImageData> = {}

    const takenAtDate = exifData.DateTimeOriginal || exifData.CreateDate
    const offset = exifData.OffsetTimeOriginal ?? exifData.OffsetTime ?? exifData.OffsetTimeDigitized

    if (takenAtDate instanceof Date) {
      const offsetMinutes = parseTimezoneOffset(offset)
      if (offsetMinutes !== undefined) {
        const originalTime = takenAtDate.getTime()
        const timezoneOffset = takenAtDate.getTimezoneOffset()
        const adjustedTime = originalTime - (offsetMinutes + timezoneOffset) * 60 * 1000
        structuredMeta.takenAt = new Date(adjustedTime)
      }
      else {
        structuredMeta.takenAt = takenAtDate
      }
    }

    if (exifData.latitude && exifData.longitude) {
      structuredMeta.latitude = exifData.latitude
      structuredMeta.longitude = exifData.longitude
    }

    structuredMeta.width = sharpMeta.width
    structuredMeta.height = sharpMeta.height

    structuredMeta.metadata = {
      timezoneOffset: parseTimezoneOffset(offset),
      camera: {
        make: exifData.Make,
        model: exifData.Model,
        lens: exifData.LensModel,
        serialNumber: exifData.BodySerialNumber,
      },
      settings: {
        iso: exifData.ISO,
        aperture: exifData.FNumber,
        apertureValue: exifData.ApertureValue,
        shutterSpeed: exifData.ExposureTime ? `1/${Math.round(1 / exifData.ExposureTime)}s` : undefined,
        exposureTime: exifData.ExposureTime,
        focalLength: exifData.FocalLength,
        focalLengthIn35mmFormat: exifData.FocalLengthIn35mmFilm,
        exposureMode: exifData.ExposureMode,
        whiteBalance: exifData.WhiteBalance,
        meteringMode: exifData.MeteringMode,
        flash: exifData.Flash,
      },
      gps: {
        altitude: exifData.GPSAltitude,
        speed: exifData.GPSSpeed,
        bearing: exifData.GPSImgDirection,
        destBearing: exifData.GPSDestBearing,
        gpsDate: exifData.GPSDateStamp && exifData.GPSTimeStamp ? `${exifData.GPSDateStamp} ${exifData.GPSTimeStamp}` : undefined,
      },
      technical: {
        format: sharpMeta.format,
        colorSpace: exifData.ColorSpace,
        orientation: exifData.Orientation,
        fileSize: fileBuffer.length,
        resolutionX: exifData.XResolution,
        resolutionY: exifData.YResolution,
        resolutionUnit: exifData.ResolutionUnit,
      },
      software: {
        software: exifData.Software,
        creator: exifData.CreatorTool,
        copyright: exifData.Copyright,
        modifyDate: exifData.ModifyDate,
      },
      iptc: {
        headline: exifData.Headline,
        caption: exifData.Caption,
        keywords: exifData.Keywords,
        city: exifData.City,
        country: exifData.Country,
      },
    }

    return {
      metadata: structuredMeta,
      embeddedThumbnailBuffer: (embeddedThumbnailBuffer as Buffer) ?? null,
    }
  }
  catch (error) {
    console.warn('Не удалось извлечь метаданные из изображения:', error)

    const sharpMeta = await sharp(fileBuffer).metadata().catch(() => null)
    if (sharpMeta) {
      return {
        metadata: {
          width: sharpMeta.width,
          height: sharpMeta.height,
          metadata: {
            technical: {
              format: sharpMeta.format,
              fileSize: fileBuffer.length,
            },
          },
        },
        embeddedThumbnailBuffer: null,
      }
    }

    return {
      metadata: {},
      embeddedThumbnailBuffer: null,
    }
  }
}
