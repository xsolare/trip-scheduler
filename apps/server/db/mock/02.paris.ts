// Генерируем настоящие UUID
const TRIP_PARIS_ID = crypto.randomUUID()

// Дни
const DAY_1_ID = crypto.randomUUID()
const DAY_2_ID = crypto.randomUUID()
const DAY_3_ID = crypto.randomUUID()

// Изображения
const IMG_EIFFEL_ID = crypto.randomUUID()
const IMG_LOUVRE_ID = crypto.randomUUID()
const IMG_MONTMARTRE_ID = crypto.randomUUID()
const IMG_SEINE_ID = crypto.randomUUID()
const IMG_VERSAILLES_ID = crypto.randomUUID()
const IMG_CROISSANT_ID = crypto.randomUUID()

// Это поможет избежать ошибок при изменении структуры в будущем
const getMemoriesPath = (filename: string) => `/static/trip-paris/memories/${filename}`
const getRoutePath = (filename: string) => `/static/trip-paris/route/${filename}`

export const MOCK_DATA = [
  // =================================================================
  // ======================= Поездка в Париж ==========================
  // =================================================================
  {
    id: TRIP_PARIS_ID,
    title: 'Большое путешествие в Париж',
    imageUrl: getMemoriesPath('paris-eiffel.png'),
    description: 'Романтическая и культурная поездка в столицу Франции. От Эйфелевой башни до уютных улочек Монмартра.',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-03'),
    cities: ['Париж', 'Версаль'],
    status: 'completed' as const,
    budget: 150000,
    currency: 'EUR',
    participants: ['Анна', 'Михаил', 'Елена'],
    tags: ['романтика', 'культура', 'город', 'франция', 'гастрономия'],
    visibility: 'private' as const,
    images: [
      { id: IMG_EIFFEL_ID, tripId: TRIP_PARIS_ID, url: getMemoriesPath('paris-eiffel.png'), placement: 'memories' as const },
      { id: IMG_LOUVRE_ID, tripId: TRIP_PARIS_ID, url: getMemoriesPath('paris-louvre.png'), placement: 'memories' as const },
      { id: IMG_MONTMARTRE_ID, tripId: TRIP_PARIS_ID, url: getMemoriesPath('paris-montmartre.jpg'), placement: 'memories' as const },
      { id: IMG_CROISSANT_ID, tripId: TRIP_PARIS_ID, url: getMemoriesPath('paris-croissant.png'), placement: 'memories' as const },
      { id: IMG_SEINE_ID, tripId: TRIP_PARIS_ID, url: getRoutePath('paris-seine.jpg'), placement: 'route' as const },
      { id: IMG_VERSAILLES_ID, tripId: TRIP_PARIS_ID, url: getRoutePath('versailles-palace.jpg'), placement: 'route' as const },
    ],
    memories: [
      { id: crypto.randomUUID(), tripId: TRIP_PARIS_ID, imageId: IMG_EIFFEL_ID, timestamp: new Date('2024-06-02T19:30:00Z'), comment: 'Вечер у Эйфелевой башни. Незабываемое зрелище, когда включается подсветка!' },
      { id: crypto.randomUUID(), tripId: TRIP_PARIS_ID, imageId: IMG_LOUVRE_ID, timestamp: new Date('2024-06-02T13:00:00Z'), comment: 'Поход в Лувр. Конечно, Мона Лиза, но и Ника Самофракийская впечатляет не меньше.' },
      { id: crypto.randomUUID(), tripId: TRIP_PARIS_ID, imageId: IMG_MONTMARTRE_ID, timestamp: new Date('2024-06-01T18:00:00Z'), comment: 'Прогулка по Монмартру. Уличные художники, базилика Сакре-Кёр и невероятная атмосфера.' },
      { id: crypto.randomUUID(), tripId: TRIP_PARIS_ID, imageId: IMG_CROISSANT_ID, timestamp: new Date('2024-06-03T09:00:00Z'), comment: 'Самый вкусный круассан в моей жизни. Французская выпечка — это что-то!' },
      { id: crypto.randomUUID(), tripId: TRIP_PARIS_ID, imageId: null, timestamp: new Date('2024-06-01T20:00:00Z'), comment: 'Первые впечатления от Парижа: город просто дышит историей и романтикой. Обязательно нужно вернуться!' },
    ],
    days: [
      {
        id: DAY_1_ID,
        tripId: TRIP_PARIS_ID,
        date: new Date('2024-06-01'),
        title: 'Прибытие и Монмартр',
        description: 'Прибытие в Париж, заселение в отель и вечерняя прогулка по самому творческому району города.',
        activities: [
          {
            id: crypto.randomUUID(),
            dayId: DAY_1_ID,
            startTime: '14:00',
            endTime: '15:00',
            title: 'Трансфер из аэропорта',
            tag: 'transport' as const,
            sections: [
              { id: crypto.randomUUID(), type: 'description', text: 'Поездка на RER B до станции Châtelet–Les Halles.' },
            ],
          },
          {
            id: crypto.randomUUID(),
            dayId: DAY_1_ID,
            startTime: '15:00',
            endTime: '16:00',
            title: 'Заселение в отель',
            tag: 'relax' as const,
            sections: [
              { id: crypto.randomUUID(), type: 'geolocation', latitude: 48.885, longitude: 2.333, address: '68 Boulevard de Clichy, 75018 Paris' },
            ],
          },
          { id: crypto.randomUUID(), dayId: DAY_1_ID, startTime: '19:30', endTime: '21:00', title: 'Ужин в "Le Consulat"', tag: 'food' as const, sections: [] },
        ],
      },
      {
        id: DAY_2_ID,
        tripId: TRIP_PARIS_ID,
        date: new Date('2024-06-02'),
        title: 'Искусство и речные прогулки',
        description: 'День посвящен главным достопримечательностям.',
        activities: [
          {
            id: crypto.randomUUID(),
            dayId: DAY_2_ID,
            startTime: '10:00',
            endTime: '14:00',
            title: 'Посещение Лувра',
            tag: 'attraction' as const,
            sections: [
              { id: crypto.randomUUID(), type: 'description', text: 'Билеты куплены онлайн. План: крыло Денон (Мона Лиза, Ника).' },
              { id: crypto.randomUUID(), type: 'gallery', imageUrls: [getMemoriesPath('paris-louvre.jpg')] },
            ],
          },
          {
            id: crypto.randomUUID(),
            dayId: DAY_2_ID,
            startTime: '18:00',
            endTime: '19:00',
            title: 'Круиз по Сене',
            tag: 'attraction' as const,
            sections: [
              { id: crypto.randomUUID(), type: 'gallery', imageUrls: [getRoutePath('paris-seine.jpg')] },
            ],
          },
        ],
      },
      {
        id: DAY_3_ID,
        tripId: TRIP_PARIS_ID,
        date: new Date('2024-06-03'),
        title: 'Прощание с Парижем',
        description: 'Утренняя выпечка, шоппинг и вылет домой.',
        activities: [
          {
            id: crypto.randomUUID(),
            dayId: DAY_3_ID,
            startTime: '09:00',
            endTime: '10:00',
            title: 'Завтрак в булочной',
            tag: 'food' as const,
            sections: [
              { id: crypto.randomUUID(), type: 'gallery', imageUrls: [getMemoriesPath('paris-croissant.jpg')] },
            ],
          },
          { id: crypto.randomUUID(), dayId: DAY_3_ID, startTime: '13:00', endTime: '14:00', title: 'Трансфер в аэропорт', tag: 'transport' as const, sections: [] },
        ],
      },
    ],
  },
]
