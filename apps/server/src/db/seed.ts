/* eslint-disable no-console */
import { db } from './index'
import { activities, days, trips } from './schema'

const MOCK_TRIPS = [
  {
    id: '1',
    title: 'Путешествие в Чжанцзяцзе',
    imageUrl: '/images/zhangjiajie.jpg',
    description: 'Эпическое приключение в горах Аватара.',
    days: 2,
    startDate: '2025-07-15',
    endDate: '2025-07-16',
    cities: ['Чжанцзяцзе'],
    status: 'planned' as const,
    budget: 200000,
    currency: 'RUB',
    participants: ['Евгений', 'Алиса'],
    tags: ['горы', 'природа', 'треккинг'],
    visibility: 'public' as const,
  },
  {
    id: '2',
    title: 'Поездка в Париж',
    imageUrl: '/images/paris.jpg',
    description: 'Романтическая поездка в город любви',
    days: 5,
    startDate: '2024-06-01',
    endDate: '2024-06-05',
    cities: ['Париж'],
    status: 'completed' as const,
    budget: 150000,
    currency: 'RUB',
    participants: ['Анна', 'Михаил'],
    tags: ['романтика', 'культура', 'город'],
    visibility: 'private' as const,
  },
]

const MOCK_DAYS = [
  {
    id: 'day-1',
    tripId: '1',
    date: '2025-07-15',
    title: 'День 1 - Прибытие в Чжанцзяцзе',
    description: 'Ваш первый день в Чжанцзяцзе будет посвящен прибытию и акклиматизации...',
    activities: [
      {
        id: 'activity-1-1',
        startTime: '00:00',
        endTime: '19:00',
        title: 'Прибытие в Международный аэропорт Чжанцзяцзе-Хэхуа (*DYG*)',
        sections: [{
          id: 'section-1-1-1',
          type: 'description',
          text: '*   _Примечание:_ Вы прилетаете внутренним рейсом из Гуанчжоу...',
        }],
      },
      {
        id: 'activity-1-2',
        startTime: '18:00',
        endTime: '19:30',
        title: 'Ужин с традиционной хунаньской кухней',
        sections: [],
      },
    ],
  },
  {
    id: 'day-2',
    tripId: '1',
    date: '2025-07-16',
    title: 'Начало треккинга',
    description: 'Сегодня начинается активная часть нашего путешествия. Мы отправимся к подножию горы Белуха.',
    activities: [
      {
        id: 'activity-2-1',
        startTime: '09:00',
        endTime: '13:00',
        title: 'Треккинг к первой стоянке',
        sections: [],
      },
      {
        id: 'activity-2-2',
        startTime: '13:00',
        endTime: '14:00',
        title: 'Обед на природе',
        sections: [],
      },
    ],
  },
  {
    id: 'day-3',
    tripId: '2',
    date: '2025-09-10',
    title: 'Прибытие и Пик Виктория',
    description: 'Прибытие в Гонконг и подъем на Пик Виктория для панорамного вида на город.',
    activities: [],
  },
]

async function seed() {
  console.log('🌱 Начало заполнения базы данных...')

  // 1. Очистка таблиц в правильном порядке (сначала дочерние)
  console.log('🗑️  Очистка старых данных...')
  await db.delete(activities).run()
  await db.delete(days).run()
  await db.delete(trips).run()

  // 2. Заполнение таблицы путешествий (trips)
  console.log('✈️  Заполнение путешествий...')
  await db.insert(trips).values(MOCK_TRIPS).run()

  // 3. Подготовка и заполнение дней и активностей
  console.log('🗓️  Заполнение дней и активностей...')
  if (MOCK_DAYS.length > 0) {
    const daysToInsert: (typeof days.$inferInsert)[] = []
    const activitiesToInsert: (typeof activities.$inferInsert)[] = []

    for (const day of MOCK_DAYS) {
      // Добавляем день в массив для вставки
      daysToInsert.push({
        id: day.id,
        tripId: day.tripId,
        date: day.date,
        title: day.title,
        description: day.description,
      })

      // Добавляем активности этого дня
      for (const activity of day.activities) {
        activitiesToInsert.push({
          ...activity,
          dayId: day.id, // Связываем активность с днем
        })
      }
    }

    // Вставляем все дни одной командой
    if (daysToInsert.length > 0) {
      await db.insert(days).values(daysToInsert).run()
    }

    // Вставляем все активности одной командой
    if (activitiesToInsert.length > 0) {
      await db.insert(activities).values(activitiesToInsert).run()
    }
  }

  console.log('✅ База данных успешно заполнена!')
}

seed().catch((e) => {
  console.error('❌ Ошибка при заполнении базы данных:', e)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
})
