import type { Day } from '~/shared/types/models/activity'
import type { Trip } from '~/shared/types/models/trip'
import { createTrip } from './_factory'

import { MOCK_CHINA_DAYS } from './china/days'
import { MOCK_CHINA_TRIP } from './china/trip'

import { MOCK_JAPAN_DAYS } from './japan/days'
import { MOCK_JAPAN_TRIP } from './japan/trip'

export const MOCK_TRIPS: Trip[] = [
  createTrip(MOCK_JAPAN_TRIP, MOCK_JAPAN_DAYS),
  createTrip(MOCK_CHINA_TRIP, MOCK_CHINA_DAYS),
]

export const MOCK_DAYS: Day[] = [
  ...MOCK_JAPAN_DAYS,
  ...MOCK_CHINA_DAYS,
]
