export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  console.log(url)
  return url
})
