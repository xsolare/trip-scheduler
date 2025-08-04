import { router } from './lib/trpc'
import { dayRouter } from './modules/day/day.router'
import { tripRouter } from './modules/trip/trip.router'

export const appRouter = router({
  trip: tripRouter,
  day: dayRouter,
})

export type AppRouter = typeof appRouter
