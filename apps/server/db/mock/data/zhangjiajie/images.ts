import { getRoutePath, TRIP_ID } from './constants'

const imageFilenames = [
  '20250824231248.png',
  '20250825154758.png',
  '20250825155522.png',
  '20250825162319.png',
  '20250825162402.png',
  '20250825163648.png',
  '20250825163635.png',
  '20250825162444.png',
  '20250825163028.png',
  '20250825163109.png',
  '20250825163212.png',
  '20250825163302.png',
  '20250825163329.png',
  // ... (здесь должны быть все остальные файлы изображений из вашего проекта)
]

export const MOCK_IMAGES = [...new Set(imageFilenames)].map(filename => ({
  id: crypto.randomUUID(),
  tripId: TRIP_ID,
  url: getRoutePath(filename),
  placement: 'route' as const,
}))
