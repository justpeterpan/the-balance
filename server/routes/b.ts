import { bookmarksTable } from '../db/schema'

export default defineEventHandler(async (event) => {
  try {
    console.info(`User ${event.context.user?.username} requested their bookmarks`)
    return db
      .select()
      .from(bookmarksTable)
      .where(eq(bookmarksTable.userId, event.context.user?.id ?? ''))
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
