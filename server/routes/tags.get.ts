import { bookmarksTable } from '../db/schema'

export default defineEventHandler(async (event) => {
  try {
    console.info(
      `User ${event.context.user?.username} requested all tags available`
    )
    const tagRows = await db
      .select({ tags: bookmarksTable.tags })
      .from(bookmarksTable)
      .where(eq(bookmarksTable.userId, event.context.user?.id ?? ''))
    const uniqueTags = new Set<string>()
    tagRows.forEach((row) => {
      if (row.tags) {
        const arr = row.tags.split(',').map((tag) => tag.trim())
        arr.forEach((tag) => uniqueTags.add(tag))
      }
    })
    return Array.from(uniqueTags)
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
