/* eslint-disable no-console */
import { db } from './index'
import { MOCK_DATA } from './mock/01.data'
import { activities, days, trips } from './schema'

async function seed() {
  console.log('🌱 Начало заполнения базы данных...')

  console.log('🗑️  Очистка старых данных...')
  await db.delete(activities).catch(() => console.log('Таблица activities еще не существует, пропускаем очистку.'))
  await db.delete(days).catch(() => console.log('Таблица days еще не существует, пропускаем очистку.'))
  await db.delete(trips).catch(() => console.log('Таблица trips еще не существует, пропускаем очистку.'))

  console.log('✈️  Подготовка данных для вставки...')

  // Готовим три плоских массива для пакетной вставки
  const tripsToInsert: (typeof trips.$inferInsert)[] = []
  const daysToInsert: (typeof days.$inferInsert)[] = []
  const activitiesToInsert: (typeof activities.$inferInsert)[] = []

  for (const tripData of MOCK_DATA) {
    const { days: mockDays, ...tripDetails } = tripData

    // 1. Готовим путешествие
    tripsToInsert.push({
      ...tripDetails,
      startDate: tripDetails.startDate.toISOString().split('T')[0],
      endDate: tripDetails.endDate.toISOString().split('T')[0],
      days: mockDays.length,
    })

    for (const mockDay of mockDays) {
      const { activities: mockActivities, ...dayDetails } = mockDay

      // 2. Готовим дни
      daysToInsert.push({
        ...dayDetails,
        date: dayDetails.date.toISOString().split('T')[0],
      })

      for (const mockActivity of mockActivities) {
        // 3. Готовим активности
        activitiesToInsert.push(mockActivity)
      }
    }
  }

  console.log(`✈️  Вставка ${tripsToInsert.length} путешествий, ${daysToInsert.length} дней и ${activitiesToInsert.length} активностей...`)

  // Выполняем пакетные вставки
  if (tripsToInsert.length > 0)
    await db.insert(trips).values(tripsToInsert)
  if (daysToInsert.length > 0)
    await db.insert(days).values(daysToInsert)
  if (activitiesToInsert.length > 0)
    await db.insert(activities).values(activitiesToInsert)

  console.log('✅ База данных успешно заполнена!')
  process.exit(2)
}

seed().catch((e) => {
  console.error('❌ Ошибка при заполнении базы данных:', e)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
})
