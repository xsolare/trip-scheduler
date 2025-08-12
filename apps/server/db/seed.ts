/* eslint-disable no-console */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import url from 'node:url'
import { db } from './index'
import { activities, days, memories, tripImages, trips, users } from './schema'

async function copyStaticFiles() {
  const sourceDir = path.join(__dirname, 'mock/static')
  const destDir = path.join(process.cwd(), 'static')

  try {
    console.log(`🔄 Копирование статических файлов из ${sourceDir} в ${destDir}...`)
    await fs.rm(destDir, { recursive: true, force: true })
    console.log('🚮 Старая директория static удалена.')
    await fs.cp(sourceDir, destDir, { recursive: true })
    console.log('✅ Статические файлы успешно скопированы.')
  }
  catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      console.warn(`⚠️  Исходная директория ${sourceDir} не найдена. Копирование пропущено.`)
    else
      console.error('❌ Ошибка при копировании статических файлов:', error)
  }
}

/**
 * Динамическая загрузка всех моковых данных из папки /mock.
 * Загружает и разделяет данные на пользователей и путешествия.
 */
async function loadAllMockData() {
  const mockDir = path.join(__dirname, 'mock')
  const allFiles = await fs.readdir(mockDir)
  const mockFiles = allFiles.filter(file => file.endsWith('.ts') && !file.startsWith('_')).sort()

  if (mockFiles.length === 0) {
    return { users: [], trips: [] }
  }

  console.log(`🔍 Найдены файлы с моковыми данными: ${mockFiles.join(', ')}`)

  const allUsers: any[] = []
  const allTrips: any[] = []

  for (const file of mockFiles) {
    const filePath = path.join(mockDir, file)
    const module = await import(url.pathToFileURL(filePath).href)
    // Разделяем данные по типу, чтобы вставлять их в правильном порядке
    if (module.MOCK_USER_DATA)
      allUsers.push(...module.MOCK_USER_DATA)
    if (module.MOCK_DATA)
      allTrips.push(...module.MOCK_DATA)
  }

  return { users: allUsers, trips: allTrips }
}

async function seed() {
  await copyStaticFiles()
  console.log('🌱 Начало заполнения базы данных...')

  const { users: usersToInsert, trips: sourceTrips } = await loadAllMockData()

  if (usersToInsert.length === 0 && sourceTrips.length === 0) {
    console.warn('⚠️ Моковые данные не найдены. Заполнение базы данных пропущено.')
    process.exit(0)
  }

  console.log('🗑️  Очистка старых данных...')
  await db.delete(memories)
  await db.delete(activities)
  await db.delete(days)
  await db.delete(tripImages)
  await db.delete(trips)
  await db.delete(users)

  console.log('✈️  Подготовка данных для вставки...')

  const tripsToInsert: (typeof trips.$inferInsert)[] = []
  const daysToInsert: (typeof days.$inferInsert)[] = []
  const activitiesToInsert: (typeof activities.$inferInsert)[] = []
  const imagesToInsert: (typeof tripImages.$inferInsert)[] = []
  const memoriesToInsert: (typeof memories.$inferInsert)[] = []

  for (const tripData of sourceTrips) {
    const { days: mockDays, images: mockImages, memories: mockMemories, ...tripDetails } = tripData

    tripsToInsert.push({
      ...tripDetails,
      startDate: new Date(tripDetails.startDate).toISOString().split('T')[0],
      endDate: new Date(tripDetails.endDate).toISOString().split('T')[0],
    })

    if (mockDays) {
      for (const mockDay of mockDays) {
        const { activities: mockActivities, ...dayDetails } = mockDay
        daysToInsert.push({
          ...dayDetails,
          date: new Date(mockDay.date).toISOString().split('T')[0],
        })
        if (mockActivities)
          activitiesToInsert.push(...mockActivities)
      }
    }

    if (mockImages)
      imagesToInsert.push(...mockImages)

    if (mockMemories) {
      for (const mockMemory of mockMemories) {
        memoriesToInsert.push({
          ...mockMemory,
          timestamp: mockMemory.timestamp ? new Date(mockMemory.timestamp) : null,
        })
      }
    }
  }

  console.log(`✈️  Вставка ${usersToInsert.length} пользователей, ${tripsToInsert.length} путешествий, ${daysToInsert.length} дней, ${activitiesToInsert.length} активностей, ${imagesToInsert.length} изображений и ${memoriesToInsert.length} воспоминаний...`)

  // Вставка в правильном порядке для соблюдения foreign key constraints
  if (usersToInsert.length > 0)
    await db.insert(users).values(usersToInsert)
  if (tripsToInsert.length > 0)
    await db.insert(trips).values(tripsToInsert)
  if (daysToInsert.length > 0)
    await db.insert(days).values(daysToInsert)
  if (imagesToInsert.length > 0)
    await db.insert(tripImages).values(imagesToInsert)
  if (activitiesToInsert.length > 0)
    await db.insert(activities).values(activitiesToInsert)
  if (memoriesToInsert.length > 0)
    await db.insert(memories).values(memoriesToInsert)

  console.log('✅ База данных успешно заполнена!')
  process.exit(0)
}

seed().catch((e) => {
  console.error('❌ Ошибка при заполнении базы данных:', e)
  process.exit(1)
})
