import { MOCK_USER_ID_1 } from 'db/mock/00.user'

export const TRIP_ID = 'c0417422-b266-4242-91e8-f9a7d852a9fd'
export const USER_ID = MOCK_USER_ID_1

// Используем ID дней из исходного JSON
export const DAY_IDS = {
  DAY_01: '6d579741-3b24-4d6f-8ca1-3fa26fc0e1f0',
  DAY_02: '06fb16c2-edb7-41d3-a3a7-4adf3c066c0d',
  DAY_03: '7b852fc8-c54f-4510-b337-e8d81371f71d',
  DAY_04: '8a8248ab-b061-49bf-9abb-65207257a667',
  DAY_05: '41fb99f6-e7a6-4d9e-be04-c9fc7d6eda9a',
}

// Хелпер для формирования путей к изображениям
export const getRoutePath = (filename: string) => `trips/${TRIP_ID}/route/${filename}`
