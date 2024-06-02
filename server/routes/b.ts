import { bookmarksTable } from '../db/schema'

export default defineEventHandler(async (event) => {
  try {
    return db.select().from(bookmarksTable)
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
