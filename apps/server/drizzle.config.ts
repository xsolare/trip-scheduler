import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://user:password@localhost:5432/trip_scheduler_db',
  },
  verbose: true,
  strict: true,
});
