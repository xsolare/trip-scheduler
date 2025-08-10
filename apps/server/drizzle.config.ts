import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // eslint-disable-next-line node/prefer-global/process
    url: `${process.env.DATABASE_URL}`,
  },
  verbose: true,
  strict: true,
})
