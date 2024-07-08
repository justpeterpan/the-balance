export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  const data = await useRequestFetch()('/user')
  if (data) {
    user.value = data
  }
})
