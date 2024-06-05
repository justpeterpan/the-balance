// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: {
    typedPages: true,
  },
  nitro: {
    experimental: {
      database: true,
    },
  },
  runtimeConfig: {
    dbCredentials: {
      url: process.env.DATABASE_URL,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  },
  modules: ['@nuxt/ui'],
})
