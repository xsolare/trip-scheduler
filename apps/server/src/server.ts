/* eslint-disable antfu/no-top-level-await */
/* eslint-disable no-console */
import type { Hono } from 'hono'
import { sql } from 'drizzle-orm'
import { db } from '../db'
import { trips, users } from '../db/schema'
import Server from './app'
import { totalTripsGauge, totalUsersGauge } from './services/metrics.service'

const app: Hono = Server.getApp()
const port = Number(process.env.PORT) || 8080
const host = process.env.HOST || '0.0.0.0'

/**
 * Асинхронная функция для обновления метрик, основанных на данных из БД.
 */
async function updateDatabaseMetrics() {
  try {
    const [userCountResult] = await db.select({ count: sql<number>`count(*)` }).from(users)
    totalUsersGauge.set(Number(userCountResult.count))

    const [tripCountResult] = await db.select({ count: sql<number>`count(*)` }).from(trips)
    totalTripsGauge.set(Number(tripCountResult.count))
  }
  catch (error) {
    console.error('❌ Ошибка при обновлении метрик из базы данных:', error)
  }
}

console.log(`🚀 Trip Scheduler API starting...`)
console.log(`📍 Server running at http://${host}:${port}`)

try {
  console.log('🟡 Проверяем соединение с базой данных...')
  await db.execute(sql`SELECT 1`)
  console.log('✅ Соединение с базой данных успешно установлено!')

  setInterval(updateDatabaseMetrics, 30000)
  updateDatabaseMetrics()
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
