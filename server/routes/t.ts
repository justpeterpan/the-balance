import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: useRuntimeConfig().openai.apiKey,
})

async function main(url: string, tags: string[]) {
  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Analyse following page ${url} and give me 10 tags (in lowercase) fitting to it in form of a comma-separated list. If one of the already existing tags: ${tags} - is fitting, use one of them. Provide a 2 sentence description of the page based on the content and text of the page. The result should be a stringified object with the structure of {"tags": "tag1, tag2, tag3", "description": "description of site"}.`,
      },
    ],
  })
  return JSON.parse(result?.choices[0]?.message?.content ?? '')
}

export default defineEventHandler(async (event) => {
  const allTags = await $fetch('/tags')
  console.log('allTags', allTags)
  try {
    const { url } = await readBody(event)
    const completion: { tags: string; description: string } = await main(
      url,
      allTags
    )
    return completion
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
