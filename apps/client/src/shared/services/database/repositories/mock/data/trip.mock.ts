import type { Day } from '~/shared/types/models/activity'
import type { Trip } from '~/shared/types/models/trip'

import { MOCK_CHINA_DAYS } from './china/days'
import { MOCK_CHINA_TRIP } from './china/trip'

export const MOCK_TRIPS: Trip[] = [
  MOCK_CHINA_TRIP,
]

export const MOCK_DAYS: Day[] = [
  ...MOCK_CHINA_DAYS,
]
