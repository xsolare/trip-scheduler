export enum ActivityTag {
  TRANSPORT = 'transport',
  WALK = 'walk',
  FOOD = 'food',
  ATTRACTION = 'attraction',
  RELAX = 'relax',
}

export interface ActivitySection {
  id: string
  //
  tag?: ActivityTag
  startTime?: string
  endTime?: string
}

export interface ActivitySectionText extends ActivitySection {
  text: string
}

type ActivitySections = (ActivitySection)[]

export interface Activity {
  id: string
  title: string
  startTime: string
  endTime: string
  //
  sections?: ActivitySections
  tag?: ActivityTag

}

export interface Day {
  id: string
  date: string
  title: string
  description?: string
  activities: Activity[]
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

export function getActivityDuration(activity: Activity): number {
  return timeToMinutes(activity.endTime) - timeToMinutes(activity.startTime)
}

export const activityTagIcons: Record<ActivityTag, string> = {
  [ActivityTag.TRANSPORT]: 'mdi-car',
  [ActivityTag.WALK]: 'mdi-walk',
  [ActivityTag.FOOD]: 'mdi-food',
  [ActivityTag.ATTRACTION]: 'mdi-camera',
  [ActivityTag.RELAX]: 'mdi-bed',
}

export const activityTagColors: Record<ActivityTag, string> = {
  [ActivityTag.TRANSPORT]: '#e3f2fd',
  [ActivityTag.WALK]: '#e8f5e9',
  [ActivityTag.FOOD]: '#fff8e1',
  [ActivityTag.ATTRACTION]: '#f3e5f5',
  [ActivityTag.RELAX]: '#e0f2f1',
}
