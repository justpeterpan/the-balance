import { categoriesTable } from '../db/schema'
export default defineEventHandler(async (event) => {
  try {
    console.info(
      `User ${event.context.user?.username} requested all categories available`
    )
    return db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.userId, event.context.user?.id ?? ''))
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
