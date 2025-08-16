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
    name: 'Триппер',
    avatarUrl: '/static/avatars/ghoul.gif',
    password: '$argon2id$v=19$m=65536,t=2,p=1$5dk/3wyofRTLJmAMfC1LD5c92Ci4fGkqYkEUBOTfWy8$TBGnUdaGFaHKevxIvvIg8FgdPSl1F4h5b5Zo73rOn3M',
  },
]
