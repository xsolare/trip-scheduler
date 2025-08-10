import type { Activity, Day } from '~/shared/types/models/activity'
import type { Memory } from '~/shared/types/models/memory'
import { ActivityTag } from '~/shared/types/models/activity'

export type ActiveView = 'plan' | 'memories'
export type IMemory = Memory
export type IActivity = Activity
export type IDay = Day
export { ActivityTag as EActivityTag }
