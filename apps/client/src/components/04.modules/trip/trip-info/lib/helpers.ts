import type { IActivity } from '../models/types'
import type { IImageViewerImageMeta, ImageViewerImage } from '~/components/01.kit/kit-image-viewer'
import type { Memory } from '~/shared/types/models/memory'
import type { TripImage } from '~/shared/types/models/trip'
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

// Расширенный тип метаданных для внутреннего использования, чтобы хранить ID для обратной связи
export interface CustomImageViewerImageMeta extends IImageViewerImageMeta {
  memoryId?: string
  imageId: string
}

/**
 * Преобразует объект TripImage в формат, необходимый для kit-image-viewer.
 * @param image - Объект TripImage.
 * @returns Объект ImageViewerImage.
 */
export function tripImageToViewerImage(image: TripImage): ImageViewerImage {
  const meta: CustomImageViewerImageMeta = {
    ...(image.metadata || {}),
    latitude: image.latitude,
    longitude: image.longitude,
    takenAt: image.takenAt,
    width: image.width,
    height: image.height,
    imageId: image.id,
  }

  return {
    url: image.url,
    variants: image.variants,
    alt: image.metadata?.iptc?.headline || 'Trip Image',
    caption: image.metadata?.iptc?.caption,
    meta,
  }
}

/**
 * Преобразует объект Memory (содержащий TripImage) в формат для kit-image-viewer.
 * @param memory - Объект Memory.
 * @returns Объект ImageViewerImage или null, если изображение отсутствует.
 */
export function memoryToViewerImage(memory: Memory): ImageViewerImage | null {
  if (!memory.image) {
    return null
  }
  const viewerImage = tripImageToViewerImage(memory.image)

  viewerImage.alt = memory.comment || viewerImage.alt
  viewerImage.caption = memory.comment || viewerImage.caption

  if (viewerImage.meta) {
    (viewerImage.meta as CustomImageViewerImageMeta).memoryId = memory.id
  }

  return viewerImage
}
