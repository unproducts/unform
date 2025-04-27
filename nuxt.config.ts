// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxtjs/tailwindcss', 'nuxt-auth-utils'],
  css: ['~/assets/css/main.css'],
  fonts: {
    families: [
      {
        name: 'Outfit',
        weights: [300, 400, 500, 600, 700],
      },
      {
        name: 'Plus Jakarta Sans',
        weights: [400, 500, 600, 700, 800],
      },
    ],
  },
  ssr: false,
  nitro: {
    imports: {
      dirs: ['server/utils/**/*.ts'],
    },
  },
  app: {
    head: {
      title: 'Unform - Form Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A simple form management solution' },
      ],
    },
  },
  runtimeConfig: {
    db: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgrespw',
      database: 'unform',
    },
  },
});
