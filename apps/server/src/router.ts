import { router } from './lib/trpc'
import { activityRouter } from './modules/activity/activity.router'
import { dayRouter } from './modules/day/day.router'
import { imageRouter } from './modules/image/image.router'
import { memoryRouter } from './modules/memory/memory.router'
import { tripRouter } from './modules/trip/trip.router'

export const appRouter = router({
  trip: tripRouter,
  day: dayRouter,
  activity: activityRouter,
  image: imageRouter,
  memory: memoryRouter,
})

export type AppRouter = typeof appRouter
