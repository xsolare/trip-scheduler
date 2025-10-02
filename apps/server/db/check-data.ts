/* eslint-disable no-console */
import process from 'node:process'
import { sql } from 'drizzle-orm'
import { db } from './index'
import { trips, users } from './schema'

async function checkData() {
  console.log('🧐 Начинаем проверку данных в базе...')

  try {
    // 1. Проверяем общее количество пользователей
    const [userCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
    console.log(`👤 Найдено пользователей: ${userCountResult.count}`)

    // 2. Проверяем общее количество путешествий
    const [tripCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(trips)
    console.log(`✈️  Найдено путешествий: ${tripCountResult.count}`)

    // 3. Получаем и выводим первые 3 путешествия для примера
    if (tripCountResult.count > 0) {
      const firstTrips = await db.query.trips.findMany({
        limit: 3,
        with: {
          user: {
            columns: {
              name: true,
            },
          },
        },
      })
      console.log('\n✅ Пример первых 3 путешествий:')
      firstTrips.forEach((trip) => {
        console.log(`   - "${trip.title}" (ID: ${trip.id}, Автор: ${trip.user.name})`)
      })
    }

    console.log('\n🎉 Проверка данных успешно завершена.')
  }
  catch (error) {
    console.error('❌ Ошибка во время проверки данных:', error)
    process.exit(1)
  }
  finally {
    // Важно, чтобы скрипт завершился и не висел
    process.exit(0)
  }
}

checkData()
