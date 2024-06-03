import { Lucia } from 'lucia'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from './db'

import { sessionsTable, usersTable, type User } from '../db/schema'

const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      username: attributes.username,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    UserAttributes: Omit<User, 'id'>
  }
}
