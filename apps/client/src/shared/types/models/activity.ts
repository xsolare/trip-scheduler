export enum ActivityTag {
  TRANSPORT = 'transport',
  WALK = 'walk',
  FOOD = 'food',
  ATTRACTION = 'attraction',
  RELAX = 'relax',
}

export enum ActivitySectionType {
  DESCRIPTION = 'description',
  GALLERY = 'gallery',
  GEOLOCATION = 'geolocation',
}

export interface ActivitySection {
  id: string
  type: ActivitySectionType
  isAttached?: boolean
}

export interface ActivitySectionText extends ActivitySection {
  type: ActivitySectionType.DESCRIPTION
  text: string
}

export interface ActivitySectionGallery extends ActivitySection {
  type: ActivitySectionType.GALLERY
  imageUrls: string[]
}

export interface ActivitySectionGeolocation extends ActivitySection {
  type: ActivitySectionType.GEOLOCATION
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
