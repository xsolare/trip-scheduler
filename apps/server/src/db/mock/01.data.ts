export const MOCK_DATA = [
  // =================================================================
  // ======================= Поездка в Париж ==========================
  // =================================================================
  {
    id: 'df224f26-0e31-4879-a763-719c8369592f', // Trip ID
    title: 'Поездка в Париж',
    imageUrl: '/images/paris.jpg',
    description: 'Романтическая поездка в город любви',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-05'),
    cities: ['Париж', 'Версаль'],
    status: 'completed' as const,
    budget: 150000,
    currency: 'EUR',
    participants: ['Анна', 'Михаил'],
    tags: ['романтика', 'культура', 'город', 'франция'],
    visibility: 'private' as const,
    days: [
      {
        id: '9e7b2a31-64c8-4f1e-8b1e-219d3f18b57f', // Day ID
        tripId: 'df224f26-0e31-4879-a763-719c8369592f',
        date: new Date('2024-06-01'),
        title: 'Прибытие и Монмартр',
        description: 'Прибытие в Париж, заселение в отель и вечерняя прогулка по самому творческому району города.',
        activities: [
          { id: '1a9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a8b', dayId: '9e7b2a31-64c8-4f1e-8b1e-219d3f18b57f', startTime: '14:00', endTime: '15:00', title: 'Трансфер из аэропорта Шарль-де-Голль', sections: [] },
          { id: '2b9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a8c', dayId: '9e7b2a31-64c8-4f1e-8b1e-219d3f18b57f', startTime: '15:00', endTime: '16:00', title: 'Заселение в отель', sections: [] },
          {
            id: '3c9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a8d',
            dayId: '9e7b2a31-64c8-4f1e-8b1e-219d3f18b57f',
            startTime: '17:00',
            endTime: '19:00',
            title: 'Прогулка по Монмартру и Базилика Сакре-Кёр',
            sections: [
              { id: 'sec-1-1', type: 'description' as const, text: 'Исследуем узкие улочки, посмотрим на уличных художников на площади Тертр.' },
            ],
          },
          { id: '4d9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a8e', dayId: '9e7b2a31-64c8-4f1e-8b1e-219d3f18b57f', startTime: '19:30', endTime: '21:00', title: 'Ужин в традиционном французском бистро', sections: [] },
        ],
      },
      {
        id: 'b8c1d2e3-f4a5-4b6c-8d7e-9f0a1b2c3d4e', // Day ID
        tripId: 'df224f26-0e31-4879-a763-719c8369592f',
        date: new Date('2024-06-02'),
        title: 'День искусства: Лувр и Орсэ',
        description: 'Погружение в мир мирового искусства в двух величайших музеях Парижа.',
        activities: [
          {
            id: '5e9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a8f',
            dayId: 'b8c1d2e3-f4a5-4b6c-8d7e-9f0a1b2c3d4e',
            startTime: '10:00',
            endTime: '14:00',
            title: 'Посещение Лувра',
            sections: [
              { id: 'sec-2-1', type: 'description' as const, text: 'Встреча с Моной Лизой, Венерой Милосской и Никой Самофракийской. Билеты куплены заранее.' },
              { id: 'sec-2-2', type: 'gallery' as const, imageUrls: ['/images/smth-wrong.png'] },
            ],
          },
          { id: '6f9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a90', dayId: 'b8c1d2e3-f4a5-4b6c-8d7e-9f0a1b2c3d4e', startTime: '14:00', endTime: '15:00', title: 'Обед в саду Тюильри', sections: [] },
          {
            id: '7f9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a91',
            dayId: 'b8c1d2e3-f4a5-4b6c-8d7e-9f0a1b2c3d4e',
            startTime: '15:30',
            endTime: '18:00',
            title: 'Музей д\'Орсэ',
            sections: [
              { id: 'sec-2-3', type: 'description' as const, text: 'Коллекция импрессионистов и постимпрессионистов в здании бывшего вокзала.' },
            ],
          },
        ],
      },
      {
        id: 'c9d2e3f4-a5b6-4c7d-8e8f-0a1b2c3d4e5f', // Day ID
        tripId: 'df224f26-0e31-4879-a763-719c8369592f',
        date: new Date('2024-06-03'),
        title: 'Символы Парижа: Эйфелева башня и Сена',
        description: 'День, посвященный главным иконам города.',
        activities: [
          { id: '8b9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a92', dayId: 'c9d2e3f4-a5b6-4c7d-8e8f-0a1b2c3d4e5f', startTime: '11:00', endTime: '13:00', title: 'Подъем на Эйфелеву башню', sections: [] },
          { id: '9c9a8c6a-4b7d-4c3e-9e7f-1d8c1c5b9a93', dayId: 'c9d2e3f4-a5b6-4c7d-8e8f-0a1b2c3d4e5f', startTime: '13:00', endTime: '14:30', title: 'Пикник на Марсовом поле', sections: [] },
        ],
      },
    ],
  },
  // =================================================================
  // =================== Автопутешествие по Алтаю =====================
  // =================================================================
  {
    id: 'e6a3b1e8-3a8b-4b1c-9e2f-5d1e4c3b2a1d', // Trip ID
    title: 'Автопутешествие по Алтаю',
    imageUrl: '/images/altai.jpg',
    description: 'Незабываемое путешествие по Чуйскому тракту к сердцу Алтайских гор.',
    startDate: new Date('2025-08-10'),
    endDate: new Date('2025-08-17'),
    cities: ['Горно-Алтайск', 'Акташ', 'Чемал', 'Улаган'],
    status: 'draft' as const,
    budget: 80000,
    currency: 'RUB',
    participants: ['Алексей', 'Дмитрий', 'Светлана'],
    tags: ['природа', 'горы', 'автопутешествие', 'россия'],
    visibility: 'public' as const,
    days: [
      {
        id: 'f7b4c2f9-4b9c-5c2d-ae3f-6e2f5d4c3b2e',
        tripId: 'e6a3b1e8-3a8b-4b1c-9e2f-5d1e4c3b2a1d',
        date: new Date('2025-08-10'),
        title: 'Старт из Горно-Алтайска',
        description: 'Начало нашего путешествия.',
        activities: [
          { id: 'a1b2c3d4-e5f6-7788-9900-aabbccddeeff', dayId: 'f7b4c2f9-4b9c-5c2d-ae3f-6e2f5d4c3b2e', startTime: '10:00', endTime: '12:00', title: 'Получение автомобиля и закупка провизии', sections: [] },
          {
            id: 'b2c3d4e5-f6a7-8899-0011-bbccddeeff00',
            dayId: 'f7b4c2f9-4b9c-5c2d-ae3f-6e2f5d4c3b2e',
            startTime: '12:00',
            endTime: '18:00',
            title: 'Дорога до Чемала через Семинский перевал',
            sections: [
              { id: 'sec-alt-1', type: 'description' as const, text: 'Первый серьезный перевал на нашем пути. Остановка на смотровой площадке.' },
            ],
          },
        ],
      },
      {
        id: '0d1c2b3a-4e5f-6a7b-8c9d-0e1f2a3b4c5d', // Day ID
        tripId: 'e6a3b1e8-3a8b-4b1c-9e2f-5d1e4c3b2a1d',
        date: new Date('2025-08-12'),
        title: 'Марсианские пейзажи и Гейзерное озеро',
        description: 'Добираемся до самых фотогеничных мест Алтая.',
        activities: [
          {
            id: 'c3d4e5f6-a7b8-9900-1122-ccddeeff0011',
            dayId: '0d1c2b3a-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
            startTime: '10:00',
            endTime: '12:00',
            title: 'Посещение Гейзерного озера',
            sections: [
              { id: 'sec-alt-2', type: 'description' as const, text: 'Небольшое термальное озеро с удивительными голубыми кругами на дне.' },
              { id: 'sec-alt-3', type: 'gallery' as const, imageUrls: ['/images/smth-wrong.png'] },
            ],
          },
        ],
      },
    ],
  },
]
