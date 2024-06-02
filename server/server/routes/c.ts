export default defineEventHandler(async (event) => {
  const url = readBody(event)
  console.log(url)
  return url
})
