/* eslint-disable no-console */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import url from 'node:url'
import { db } from './index'
import { activities, days, memories, tripImages, trips } from './schema'

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
 */
async function loadAllMockData(): Promise<any[]> {
  const mockDir = path.join(__dirname, 'mock')
  const allFiles = await fs.readdir(mockDir)
  const mockFiles = allFiles.filter(file => file.endsWith('.ts') && !file.startsWith('_'))

  if (mockFiles.length === 0) {
    return []
  }

  console.log(`🔍 Найдены файлы с моковыми данными: ${mockFiles.join(', ')}`)

  const allMocks = await Promise.all(
    mockFiles.map(async (file) => {
      const filePath = path.join(mockDir, file)
      const module = await import(url.pathToFileURL(filePath).href)
      return module.MOCK_DATA || []
    }),
  )

  return allMocks.flat()
}

async function seed() {
  await copyStaticFiles()
  console.log('🌱 Начало заполнения базы данных...')

  let sourceData: any[] = []

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
  else {
    sourceData = await loadAllMockData()
    if (sourceData.length === 0) {
      console.warn('⚠️ Моковые данные не найдены. Заполнение базы данных пропущено.')
      process.exit(0)
    }
  }

  console.log('🗑️  Очистка старых данных...')
  await db.delete(memories)
  await db.delete(activities)
  await db.delete(days)
  await db.delete(tripImages)
  await db.delete(trips)

  console.log('✈️  Подготовка данных для вставки...')

  const tripsToInsert: (typeof trips.$inferInsert)[] = []
  const daysToInsert: (typeof days.$inferInsert)[] = []
  const activitiesToInsert: (typeof activities.$inferInsert)[] = []
  const imagesToInsert: (typeof tripImages.$inferInsert)[] = []
  const memoriesToInsert: (typeof memories.$inferInsert)[] = []

  for (const tripData of sourceData) {
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
        if (mockActivities) {
          activitiesToInsert.push(...mockActivities)
        }
      }
    }

    if (mockImages) {
      imagesToInsert.push(...mockImages)
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

  console.log(`✈️  Вставка ${tripsToInsert.length} путешествий, ${daysToInsert.length} дней, ${activitiesToInsert.length} активностей, ${imagesToInsert.length} изображений и ${memoriesToInsert.length} воспоминаний...`)

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
