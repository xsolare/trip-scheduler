import type { z } from 'zod'
import type { CreateTripSchema } from '~/lib/schemas'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { trips } from '~/db/schema'

type NewTrip = typeof trips.$inferInsert

export const tripRepository = {
  async getAll() {
    return db.query.trips.findMany()
  },

  async getById(id: string) {
    return db.query.trips.findFirst({
      where: eq(trips.id, id),
      with: {
        days: {
          with: {
            activities: true,
          },
        },
      },
    })
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
    return db.insert(trips).values(newTrip).returning().get()
  },

  async update(id: string, updates: Partial<NewTrip>) {
    return db.update(trips)
      .set(updates)
      .where(eq(trips.id, id))
      .returning()
      .get()
  },

  async delete(id: string) {
    const result = await db.delete(trips).where(eq(trips.id, id)).returning({ id: trips.id })
    return result.length > 0
  },
}
