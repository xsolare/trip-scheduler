import type { ITripRepository } from '../../model/types'
import type { Day } from '~/shared/types/models/activity'
import type { CreateTripInput, Trip, TripWithDays, UpdateTripInput } from '~/shared/types/models/trip'
import { v4 as uuidv4 } from 'uuid'
import { TripStatus, TripVisibility } from '~/shared/types/models/trip'
import { throttle } from '../../lib/decorators'
import { MOCK_DAYS, MOCK_TRIPS } from './data/trip.mock'

class TripRepository implements ITripRepository {
  @throttle(500)
  async getAll(): Promise<Trip[]> {
    return Promise.resolve(MOCK_TRIPS)
  }

  @throttle(300)
  async getById(id: string): Promise<Trip | null> {
    const trip = MOCK_TRIPS.find(t => t.id === id) || null
    return Promise.resolve(trip)
  }

  @throttle(400)
  async getByIdWithDays(id: string): Promise<TripWithDays | null> {
    const trip = MOCK_TRIPS.find(t => t.id === id)
    if (!trip)
      return Promise.resolve(null)

    const filteredDays = MOCK_DAYS.filter(d => d.tripId === id)

    const completeDays: Day[] = filteredDays.map(day => ({
      ...day,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: day.activities || [],
    }))

    return Promise.resolve({ ...trip, days: completeDays }) as unknown as TripWithDays
  }

  @throttle(800)
  async create(data: CreateTripInput): Promise<Trip> {
    const now = new Date().toISOString()
    const newTrip: Trip = {
      id: uuidv4(),
      title: data.title,
      description: data.description || `Mock description for ${data.title}`,
      imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(data.title)}`,
      startDate: (data.startDate || now).toString(),
      endDate: (data.endDate || now).toString(),
      cities: [],
      status: TripStatus.PLANNED,
      budget: null,
      currency: 'RUB',
      participants: [],
      tags: [],
      visibility: TripVisibility.PRIVATE,
      createdAt: now,
      updatedAt: now,
    }

    MOCK_TRIPS.unshift(newTrip)

    // eslint-disable-next-line no-console
    console.log('[Mock] Created new trip:', newTrip)
    return Promise.resolve(newTrip)
  }

  @throttle(500)
  async update(id: string, details: UpdateTripInput): Promise<Trip> {
    const tripIndex = MOCK_TRIPS.findIndex(t => t.id === id)
    if (tripIndex === -1) {
      return Promise.reject(new Error('Mock Trip not found'))
    }

    MOCK_TRIPS[tripIndex] = { ...MOCK_TRIPS[tripIndex], ...details, updatedAt: new Date().toISOString() }

    // eslint-disable-next-line no-console
    console.log('[Mock] Updated trip:', MOCK_TRIPS[tripIndex])
    return Promise.resolve(MOCK_TRIPS[tripIndex])
  }

  @throttle(600)
  async delete(id: string): Promise<Trip> {
    const tripIndex = MOCK_TRIPS.findIndex(t => t.id === id)
    if (tripIndex === -1) {
      return Promise.reject(new Error('Mock Trip not found'))
    }

    const [deletedTrip] = MOCK_TRIPS.splice(tripIndex, 1)
    // eslint-disable-next-line no-console
    console.log('[Mock] Deleted trip:', deletedTrip)
    return Promise.resolve(deletedTrip)
  }
}

export { TripRepository }
