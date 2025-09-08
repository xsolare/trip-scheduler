import type { ITripRepository, TripListFilters } from '../../model/types'
import type { Day } from '~/shared/types/models/activity'
import type { CreateTripInput, Trip, TripWithDays, UpdateTripInput } from '~/shared/types/models/trip'
import { v4 as uuidv4 } from 'uuid'
import { TripStatus, TripVisibility } from '~/shared/types/models/trip'
import { throttle } from '../../lib/decorators'
import { MOCK_DAYS, MOCK_TRIPS } from './data/trip.mock'

class TripRepository implements ITripRepository {
  @throttle(400)
  async getUniqueCities(): Promise<string[]> {
    const allCities = MOCK_TRIPS.flatMap(trip => trip.cities || [])
    const uniqueCities = [...new Set(allCities)]
    return Promise.resolve(uniqueCities)
  }

  @throttle(400)
  async getUniqueTags(params: { query?: string }): Promise<string[]> {
    const allTags = MOCK_TRIPS.flatMap(trip => trip.tags || [])
    let uniqueTags = [...new Set(allTags)]

    if (params.query) {
      const queryLower = params.query.toLowerCase()
      uniqueTags = uniqueTags.filter(tag => tag.toLowerCase().includes(queryLower))
    }

    return Promise.resolve(uniqueTags)
  }

  @throttle(500)
  async getAll(filters?: TripListFilters): Promise<Trip[]> {
    if (!filters || Object.values(filters).every(v => v === undefined || v === '' || (Array.isArray(v) && v.length === 0))) {
      return Promise.resolve(MOCK_TRIPS)
    }

    let filtered = [...MOCK_TRIPS]

    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(query)
        || trip.description?.toLowerCase().includes(query),
      )
    }
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(trip => filters.statuses!.includes(trip.status))
    }
    if (filters.cities && filters.cities.length > 0) {
      filtered = filtered.filter(trip => trip.cities.some(city => filters.cities!.includes(city)))
    }
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(trip => trip.tags?.some(tag => filters.tags!.includes(tag)))
    }
    if (filters.userIds && filters.userIds.length > 0) {
      filtered = filtered.filter(trip => trip.participants.some(p => filters.userIds!.includes(p.id)))
    }

    return Promise.resolve(filtered)
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
      sections: [],
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

    MOCK_TRIPS[tripIndex] = {
      ...MOCK_TRIPS[tripIndex],
      ...details,
      updatedAt: new Date().toISOString(),
    }

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
