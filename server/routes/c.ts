import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  try {
    const { url } = await readBody(event)
    const site = await $fetch<string>(url)

    const newBookmark = getMetaInfo(site)
    console.info(`User ${event.context.user?.username} added a bookmark: ${url}`)

    return { i: newBookmark.image,t: newBookmark.title, d: newBookmark.description }
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})

function getMetaInfo(site: string) {
  const $ = cheerio.load(site)

  // todo take screenshot of site if no image found
  const image = $('meta[property="og:image"]').attr('content') ?? 'no image found'
  // todo summarize content and generate description if no description found
  const description = $('meta[property="og:description"]').attr('content') ?? 'no description found'
  const title = $('meta[property="og:title"]').attr('content') ?? $('title').text()
  // todo grab favicon

  return { image, description, title }
}
