import { bookmarksTable } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  try {
    const { url, userId, image, title, description } = await readBody(event)
    await db.insert(bookmarksTable).values({ image, title, description, url, userId })
    console.info(`User ${userId} added a bookmark: ${url}`)

    return { message: `${url} successfully added` }
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
