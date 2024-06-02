import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  const site = await $fetch<string>(url)
  return getMetaInfo(site)
})

function getMetaInfo(site: string) {
  const $ = cheerio.load(site)

  const i = $('meta[property="og:image"]').attr('content')
  const d = $('meta[property="og:description"]').attr('content')
  const t = $('meta[property="og:title"]').attr('content')

  return { i, d, t }
}
