export enum EActivityTag {
  TRANSPORT = 'transport',
  WALK = 'walk',
  FOOD = 'food',
  ATTRACTION = 'attraction',
  RELAX = 'relax',
}

export enum EActivitySectionType {
  DESCRIPTION = 'description',
  GALLERY = 'gallery',
  GEOLOCATION = 'geolocation',
}

export interface ActivitySection {
  id: string
  type: EActivitySectionType
  isAttached?: boolean
}

export interface ActivitySectionText extends ActivitySection {
  type: EActivitySectionType.DESCRIPTION
  text: string
}

export interface ActivitySectionGallery extends ActivitySection {
  type: EActivitySectionType.GALLERY
  imageUrls: string[]
}

export interface ActivitySectionGeolocation extends ActivitySection {
  type: EActivitySectionType.GEOLOCATION
  latitude: number
  longitude: number
  address: string
}

export type ActivitySections = (ActivitySectionText | ActivitySectionGallery | ActivitySectionGeolocation)[]

export interface Activity {
  id: string
  dayId: string
  title: string
  startTime: string
  endTime: string
  //
  sections?: ActivitySections
  tag?: EActivityTag
  rating?: number 
  status: EActivityStatus
}

export enum EActivityStatus {
  NONE = 'none',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

export interface Day {
  id: string
  tripId: string
  date: string
  title: string
  description: string
  activities: Activity[]
}
