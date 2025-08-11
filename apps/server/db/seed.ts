/* eslint-disable no-console */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { db } from './index'
import { MOCK_DATA } from './mock/01.data'
import { activities, days, memories, tripImages, trips } from './schema'

/**
 * Копирует статические файлы из db/static в /static в корне проекта.
 * Это необходимо, так как моковые данные ссылаются на эти файлы.
 */
async function copyStaticFiles() {
  const sourceDir = path.join(__dirname, 'mock/static')
  const destDir = path.join(process.cwd(), 'static')

  try {
    console.log(`🔄 Копирование статических файлов из ${sourceDir} в ${destDir}...`)

    // Удаляем старую директорию, чтобы обеспечить чистоту
    await fs.rm(destDir, { recursive: true, force: true })
    console.log('🚮 Старая директория static удалена.')

    // Копируем новую
    await fs.cp(sourceDir, destDir, { recursive: true })
    console.log('✅ Статические файлы успешно скопированы.')
  }
  catch (error) {
    // Если исходной папки нет, это не критично, просто выводим предупреждение
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.warn(`⚠️  Исходная директория ${sourceDir} не найдена. Копирование пропущено.`)
    }
    else {
      console.error('❌ Ошибка при копировании статических файлов:', error)
      // В случае серьезной ошибки прерываем выполнение
      process.exit(1)
    }
  }
}

async function seed() {
  // 1. Копируем статические файлы для моков
  await copyStaticFiles()

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
      startDate: tripDetails.startDate.toISOString().split('T')[0],
      endDate: tripDetails.endDate.toISOString().split('T')[0],
      days: mockDays.length,
    })

    if (mockDays) {
      for (const mockDay of mockDays) {
        const { activities: mockActivities, ...dayDetails } = mockDay
        daysToInsert.push({
          ...dayDetails,
          date: dayDetails.date.toISOString().split('T')[0],
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

    if (mockMemories) {
      for (const mockMemory of mockMemories) {
        memoriesToInsert.push(mockMemory)
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
