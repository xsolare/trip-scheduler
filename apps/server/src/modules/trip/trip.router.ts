import { router } from '~/lib/trpc'
import { tripProcedures } from './procedures'

export const tripRouter = router(tripProcedures)
