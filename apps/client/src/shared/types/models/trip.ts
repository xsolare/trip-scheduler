import type { RouterInput } from '../trpc'

import type { Day } from './activity'

export enum TripImagePlacement {
  ROUTE = 'route',
  MEMORIES = 'memories',
}

export interface TripImage {
  id: string
  url: string
  tripId: string
  placement: TripImagePlacement
  createdAt: string
  updatedAt: string
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

export interface TripImage {
  id: string
  url: string
  tripId: string
  placement: TripImagePlacement
  createdAt: string
  updatedAt: string
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
