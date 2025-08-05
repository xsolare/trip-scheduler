import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: 'postgresql://trip-scheduler:trip-scheduler@localhost:5432/trip_scheduler_dev',
})

export const db = drizzle(pool, { schema })
