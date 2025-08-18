import type { tripImagePlacementEnum } from 'db/schema'

type TripImagePlacement = (typeof tripImagePlacementEnum.enumValues)[number]

export interface TripImage {
  id: string
  tripId: string
  url: string
  placement: TripImagePlacement
  createdAt: string // ISO string

  // --- Ключевые, часто запрашиваемые данные ---
  takenAt?: string | null // ISO string
  latitude?: number | null
  longitude?: number | null

  // --- Основные данные для отображения ---
  width?: number | null
  height?: number | null
  thumbnailUrl?: string | null

  // --- Все остальные метаданные в одном поле JSONB ---
  metadata?: ImageMetadata
}

interface ImageMetadata {
  camera?: {
    make?: string
    model?: string
    lens?: string
  }
  settings?: {
    iso?: number
    aperture?: number
    shutterSpeed?: string
    focalLength?: number
    flash?: boolean
  }
  technical?: {
    format?: string
    colorSpace?: string
    orientation?: number
    fileSize?: number
  }
  software?: {
    software?: string
    creator?: string
    copyright?: string
  }
  rawExif?: Record<string, any>
}
