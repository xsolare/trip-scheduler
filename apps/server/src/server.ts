/* eslint-disable antfu/no-top-level-await */
/* eslint-disable no-console */
import { sql } from 'drizzle-orm'
import { db } from '../db'
import app from './app'

const port = Number(process.env.PORT) || 8080
const host = process.env.HOST || '0.0.0.0'

console.log(`🚀 Trip Scheduler API starting...`)
console.log(`📍 Server running at http://${host}:${port}`)

try {
  console.log('🟡 Проверяем соединение с базой данных...')
  await db.execute(sql`SELECT 1`)
  console.log('✅ Соединение с базой данных успешно установлено!')
}
catch {
  console.error('❌ Ошибка: Не удалось подключиться к базе данных. Сервер будет остановлен.')

  process.exit(1)
}

export default {
  port,
  hostname: host,
  fetch: app.fetch,
}
