import { Argon2id } from 'oslo/password'
import { db, eq } from '../utils/db'

import { usersTable } from '../db/schema'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    throw createError({
      message: 'Try again',
      statusCode: 400,
    })
  }

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

  const existingUser = await db
    .select({
      username: usersTable.username,
      password: usersTable.password,
      id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1)

  if (!existingUser.length)
    throw createError({
      message: 'Incorrect username or password',
      statusCode: 400,
    })

  const validPassword = await new Argon2id().verify(
    existingUser[0].password,
    password
  )

  if (!validPassword) {
    throw createError({
      message: 'Incorrect username or password',
      statusCode: 400,
    })
  }

  const session = await lucia.createSession(existingUser[0].id, {})
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createSessionCookie(session.id).serialize()
  )
})
