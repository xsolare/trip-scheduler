import { router } from './lib/trpc'
import { activityRouter } from './modules/activity/activity.router'
import { dayRouter } from './modules/day/day.router'
import { imageRouter } from './modules/image/image.router'
import { tripRouter } from './modules/trip/trip.router'

export const appRouter = router({
  trip: tripRouter,
  day: dayRouter,
  activity: activityRouter,
  image: imageRouter,
})

export type AppRouter = typeof appRouter
