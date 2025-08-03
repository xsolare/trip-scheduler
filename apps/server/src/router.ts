import z from 'zod'
import { TripSchema } from './lib/schemas'
import { mergeRouters, publicProcedure, router, t } from './lib/trpc'
import { tripRepository } from './mock/trip.repository'
import { dayRouter } from './modules/day/day.router'
import { tripRouter } from './modules/trip/trip.router'

export const appRouter = router({
  trip: tripRouter,
})

export type AppRouter = typeof appRouter
