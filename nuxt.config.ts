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
  modules: ['@nuxt/ui'],
})
