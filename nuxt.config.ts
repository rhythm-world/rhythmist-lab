export default defineNuxtConfig({
  compatibilityDate: '2025-07-24',

  ssr: false,

  modules: [
    '@nuxt/ui-pro',
    '@vueuse/nuxt',
  ],

  css: ['~/app.css'],

  devServer: {
    port: 8618,
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },
});
