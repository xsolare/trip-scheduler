/* eslint-disable no-console */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { FREE_PLAN_ID, ONE_GIGABYTE_IN_BYTES } from '~/lib/constants'
import { db } from './index'
import {
  activities,
  comments,
  communities,
  communityMembers,
  days,
  memories,
  plans,
  tripImages,
  tripParticipants,
  trips,
  tripSections,
  users,
} from './schema'

/**
 * Находит самый последний по времени создания файл дампа в директории db/dump.
 * @returns Полный путь к файлу или null, если файлы не найдены.
 */
async function getLatestDumpFile(): Promise<string | null> {
  const dumpDir = path.join(__dirname, 'dump')
  try {
    const allFiles = await fs.readdir(dumpDir)
    const jsonFiles = allFiles
      .filter(file => file.endsWith('.json'))
      .sort()

    if (jsonFiles.length === 0)
      return null

    return path.join(dumpDir, jsonFiles[jsonFiles.length - 1])
  }
  catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      return null
    throw error
  }
}

async function seedFromJson() {
  console.log('🌱 Начало заполнения базы данных из JSON дампа...')

  const filePathArg = process.argv[2]
  let dumpFile: string | null

  if (filePathArg) {
    dumpFile = path.resolve(process.cwd(), filePathArg)
    console.log(`🔍 Используется указанный файл дампа: ${dumpFile}`)
  }
  else {
    dumpFile = await getLatestDumpFile()
    if (!dumpFile) {
      console.error('❌ Не найдены файлы дампа в директории `db/dump`.')
      console.log('ℹ️  Сначала создайте дамп с помощью команды `bun run db:dump`.')
      process.exit(1)
    }
    console.log(`🔍 Найден последний файл дампа: ${path.basename(dumpFile)}`)
  }

  let dumpData
  try {
    const fileContent = await fs.readFile(dumpFile, 'utf-8')
    dumpData = JSON.parse(fileContent)
  }
  catch (error) {
    console.error(`❌ Ошибка при чтении или парсинге файла дампа ${dumpFile}:`, error)
    process.exit(1)
  }

  const { users: sourceUsers, communities: sourceCommunities, communityMembers: sourceMembers, trips: sourceTrips } = dumpData

  if (!Array.isArray(sourceTrips) || !Array.isArray(sourceUsers)) {
    console.warn('⚠️ Файл дампа имеет неверный формат. Заполнение базы данных пропущено.')
    process.exit(0)
  }

  console.log('🗑️  Очистка старых данных...')
  // Порядок важен из-за foreign keys
  await db.delete(memories)
  await db.delete(activities)
  await db.delete(days)
  await db.delete(comments)
  await db.delete(tripSections)
  await db.delete(tripImages)
  await db.delete(tripParticipants)
  await db.delete(trips)
  await db.delete(communityMembers)
  await db.delete(communities)
  await db.delete(users)
  await db.delete(plans)

  console.log('⭐ Создание тарифных планов...')
  await db.insert(plans).values([
    { id: FREE_PLAN_ID, name: 'Базовый', maxTrips: 1, maxStorageBytes: ONE_GIGABYTE_IN_BYTES, monthlyLlmCredits: 100000, isDeveloping: false },
    { id: 2, name: 'Про', maxTrips: 10, maxStorageBytes: 20 * ONE_GIGABYTE_IN_BYTES, monthlyLlmCredits: 1000000, isDeveloping: false },
    { id: 3, name: 'Командный', maxTrips: 999, maxStorageBytes: 100 * ONE_GIGABYTE_IN_BYTES, monthlyLlmCredits: 5000000, isDeveloping: true },
  ])

  console.log('✈️  Подготовка данных для вставки...')

  if (sourceUsers.length > 0) {
    console.log(`👤 Вставка ${sourceUsers.length} пользователей...`)
    await db.insert(users).values(sourceUsers)
  }

  if (sourceCommunities.length > 0) {
    console.log(`🏘️  Вставка ${sourceCommunities.length} сообществ...`)
    await db.insert(communities).values(sourceCommunities)
  }

  if (sourceMembers.length > 0) {
    console.log(`👥 Вставка ${sourceMembers.length} участников сообществ...`)
    await db.insert(communityMembers).values(sourceMembers)
  }

  const tripsToInsert: (typeof trips.$inferInsert)[] = []
  const daysToInsert: (typeof days.$inferInsert)[] = []
  const activitiesToInsert: (typeof activities.$inferInsert)[] = []
  const imagesToInsert: (typeof tripImages.$inferInsert)[] = []
  const memoriesToInsert: (typeof memories.$inferInsert)[] = []
  const sectionsToInsert: (typeof tripSections.$inferInsert)[] = []
  const participantsToInsert: (typeof tripParticipants.$inferInsert)[] = []

  for (const tripData of sourceTrips) {
    const { days: tripDays, images: tripImagesData, memories: tripMemories, sections, participants, ...tripDetails } = tripData

    tripsToInsert.push({
      ...tripDetails,
      startDate: new Date(tripDetails.startDate).toISOString().split('T')[0],
      endDate: new Date(tripDetails.endDate).toISOString().split('T')[0],
      createdAt: new Date(tripDetails.createdAt),
      updatedAt: new Date(tripDetails.updatedAt),
    })

    if (sections)
      sectionsToInsert.push(...sections)

    if (participants)
      participantsToInsert.push(...participants)

    if (tripDays) {
      for (const day of tripDays) {
        const { activities: dayActivities, ...dayDetails } = day
        daysToInsert.push({
          ...dayDetails,
          date: new Date(day.date).toISOString().split('T')[0],
          createdAt: new Date(dayDetails.createdAt),
          updatedAt: new Date(dayDetails.updatedAt),
        })
        if (dayActivities)
          activitiesToInsert.push(...dayActivities)
      }
    }

    if (tripImagesData) {
      imagesToInsert.push(...tripImagesData.map((image: any) => ({
        ...image,
        createdAt: image.createdAt ? new Date(image.createdAt) : new Date(),
        takenAt: image.takenAt ? new Date(image.takenAt) : null,
      })))
    }

    if (tripMemories) {
      memoriesToInsert.push(...tripMemories.map((memory: any) => ({
        ...memory,
        timestamp: memory.timestamp ? new Date(memory.timestamp) : null,
        createdAt: memory.createdAt ? new Date(memory.createdAt) : new Date(),
        updatedAt: memory.updatedAt ? new Date(memory.updatedAt) : new Date(),
      })))
    }
  }

  console.log(`✈️  Вставка ${tripsToInsert.length} путешествий и всех связанных данных...`)

  if (tripsToInsert.length > 0)
    await db.insert(trips).values(tripsToInsert)
  if (sectionsToInsert.length > 0)
    await db.insert(tripSections).values(sectionsToInsert)
  if (participantsToInsert.length > 0)
    await db.insert(tripParticipants).values(participantsToInsert)
  if (daysToInsert.length > 0)
    await db.insert(days).values(daysToInsert)
  if (imagesToInsert.length > 0)
    await db.insert(tripImages).values(imagesToInsert)
  if (activitiesToInsert.length > 0)
    await db.insert(activities).values(activitiesToInsert)
  if (memoriesToInsert.length > 0)
    await db.insert(memories).values(memoriesToInsert)

  console.log('✅ База данных успешно заполнена из JSON дампа!')
  process.exit(0)
}

seedFromJson().catch((e) => {
  console.error('❌ Ошибка при заполнении базы данных из JSON:', e)
  process.exit(1)
})
