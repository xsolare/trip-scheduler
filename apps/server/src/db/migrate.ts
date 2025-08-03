import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db } from '.'

// eslint-disable-next-line antfu/no-top-level-await
await migrate(db, { migrationsFolder: './drizzle' })

console.log('Migrations applied successfully!')
process.exit(0)
