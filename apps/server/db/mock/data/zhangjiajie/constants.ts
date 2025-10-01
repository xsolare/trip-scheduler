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
  DAY_06: 'd2c1b2a3-f4e5-4d6c-8b9a-0c1d2e3f4a5b',
  DAY_07: 'e3d2c1b4-a5f6-4e7d-9c0b-1d2e3f4a5b6c',
  DAY_08: 'f4e3d2c5-b6a7-4f8e-a0d1-2e3f4a5b6c7d',
  DAY_09: 'a5f4e3d6-c7b8-4a9f-b1e2-3f4a5b6c7d8e',
  DAY_10: '32bcabf2-fa72-43f5-8a45-269dc59dea0b',
  DAY_11: 'c7b6a5f8-e9da-4cb1-d304-5b6c7d8e9f0a',
  DAY_12: 'd8c7b6a9-f0eb-4dc2-e415-6c7d8e9f0a1b',
  DAY_13: 'e9d8c7ba-a1fc-4ed3-f526-7d8e9f0a1b2c',
  DAY_14: 'f0e9d8cb-b2ad-4fe4-0637-8e9f0a1b2c3d',
  DAY_15: 'a1f0e9dc-c3be-40f5-1748-9f0a1b2c3d4e',
}

// Хелпер для формирования путей к изображениям
export const getRoutePath = (filename: string) => `trips/${TRIP_ID}/route/${filename}`
