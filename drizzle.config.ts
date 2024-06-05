import type { Config } from 'drizzle-kit'
import dotenv from 'dotenv'
dotenv.config()

export default {
  out: './server/db/migrations',
  schema: './server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config
