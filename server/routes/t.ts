import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: useRuntimeConfig().openai.apiKey,
})

async function main(url: string) {
  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Analyse following page ${url} and give me 10 tags fitting to it in form of an array back. Do not write anything else, just the array.`,
      },
    ],
  })
  console.log(result.choices[0]?.message.content)
  return result.choices[0]?.message.content
}

export default defineEventHandler(async (event) => {
  try {
    const { url } = await readBody(event)
    const completion = await main(url)
    return completion
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
