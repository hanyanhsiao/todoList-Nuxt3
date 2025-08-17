export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false, // 暫時禁用 SSR 以避免 localStorage 問題
  css: ['~/assets/styles/common.css'],
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
