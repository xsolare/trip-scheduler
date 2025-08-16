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

  latitude: number | null
  longitude: number | null
  takenAt: string | null // ISO string or null

  width: number | null
  height: number | null
  orientation: number | null
  thumbnailUrl: string | null

  cameraMake: string | null
  cameraModel: string | null
  fNumber: number | null
  exposureTime: number | null
  iso: number | null
  focalLength: number | null
  apertureValue: number | null

  extendedMetadata: Record<string, any> | null
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
