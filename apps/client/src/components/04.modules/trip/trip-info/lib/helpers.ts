import type { IActivity } from '../models/types'
import { EActivityTag } from '../models/types'

/**
 * Преобразует UTC дату в локальную дату, используя смещение в минутах.
 * @param utcDate - Дата в формате UTC (объект Date или строка).
 * @param offsetMinutes - Смещение часового пояса в минутах.
 * @returns Объект Date, представляющий локальное время.
 */
export function getLocalDate(utcDate: Date | string, offsetMinutes: number): Date {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate

  // Получаем время в миллисекундах и прибавляем смещение (в миллисекундах)
  const localTime = date.getTime() + offsetMinutes * 60 * 1000

  return new Date(localTime)
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function getActivityDuration(activity: IActivity): number {
  return timeToMinutes(activity.endTime) - timeToMinutes(activity.startTime)
}

export const activityTagIcons: Record<EActivityTag, string> = {
  [EActivityTag.TRANSPORT]: 'mdi-car',
  [EActivityTag.WALK]: 'mdi-walk',
  [EActivityTag.FOOD]: 'mdi-food',
  [EActivityTag.ATTRACTION]: 'mdi-camera',
  [EActivityTag.RELAX]: 'mdi-bed',
}

export const activityTagColors: Record<EActivityTag, string> = {
  [EActivityTag.TRANSPORT]: '#e3f2fd',
  [EActivityTag.WALK]: '#e8f5e9',
  [EActivityTag.FOOD]: '#fff8e1',
  [EActivityTag.ATTRACTION]: '#f3e5f5',
  [EActivityTag.RELAX]: '#e0f2f1',
}
