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
  tripId: string
  date: string
  title: string
  description?: string
  activities: Activity[]
}
