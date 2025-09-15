/* eslint-disable no-console */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import url from 'node:url'
import { FREE_PLAN_ID, ONE_GIGABYTE_IN_BYTES } from '~/lib/constants'
import { db } from './index'
import {
  activities,
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
    return { users: [], trips: [], communities: [], members: [] }
  }

  console.log(`🔍 Найдены файлы с моковыми данными: ${mockFiles.join(', ')}`)

  const allUsers: any[] = []
  const allTrips: any[] = []
  const allCommunities: any[] = []
  const allCommunityMembers: any[] = []

  for (const file of mockFiles) {
    const filePath = path.join(mockDir, file)
    const module = await import(url.pathToFileURL(filePath).href)
    if (module.MOCK_USER_DATA)
      allUsers.push(...module.MOCK_USER_DATA)
    if (module.MOCK_DATA)
      allTrips.push(...module.MOCK_DATA)
    if (module.MOCK_COMMUNITIES_DATA)
      allCommunities.push(...module.MOCK_COMMUNITIES_DATA)
    if (module.MOCK_COMMUNITY_MEMBERS_DATA)
      allCommunityMembers.push(...module.MOCK_COMMUNITY_MEMBERS_DATA)
  }

  return { users: allUsers, trips: allTrips, communities: allCommunities, members: allCommunityMembers }
}

async function seed() {
  await copyStaticFiles()
  console.log('🌱 Начало заполнения базы данных...')

  const { users: usersToInsert, trips: sourceTrips, communities: communitiesToInsert, members: membersToInsert } = await loadAllMockData()

  if (usersToInsert.length === 0 && sourceTrips.length === 0 && communitiesToInsert.length === 0) {
    console.warn('⚠️ Моковые данные не найдены. Заполнение базы данных пропущено.')
    process.exit(0)
  }

  console.log('🗑️  Очистка старых данных...')
  await db.delete(memories)
  await db.delete(activities)
  await db.delete(days)
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
    { id: FREE_PLAN_ID, name: 'Базовый', maxTrips: 1, maxStorageBytes: ONE_GIGABYTE_IN_BYTES, isDeveloping: false },
    { id: 2, name: 'Про', maxTrips: 10, maxStorageBytes: 20 * ONE_GIGABYTE_IN_BYTES, isDeveloping: false },
    { id: 3, name: 'Командный', maxTrips: 999, maxStorageBytes: 100 * ONE_GIGABYTE_IN_BYTES, isDeveloping: true },
  ])

  console.log('✈️  Подготовка данных для вставки...')

  const tripsToInsert: (typeof trips.$inferInsert)[] = []
  const daysToInsert: (typeof days.$inferInsert)[] = []
  const activitiesToInsert: (typeof activities.$inferInsert)[] = []
  const imagesToInsert: (typeof tripImages.$inferInsert)[] = []
  const memoriesToInsert: (typeof memories.$inferInsert)[] = []
  const participantsToInsert: (typeof tripParticipants.$inferInsert)[] = []
  const sectionsToInsert: (typeof tripSections.$inferInsert)[] = []

  for (const tripData of sourceTrips) {
    const {
      days: mockDays,
      images: mockImages,
      memories: mockMemories,
      participantIds,
      sections: mockSections,
      ...tripDetails
    } = tripData

    tripsToInsert.push({
      ...tripDetails,
      startDate: new Date(tripDetails.startDate).toISOString().split('T')[0],
      endDate: new Date(tripDetails.endDate).toISOString().split('T')[0],
    })

    const allParticipantIds = new Set(participantIds || [])
    allParticipantIds.add(tripDetails.userId)

    for (const userId of allParticipantIds) {
      participantsToInsert.push({
        tripId: tripDetails.id,
        userId: userId as string,
      })
    }

    if (mockSections)
      sectionsToInsert.push(...mockSections)

    if (mockDays) {
      for (const mockDay of mockDays) {
        const { activities: mockActivities, ...dayDetails } = mockDay

        daysToInsert.push({
          ...dayDetails,
          date: new Date(dayDetails.date).toISOString().split('T')[0],
          meta: dayDetails.meta ?? [],
          createdAt: dayDetails.createdAt ? new Date(dayDetails.createdAt) : new Date(),
          updatedAt: dayDetails.updatedAt ? new Date(dayDetails.updatedAt) : new Date(),
        })

        if (mockActivities) {
          activitiesToInsert.push(...mockActivities)
        }
      }
    }

    if (mockImages) {
      const processedImages = mockImages.map((image: any) => ({
        ...image,
        // Если originalName не указан, извлекаем его из URL
        originalName: image.originalName || image.url.split('/').pop(),
      }))
      imagesToInsert.push(...processedImages)
    }

    if (mockMemories) {
      for (const mockMemory of mockMemories) {
        memoriesToInsert.push({
          ...mockMemory,
          timestamp: mockMemory.timestamp ? new Date(mockMemory.timestamp) : null,
        })
      }
    }
  }

  console.log(`✈️  Вставка ${usersToInsert.length} пользователей, ${tripsToInsert.length} путешествий, ${communitiesToInsert.length} сообществ...`)

  // Вставка в правильном порядке для соблюдения foreign key constraints
  if (usersToInsert.length > 0)
    await db.insert(users).values(usersToInsert.map(u => ({ ...u, planId: FREE_PLAN_ID })))

  if (communitiesToInsert.length > 0) {
    console.log(`🏘️  Вставка ${communitiesToInsert.length} сообществ и ${membersToInsert.length} участников...`)
    await db.insert(communities).values(communitiesToInsert)
    await db.insert(communityMembers).values(membersToInsert)
  }

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

  console.log('✅ База данных успешно заполнена!')
  process.exit(0)
}

seed().catch((e) => {
  console.error('❌ Ошибка при заполнении базы данных:', e)
  process.exit(1)
})
