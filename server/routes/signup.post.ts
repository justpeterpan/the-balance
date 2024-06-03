import { Argon2id } from 'oslo/password'
import { db } from '../utils/db'
import { generateId } from 'lucia'
import { SqliteError } from 'better-sqlite3'
import { usersTable } from '../db/schema'

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const username = formData.get('username')

  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    throw createError({
      message: 'Invalid username',
      statusCode: 400,
    })
  }

  const password = formData.get('password')
  if (
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 255
  ) {
    throw createError({
      message: 'Invalid password',
      statusCode: 400,
    })
  }

  const hashedPassword = await new Argon2id().hash(password)
  const userId = generateId(15)

  try {
    db.insert(usersTable)
      .values({
        id: userId,
        username,
        password: hashedPassword,
      })
      .returning()
      .get()
    const session = await lucia.createSession(userId, {})
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize()
    )
  } catch (e) {
    if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        message: 'Try again',
        statusCode: 500,
      })
    }
    throw createError({
      message: 'Unknown error occurred',
      statusCode: 500,
    })
  }
})
