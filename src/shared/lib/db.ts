import type { Activity, Day } from '../types/models/activity'
import type { Trip } from '../types/models/trip'
import Database from '@tauri-apps/plugin-sql'

// Синглтон для БД
let dbInstance: Database | null = null

// Получение инстанса БД
async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance
  }

  try {
    dbInstance = await Database.load('sqlite:trip-scheduler.db')
    // eslint-disable-next-line no-console
    console.log('Database connected successfully')
    return dbInstance
  }
  catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }
}

// Логирование операций для синхронизации
async function logOperation(tableName: string, recordId: string, operation: 'CREATE' | 'UPDATE' | 'DELETE'): Promise<void> {
  const db = await getDb()
  await db.execute(
    'INSERT INTO sync_log (table_name, record_id, operation) VALUES ($1, $2, $3)',
    [tableName, recordId, operation],
  )
}

// === TRIPS ===
export async function getAllTrips(): Promise<Trip[]> {
  const db = await getDb()
  const trips = await db.select<Trip[]>('SELECT * FROM trips ORDER BY start_date DESC')
  return trips || []
}

export async function createTrip(trip: Omit<Trip, 'createdAt' | 'updatedAt'>): Promise<void> {
  const db = await getDb()
  const now = new Date().toISOString()

  await db.execute(
    `INSERT INTO trips (id, title, description, image_url, start_date, end_date, created_at, updated_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [trip.id, trip.title, trip.description, trip.imageUrl, trip.startDate, trip.endDate, now, now],
  )

  await logOperation('trips', trip.id, 'CREATE')
}

export async function updateTrip(trip: Partial<Trip> & { id: string }): Promise<void> {
  const db = await getDb()
  const now = new Date().toISOString()

  // Динамическое построение UPDATE запроса
  const fields = Object.keys(trip).filter(key => key !== 'id').map(key => `${key} = ?`).join(', ')
  const values = Object.keys(trip).filter(key => key !== 'id').map(key => trip[key as keyof Trip])

  if (fields.length > 0) {
    await db.execute(
      `UPDATE trips SET ${fields}, updated_at = ? WHERE id = ?`,
      [...values, now, trip.id],
    )
    await logOperation('trips', trip.id, 'UPDATE')
  }
}

// === DAYS ===
export async function getDaysForTrip(tripId: string): Promise<Day[]> {
  const db = await getDb()
  const days = await db.select<Day[]>('SELECT * FROM days WHERE trip_id = $1 ORDER BY date ASC', [tripId])

  // Загружаем активности для каждого дня
  for (const day of days || []) {
    day.activities = await getActivitiesForDay(day.id)
  }

  return days || []
}

export async function createDay(day: Omit<Day, 'activities' | 'createdAt' | 'updatedAt'>, tripId: string): Promise<void> {
  const db = await getDb()
  const now = new Date().toISOString()

  await db.execute(
    'INSERT INTO days (id, trip_id, date, title, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [day.id, tripId, day.date, day.title, day.description, now, now],
  )

  await logOperation('days', day.id, 'CREATE')
}

// === ACTIVITIES ===
export async function getActivitiesForDay(dayId: string): Promise<Activity[]> {
  const db = await getDb()
  const activities = await db.select<Activity[]>('SELECT * FROM activities WHERE day_id = $1 ORDER BY "order" ASC', [dayId])
  return activities || []
}

export async function createActivity(activity: Activity, dayId: string, order: number): Promise<void> {
  const db = await getDb()
  const now = new Date().toISOString()

  await db.execute(
    'INSERT INTO activities (id, day_id, title, start_time, end_time, "order", created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [activity.id, dayId, activity.title, activity.startTime, activity.endTime, order, now, now],
  )

  await logOperation('activities', activity.id, 'CREATE')
}

export async function updateActivity(activity: Activity): Promise<void> {
  const db = await getDb()
  const now = new Date().toISOString()

  await db.execute(
    'UPDATE activities SET title = $1, start_time = $2, end_time = $3, updated_at = $4 WHERE id = $5',
    [activity.title, activity.startTime, activity.endTime, now, activity.id],
  )

  await logOperation('activities', activity.id, 'UPDATE')
}

export async function deleteActivity(activityId: string): Promise<void> {
  const db = await getDb()
  await db.execute('DELETE FROM activities WHERE id = $1', [activityId])
  await logOperation('activities', activityId, 'DELETE')
}

// === СИНХРОНИЗАЦИЯ ===
export async function getUnsyncedChanges(): Promise<Array<{
  id: number
  tableName: string
  recordId: string
  operation: string
  timestamp: string
}>> {
  const db = await getDb()
  return db.select('SELECT * FROM sync_log WHERE synced = 0 ORDER BY timestamp ASC') || []
}

export async function markAsSynced(logIds: number[]): Promise<void> {
  if (logIds.length === 0)
    return

  const db = await getDb()
  const placeholders = logIds.map(() => '?').join(',')
  await db.execute(`UPDATE sync_log SET synced = 1 WHERE id IN (${placeholders})`, logIds)
}

// Проверка подключения к БД
export async function testDbConnection(): Promise<boolean> {
  try {
    const db = await getDb()
    await db.select('SELECT 1')
    return true
  }
  catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
