export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    })
  }
  console.info(`Logging out user ${event.context.session.userId}, ${event.context.user?.username}`)
  await lucia.invalidateSession(event.context.session.id)
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createBlankSessionCookie().serialize()
  )
})
