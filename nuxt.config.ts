export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/styles/common.scss'],
  typescript: {
    typeCheck: true,
  },
  app: {
    head: {
      title: '待辦事項管理',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
});
