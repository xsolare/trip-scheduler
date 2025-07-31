import Database from '@tauri-apps/plugin-sql'

let dbInstance: Database | null = null

export async function getDb(): Promise<Database> {
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
    console.error('Failed to load database:', error)
    throw error
  }
}
