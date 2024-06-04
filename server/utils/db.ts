import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

const sqlite = new Database('sqlite.db', { fileMustExist: true })
const db = drizzle(sqlite)

export { eq, and, or } from 'drizzle-orm'
export { db }
