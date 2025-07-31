import type { Day } from '~/shared/types/models/activity'
import { v4 as uuidv4 } from 'uuid'

export const MOCK_DAYS = [
  {
    id: uuidv4(),
    tripId: '1', // Связь с путешествием "Покорение Алтая"
    date: '2025-07-15',
    title: 'Прибытие в Горно-Алтайск и акклиматизация',
    activities: [
      {
        id: uuidv4(),
        startTime: '14:00',
        endTime: '16:00',
        title: 'Заселение в отель и отдых',
        sections: [{
          id: uuidv4(),
          text: 'После долгого перелета важно дать организму отдохнуть и привыкнуть к новому часовому поясу.',
        }],
      },
      {
        id: uuidv4(),
        startTime: '18:00',
        endTime: '19:30',
        title: 'Ужин с традиционной алтайской кухней',
        sections: [],
      },
    ],
  },
  {
    id: uuidv4(),
    tripId: '1', // Связь с путешествием "Покорение Алтая"
    date: '2025-07-16',
    title: 'Начало треккинга',
    description: 'Сегодня начинается активная часть нашего путешествия. Мы отправимся к подножию горы Белуха.',
    activities: [
      {
        id: uuidv4(),
        startTime: '09:00',
        endTime: '13:00',
        title: 'Треккинг к первой стоянке',
        sections: [],
      },
      {
        id: uuidv4(),
        startTime: '13:00',
        endTime: '14:00',
        title: 'Обед на природе',
        sections: [],
      },
    ],
  },
  {
    id: uuidv4(),
    tripId: '2', // Связь с путешествием "Неоновый Гонконг"
    date: '2025-09-10',
    title: 'Прибытие и Пик Виктория',
    activities: [],
  },
] as Day[]
