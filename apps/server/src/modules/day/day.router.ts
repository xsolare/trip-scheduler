import { router } from '~/lib/trpc'
import { dayProcedures } from './procedures'

export const dayRouter = router(dayProcedures)
