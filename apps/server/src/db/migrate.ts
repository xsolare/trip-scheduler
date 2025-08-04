/* eslint-disable antfu/no-top-level-await */
/* eslint-disable no-console */
/* eslint-disable node/prefer-global/process */
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db } from '.'

await migrate(db, { migrationsFolder: './drizzle' })

console.log('Migrations applied successfully!')
process.exit(0)
