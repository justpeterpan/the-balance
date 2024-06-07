import { categoriesTable } from '../db/schema'
export default defineEventHandler(async (event) => {
  try {
    const { name, userId, icon } = await readBody(event)
    await db.insert(categoriesTable).values({ name, userId, icon })
    return { message: `${name} successfully added` }
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
