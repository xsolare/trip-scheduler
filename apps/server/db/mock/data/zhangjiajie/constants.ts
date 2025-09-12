import { MOCK_USER_ID_1 } from 'db/mock/00.user'

export const TRIP_ID = 'c0417422-b266-4242-91e8-f9a7d852a9fd'
export const USER_ID = MOCK_USER_ID_1

// Генерируем уникальные ID для каждого дня путешествия
export const DAY_IDS = Array.from({ length: 15 }, () => crypto.randomUUID())

// Хелпер для формирования путей к изображениям
export const getRoutePath = (filename: string) => `trips/${TRIP_ID}/route/${filename}`
