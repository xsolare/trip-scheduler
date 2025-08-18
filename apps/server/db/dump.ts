/* eslint-disable no-console */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { db } from './index'

async function createDump() {
  console.log('🎬 Начало создания дампа базы данных...')

  try {
    const allTrips = await db.query.trips.findMany({
      with: {
        user: true,
        days: {
          orderBy: (days, { asc }) => [asc(days.date)],
          with: {
            activities: {
              orderBy: (activities, { asc }) => [asc(activities.startTime)],
            },
          },
        },
        images: {
          orderBy: (images, { desc }) => [desc(images.createdAt)],
        },
        memories: {
          orderBy: (memories, { asc }) => [asc(memories.timestamp)],
        },
      },
      orderBy: (trips, { desc }) => [desc(trips.createdAt)],
    })

    console.log(`🔍 Найдено ${allTrips.length} путешествий для дампа.`)

    const serializableData = allTrips.map(trip => ({
      ...trip,
      startDate: trip.startDate,
      endDate: trip.endDate,
      days: trip.days.map(day => ({
        ...day,
        date: day.date,
        activities: day.activities.map(activity => ({
          ...activity,
        })),
      })),
    }))

    const dumpDir = path.join(__dirname, 'dump')
    await fs.mkdir(dumpDir, { recursive: true })
    const dumpFile = path.join(dumpDir, `${new Date().toISOString()}.json`)

    await fs.writeFile(dumpFile, JSON.stringify(serializableData, null, 2))

    console.log(`✅ Дамп успешно создан и сохранен в: ${dumpFile}`)
  }
  catch (error) {
    console.error('❌ Ошибка при создании дампа:', error)
    process.exit(1)
  }
  finally {
    console.log('👋 Завершение работы.')
    process.exit(0)
  }
}

createDump()
