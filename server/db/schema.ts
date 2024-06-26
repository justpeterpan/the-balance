import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const bookmarksTable = sqliteTable('bookmarks', {
  id: integer('id').primaryKey(),
  url: text('url').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  image: text('image').notNull(),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  tags: text('tags').default('[]'),
})

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
})

export const sessionsTable = sqliteTable('sessions', {
  id: text('id').primaryKey().notNull(),
  expiresAt: integer('expires_at').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
})

export const categoriesTable = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  icon: text('icon'),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
})

export interface User {
  id: string
  username: string
  password: string
}
