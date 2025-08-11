import type {
  Activity,
  ActivitySectionGallery,
  ActivitySections,
  ActivitySectionText,
  Day,
} from '~/shared/types/models/activity'
import type { Trip } from '~/shared/types/models/trip'
import { v4 as uuidv4 } from 'uuid'
import { EActivitySectionType } from '~/shared/types/models/activity'

type ActivityInput = Omit<Activity, 'id' | 'dayId'>

type CreatableSection = ActivitySectionText | ActivitySectionGallery

export function createSection(type: EActivitySectionType.DESCRIPTION, content: string): ActivitySectionText
export function createSection(type: EActivitySectionType.GALLERY, content: string[]): ActivitySectionGallery
export function createSection(type: EActivitySectionType.DESCRIPTION | EActivitySectionType.GALLERY, content: string | string[]): CreatableSection {
  const baseSection = { id: uuidv4() }

  if (type === EActivitySectionType.DESCRIPTION) {
    return {
      ...baseSection,
      type: EActivitySectionType.DESCRIPTION,
      text: content as string,
    }
  }
  return {
    ...baseSection,
    type: EActivitySectionType.GALLERY,
    imageUrls: content as string[],
    isAttached: true,
  }
}

export function createActivity(time: string, title: string, sections: ActivitySections): ActivityInput {
  const [startTime, endTime] = time.split('-')
  return {
    startTime,
    endTime: endTime || startTime,
    title,
    sections,
  }
}

export function createDay(tripId: string, date: string, title: string, description: string, activities: ActivityInput[]): Day {
  const dayId = uuidv4()
  return {
    id: dayId,
    tripId,
    date,
    title,
    description,
    activities: activities.map(activityInput => ({
      ...activityInput,
      id: uuidv4(),
      dayId,
    })),
  }
}

export function createTrip(tripData: Omit<Trip, 'days'>, days: Day[]): Trip {
  return {
    ...tripData,
    days: days.length,
  }
}
