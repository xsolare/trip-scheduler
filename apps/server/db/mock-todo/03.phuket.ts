import { MOCK_USER_ID_3 } from '../mock/00.user'

// =================================================================
// ==================== Путешествие 2: Пхукет =======================
// =================================================================
const TRIP_PHUKET_ID = 'f1e2d3c4-b5a6-9876-5432-10fedcba9876'

const getPhuketRoutePath = (filename: string) => `/static/images/trips/${TRIP_PHUKET_ID}/route/${filename}`

const phuketImageObjects = [
  'phuket-kata-beach.jpg',
  'phuket-big-buddha.jpg',
  'phuket-promthep-cape.jpg',
  'phuket-old-town.jpg',
  'phuket-freedom-beach-hike.jpg',
].map(filename => ({
  id: crypto.randomUUID(),
  tripId: TRIP_PHUKET_ID,
  url: getPhuketRoutePath(filename),
  placement: 'route' as const,
}))

export const MOCK_DATA = [
  // =================================================================
  // ============= Путешествие: Сокровища Пхукета ====================
  // =================================================================
  {
    id: TRIP_PHUKET_ID,
    title: 'Сокровища Пхукета: от пляжей до Большого Будды',
    userId: MOCK_USER_ID_3,
    imageUrl: getPhuketRoutePath('phuket-promthep-cape.jpg'),
    description: 'Пятидневное исследование жемчужины Таиланда — Пхукета. Маршрут включает отдых на знаменитых пляжах Ката и Най Харн, посещение духовных центров острова, таких как Большой Будда, и погружение в колоритную атмосферу Старого города.',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-05'),
    cities: ['Пхукет'],
    status: 'draft' as const,
    budget: 80000,
    currency: 'RUB',
    participants: ['Максим'],
    tags: ['Таиланд', 'Пхукет', 'пляж', 'море', 'природа', 'хайкинг', 'культура'],
    visibility: 'private' as const,
    participantIds: [MOCK_USER_ID_3],
    images: phuketImageObjects,
    memories: [],
    days: [],
  },
]
