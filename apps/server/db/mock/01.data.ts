export const MOCK_DATA = [
  // =================================================================
  // ======================= Поездка в Париж ==========================
  // =================================================================
  {
    id: 'df224f26-0e31-4879-a763-719c8369592f', // Trip ID
    title: 'Поездка в Париж',
    imageUrl: '/static/memories/df224f26-0e31-4879-a763-719c8369592f/paris-eiffel.jpg',
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
    images: [
      { id: '1a7a8c1a-a1b7-4d3e-9e7f-1d8c1c5b9a8b', tripId: 'df224f26-0e31-4879-a763-719c8369592f', url: '/static/memories/df224f26-0e31-4879-a763-719c8369592f/paris-eiffel.jpg', placement: 'memories' as const },
      { id: '2b8b9d2b-b2c8-4e4f-8f8a-2e9d2d6c1b9c', tripId: 'df224f26-0e31-4879-a763-719c8369592f', url: '/static/memories/df224f26-0e31-4879-a763-719c8369592f/paris-louvre.jpg', placement: 'memories' as const },
      { id: '3c9cae3c-c3d9-4f5a-9a9b-3f0e3e7d2c0d', tripId: 'df224f26-0e31-4879-a763-719c8369592f', url: '/static/memories/df224f26-0e31-4879-a763-719c8369592f/paris-montmartre.jpg', placement: 'memories' as const },
      { id: '4d0dbf4d-d4e0-4a6b-8b0c-4a1f4f8e3d1e', tripId: 'df224f26-0e31-4879-a763-719c8369592f', url: '/static/route/df224f26-0e31-4879-a763-719c8369592f/paris-seine.jpg', placement: 'route' as const },
    ],
    memories: [
      { id: 'a1b1b1b1-1111-4111-8111-a1b1b1b1b1b1', tripId: 'df224f26-0e31-4879-a763-719c8369592f', imageId: '1a7a8c1a-a1b7-4d3e-9e7f-1d8c1c5b9a8b', timestamp: new Date('2024-06-03T19:30:00Z'), comment: 'Вечер у Эйфелевой башни. Незабываемое зрелище!' },
      { id: 'a2b2b2b2-2222-4222-8222-a2b2b2b2b2b2', tripId: 'df224f26-0e31-4879-a763-719c8369592f', imageId: '2b8b9d2b-b2c8-4e4f-8f8a-2e9d2d6c1b9c', timestamp: null, comment: 'Поход в Лувр. Увидел Мону Лизу.' },
      { id: 'a3b3b3b3-3333-4333-8333-a3b3b3b3b3b3', tripId: 'df224f26-0e31-4879-a763-719c8369592f', imageId: null, timestamp: new Date('2024-06-01T20:00:00Z'), comment: 'Первые впечатления от Парижа: город просто дышит историей и романтикой. Обязательно нужно вернуться!' },
    ],
    days: [
      {
        id: '9e7b2a31-64c8-4f1e-8b1e-219d3f18b57f',
        tripId: 'df224f26-0e31-4879-a763-719c8369592f',
        date: new Date('2024-06-01'),
        title: 'Прибытие и Монмартр',
        description: 'Прибытие в Париж, заселение в отель и вечерняя прогулка по самому творческому району города.',
        activities: [
          { id: 'c1d1d1d1-1111-4111-9111-c1d1d1d1d1d1', dayId: '9e7b2a31-64c8-4f1e-8b1e-219d3f18b57f', startTime: '14:00', endTime: '15:00', title: 'Трансфер из аэропорта Шарль-де-Голль', tag: 'transport' as const, sections: [] },
          { id: 'c2d2d2d2-2222-4222-9222-c2d2d2d2d2d2', dayId: '9e7b2a31-64c8-4f1e-8b1e-219d3f18b57f', startTime: '15:00', endTime: '16:00', title: 'Заселение в отель', tag: 'relax' as const, sections: [] },
        ],
      },
    ],
  },
]
