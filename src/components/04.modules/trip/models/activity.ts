export enum ActivityType {
  TRANSPORT = 'transport',
  WALK = 'walk',
  FOOD = 'food',
  ATTRACTION = 'attraction',
  RELAX = 'relax',
}

export interface ActivityBlock {
  id: string
  description: string
  type?: ActivityType
  startTime?: string // Относительное время начала в рамках активности
  images?: string[]
  endTime?: string // Формат "HH:mm"
}

export interface Activity {
  id: string
  // Поле `day` удалено. Принадлежность к дню определяется нахождением в массиве Day.activities
  startTime: string // Формат "HH:mm"
  endTime: string // Формат "HH:mm"
  description: string
  blocks?: ActivityBlock[]
}

// Новый интерфейс для Дня
export interface Day {
  id: string
  date: string // Используем для сортировки и идентификации, например '2025-08-01'
  title: string
  description?: string
  activities: Activity[]
}

// Вспомогательные функции (без изменений)
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function getActivityDuration(activity: Activity): number {
  return timeToMinutes(activity.endTime) - timeToMinutes(activity.startTime)
}

// Словари иконок и цветов (без изменений)
export const activityTypeIcons: Record<ActivityType, string> = {
  [ActivityType.TRANSPORT]: 'mdi-car',
  [ActivityType.WALK]: 'mdi-walk',
  [ActivityType.FOOD]: 'mdi-food',
  [ActivityType.ATTRACTION]: 'mdi-camera',
  [ActivityType.RELAX]: 'mdi-bed',
}

export const activityTypeColors: Record<ActivityType, string> = {
  [ActivityType.TRANSPORT]: '#e3f2fd',
  [ActivityType.WALK]: '#e8f5e9',
  [ActivityType.FOOD]: '#fff8e1',
  [ActivityType.ATTRACTION]: '#f3e5f5',
  [ActivityType.RELAX]: '#e0f2f1',
}
