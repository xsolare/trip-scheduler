import type { Day } from '../models/activity'
import { v4 as uuidv4 } from 'uuid'

// Теперь мы экспортируем массив дней, а не активностей
export const MOCK_DAYS: Day[] = [
  {
    id: uuidv4(),
    date: '2025-08-01',
    title: 'Прибытие в Рим и первое знакомство',
    description: 'День посвящен прибытию, заселению в отель и легкой прогулке по историческому центру, чтобы почувствовать атмосферу вечного города.',
    activities: [
      {
        id: uuidv4(),
        startTime: '09:00',
        endTime: '10:30',
        description: 'Перелет и поездка в аэропорт',
        blocks: [{
          id: uuidv4(),
          description: 'Значимость этих проблем настолько очевидна, что консультация с широким активом способствует подготовки и реализации направлений прогрессивного развития.',
        }],
      },
      {
        id: uuidv4(),
        startTime: '11:00',
        endTime: '13:00',
        description: 'Посещение Колизея',
        blocks: [],
      },
      {
        id: uuidv4(),
        startTime: '13:30',
        endTime: '14:30',
        description: 'Обед в Trattoria da Enzo al 29',
        blocks: [],
      },
    ],
  },
  {
    id: uuidv4(),
    date: '2025-08-02',
    title: 'Искусство и парки',
    description: 'Сегодня мы погрузимся в мир искусства Ватикана и насладимся природой в парке Вилла Боргезе.',
    activities: [
      {
        id: uuidv4(),
        startTime: '10:00',
        endTime: '12:00',
        description: 'Прогулка по парку Вилла Боргезе',
        blocks: [],
      },
      {
        id: uuidv4(),
        startTime: '14:00',
        endTime: '16:00',
        description: 'Отдых в спа-центре отеля',
        blocks: [],
      },
    ],
  },
  {
    id: uuidv4(),
    date: '2025-08-03',
    title: 'Свободный день',
    // День может быть и без описания
    activities: [], // И даже без активностей
  },
]
