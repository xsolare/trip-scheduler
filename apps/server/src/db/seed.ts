// src/db/seed.ts (обновленная версия)

/* eslint-disable no-console */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { db } from './index'
import { MOCK_DATA } from './mock/01.data'
import { activities, days, tripImages, trips } from './schema'

async function seed() {
  console.log('🌱 Начало заполнения базы данных...')

  let sourceData: any[] = MOCK_DATA

  if (process.argv.includes('--from-dump')) {
    const dumpPath = path.join(__dirname, 'dump', 'latest.dump.json')
    try {
      console.log(`🔄 Загрузка данных из файла дампа: ${dumpPath}`)
      const dumpContent = await fs.readFile(dumpPath, 'utf-8')
      sourceData = JSON.parse(dumpContent)
    }
    catch {
      console.error(`❌ Не удалось прочитать файл дампа. Убедитесь, что он существует. Запустите 'bun run db:dump'.`)
      process.exit(1)
    }
  }

  console.log('🗑️  Очистка старых данных...')
  await db.delete(activities)
  await db.delete(days)
  await db.delete(tripImages)
  await db.delete(trips)

  console.log('✈️  Подготовка данных для вставки...')

  const tripsToInsert: (typeof trips.$inferInsert)[] = []
  const daysToInsert: (typeof days.$inferInsert)[] = []
  const activitiesToInsert: (typeof activities.$inferInsert)[] = []
  const imagesToInsert: (typeof tripImages.$inferInsert)[] = []

  for (const tripData of sourceData) {
    const { days: mockDays, images: mockImages, ...tripDetails } = tripData

    tripsToInsert.push({
      ...tripDetails,
      startDate: tripDetails.startDate.split('T')[0],
      endDate: tripDetails.endDate.split('T')[0],
      days: mockDays.length,
    })

    if (mockDays) {
      for (const mockDay of mockDays) {
        const { activities: mockActivities, ...dayDetails } = mockDay
        daysToInsert.push({
          ...dayDetails,
          date: dayDetails.date.split('T')[0],
        })
        if (mockActivities) {
          for (const mockActivity of mockActivities) {
            activitiesToInsert.push(mockActivity)
          }
        }
      }
    }

    if (mockImages) {
      for (const mockImage of mockImages) {
        imagesToInsert.push(mockImage)
      }
    }
  }

  console.log(`✈️  Вставка ${tripsToInsert.length} путешествий, ${daysToInsert.length} дней, ${activitiesToInsert.length} активностей и ${imagesToInsert.length} изображений...`)

  if (tripsToInsert.length > 0)
    await db.insert(trips).values(tripsToInsert)
  if (daysToInsert.length > 0)
    await db.insert(days).values(daysToInsert)
  if (activitiesToInsert.length > 0)
    await db.insert(activities).values(activitiesToInsert)
  if (imagesToInsert.length > 0)
    await db.insert(tripImages).values(imagesToInsert)

  console.log('✅ База данных успешно заполнена!')
  process.exit(0)
}

seed().catch((e) => {
  console.error('❌ Ошибка при заполнении базы данных:', e)
  process.exit(1)
})
