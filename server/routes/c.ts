import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  try {
    const { url } = await readBody(event)
    const site = await $fetch<string>(url)

    const newBookmark = getMetaInfo(site)

    return { i: newBookmark.image,t: newBookmark.title, d: newBookmark.description }
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})

function getMetaInfo(site: string) {
  const $ = cheerio.load(site)

  const image = $('meta[property="og:image"]').attr('content') ?? 'no image found'
  const description = $('meta[property="og:description"]').attr('content') ?? 'no description found'
  const title = $('meta[property="og:title"]').attr('content') ?? 'no title found'

  return { image, description, title }
}
