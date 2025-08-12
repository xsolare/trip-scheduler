/**
  Константа с ID мокового пользователя для легкого доступа
  из других файлов моковых данных.
 */
export const MOCK_USER_ID = '1a97d95a-0158-4171-8258-52c7a917e3f0'

/**
  Моковые данные для таблицы 'users'.
 */
export const MOCK_USER_DATA = [
  {
    id: MOCK_USER_ID,
    role: 'admin' as const,
    email: 'mock.user@tripscheduler.dev',
    name: 'Евгений',
    avatarUrl: '/static/avatars/evgeniy.png',
  },
]
