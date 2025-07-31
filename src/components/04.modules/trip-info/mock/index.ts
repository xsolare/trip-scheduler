import type { IDay } from '../models/types'
import { v4 as uuidv4 } from 'uuid'

export const MOCK_DAYS = [
  {
    id: uuidv4(),
    date: '2025-08-01',
    title: 'Прибытие в Рим и первое знакомство',
    activities: [
      {
        id: uuidv4(),
        startTime: '09:00',
        endTime: '10:30',
        title: 'Перелет и поездка в аэропорт',
        sections: [{
          id: uuidv4(),
          text: 'Значимость этих проблем настолько очевидна, что консультация с широким активом способствует подготовки и реализации направлений прогрессивного развития.',
        }],
      },
      {
        id: uuidv4(),
        startTime: '11:00',
        endTime: '13:00',
        title: 'Посещение Колизея',
        sections: [],
      },
      {
        id: uuidv4(),
        startTime: '13:30',
        endTime: '14:30',
        title: 'Обед в Trattoria da Enzo al 29',
        sections: [],
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
        title: 'Прогулка по парку Вилла Боргезе',
        sections: [],
      },
      {
        id: uuidv4(),
        startTime: '14:00',
        endTime: '16:00',
        title: 'Отдых в спа-центре отеля',
        sections: [],
      },
    ],
  },
  {
    id: uuidv4(),
    date: '2025-08-03',
    title: 'Свободный день',
    activities: [],
  },
] as IDay[]
