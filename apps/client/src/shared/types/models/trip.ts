import type { RouterInput } from '../trpc'

import type { Day } from './activity'

export enum TripImagePlacement {
  ROUTE = 'route',
  MEMORIES = 'memories',
}

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
  metadata?: {
    orientation?: number
    timezoneOffset?: number
    cameraMake?: string
    cameraModel?: string
    fNumber?: number
    exposureTime?: number
    iso?: number
    focalLength?: number
    apertureValue?: number
    // Позволяет хранить любые другие расширенные данные
    [key: string]: any
  } | null
}

export enum TripStatus {
  COMPLETED = 'completed',
  PLANNED = 'planned',
  DRAFT = 'draft',
}

export enum TripVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface Trip {
  id: string
  title: string
  imageUrl: string | null
  description: string | null
  startDate: string
  endDate: string
  cities: string[]
  status: TripStatus
  budget: number | null
  currency: string | null
  participants: string[]
  tags: string[]
  visibility: TripVisibility
  createdAt: string
  updatedAt: string
}

export interface TripWithDays extends Trip {
  days: Day[]
}

export type CreateTripInput = RouterInput['trip']['create']
export type UpdateTripInput = RouterInput['trip']['update']['details']
