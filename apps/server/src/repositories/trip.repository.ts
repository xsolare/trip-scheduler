import type { z } from 'zod'
import type { CreateTripSchema } from '~/lib/schemas'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { trips } from '~/db/schema'

type NewTrip = typeof trips.$inferInsert
type DbTrip = Awaited<ReturnType<typeof db.query.trips.findFirst>>

function transformTrip(trip: DbTrip) {
  if (!trip)
    return null

  return {
    ...trip,
    imageUrl: trip.imageUrl ?? '/images/default-trip.jpg',
    description: trip.description ?? '',
    days: trip.days ?? 0,
    startDate: trip.startDate ?? '',
    endDate: trip.endDate ?? '',
    cities: trip.cities ?? [],
    status: trip.status ?? 'draft',
    budget: trip.budget ?? 0,
    currency: trip.currency ?? 'RUB',
    participants: trip.participants ?? [],
    tags: trip.tags ?? [],
    visibility: trip.visibility ?? 'private',
  }
}

export const tripRepository = {
  async getAll() {
    const dbTrips = await db.query.trips.findMany()
    return dbTrips.map(trip => transformTrip(trip)!)
  },

  async getById(id: string) {
    const dbTrip = await db.query.trips.findFirst({
      where: eq(trips.id, id),
      with: {
        days: {
          with: {
            activities: true,
          },
        },
      },
    })
    return transformTrip(dbTrip)
  },

  async create(tripData: z.infer<typeof CreateTripSchema>) {
    const newTrip: NewTrip = {
      id: crypto.randomUUID(),
      ...tripData,
      imageUrl: '/images/mock-new.jpg',
      days: 0,
      status: 'draft',
      budget: 0,
      currency: 'RUB',
      visibility: 'private',
    }

    const createdTrip = await db.insert(trips).values(newTrip).returning().get()
    return transformTrip(createdTrip)!
  },

  async update(id: string, updates: Partial<NewTrip>) {
    const updatedTrip = await db.update(trips)
      .set(updates)
      .where(eq(trips.id, id))
      .returning()
      .get()

    return transformTrip(updatedTrip)!
  },

  async delete(id: string) {
    const result = await db.delete(trips).where(eq(trips.id, id)).returning({ id: trips.id })

    return result.length > 0
  },
}
