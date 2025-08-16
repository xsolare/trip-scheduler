import type { ITripRepository } from '../../model/types'
import type { CreateTripInput, Trip, TripWithDays, UpdateTripInput } from '~/shared/types/models/trip'
import { trpc } from '~/shared/services/trpc/trpc.service'
import { throttle } from '../../lib/decorators'

class TripRepository implements ITripRepository {
  @throttle(500)
  async getAll(): Promise<Trip[]> {
    return await trpc.trip.list.query() as Trip[]
  }

  @throttle(500)
  async getById(id: string): Promise<Trip | null> {
    return await trpc.trip.getById.query({ tripId: id }) as Trip | null
  }

  @throttle(500)
  async getByIdWithDays(tripId: string): Promise<TripWithDays | null> {
    return await trpc.trip.getByIdWithDays.query({ tripId }) as TripWithDays | null
  }

  @throttle(500)
  async create(data: CreateTripInput): Promise<Trip> {
    return await trpc.trip.create.mutate(data) as Trip
  }

  @throttle(500)
  async update(id: string, details: UpdateTripInput): Promise<Trip> {
    return await trpc.trip.update.mutate({ id, details }) as Trip
  }

  @throttle(500)
  async delete(tripId: string): Promise<Trip> {
    return await trpc.trip.delete.mutate({ tripId }) as Trip
  }
}

export { TripRepository }
