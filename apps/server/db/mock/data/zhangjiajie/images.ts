import { getRoutePath, TRIP_ID } from './constants'

const imagesData = [
  { id: '090bcf93-9a9a-4538-95c3-2b540d0a2d7f', filename: '20250824231248.png' },
  { id: '0dee086c-7ad7-4558-a441-8092f08d1363', filename: '20250825154758.png' },
  { id: '17500a02-98fb-4161-bd36-a7314ba44dbe', filename: '20250825155522.png' },
  { id: '46198f20-a4a3-490d-bf1b-b38226541e35', filename: '20250825162319.png' },
  { id: '1290e98a-ecea-41e0-9657-44077eacd3a7', filename: '20250825162402.png' },
  { id: '786d2668-2c2a-4f36-a031-ce0582447685', filename: '20250825163648.png' },
  { id: '87310ae5-97cd-4368-9f7a-3b2023a91117', filename: '20250825163635.png' },
  { id: '6b1f03bf-79f3-440e-9e53-b8e62bcb34f9', filename: '20250825162444.png' },
  { id: 'c42a5e71-8597-4a4e-8d78-c773b515de85', filename: '20250825163028.png' },
  { id: 'c71cf0bb-9f54-44d0-924a-74c05a211ee6', filename: '20250825163109.png' },
  { id: '69d73dad-5d71-45ea-a4b6-bed8587bf650', filename: '20250825163212.png' },
  { id: 'c054fae1-a2a7-4849-8e7c-92531632da63', filename: '20250825163302.png' },
  { id: '929aec4c-d4aa-494d-915d-532f6283838d', filename: '20250825163329.png' },
]

export const MOCK_IMAGES = imagesData.map(img => ({
  id: img.id,
  tripId: TRIP_ID,
  url: getRoutePath(img.filename),
  placement: 'route' as const,
  sizeBytes: 0,
  takenAt: null,
  latitude: null,
  longitude: null,
  width: null,
  height: null,
  variants: null,
  metadata: null,
}))
