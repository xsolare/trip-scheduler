import { MockDatabaseClient } from './clients/mock.client'
import { RealDatabaseClient } from './clients/real.client'

const isMockMode = import.meta.env.RSBUILD_APP_MOCK_MODE === 'true'

// Мы экспортируем промис, который разрешится в нужный объект сервиса.
// Это позволяет асинхронно инициализировать реальную БД, не блокируя приложение.
const databaseService = (isMockMode
  ? new MockDatabaseClient()
  : new RealDatabaseClient())
  .initDb()

export default databaseService
