import { NuxtConfig } from '@nuxt/types'
// @ts-ignore
import { VuetifyLoaderPlugin } from 'vuetify-loader'

const config: NuxtConfig = {
  ssr: true,

  server: {
    port: 8080,
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s · OMC',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'dns-prefetch',
        href: '//fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Spartan:wght@700&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
      },
    ],
  },

  publicRuntimeConfig: {
    paypalClientId: process.env.PAYPAL_CLIENT_ID || 'sb',
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#44d9e6' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vuetify', '~/plugins/vee-validate', '~/plugins/axios'],
  /**
   * Automatic importing of components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/eslint-module',
    '@nuxtjs/color-mode',
    'nuxt-typed-vuex',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    'cookie-universal-nuxt',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://localhost:3030/',
    proxyHeaders: false,
  },

  vue: {
    config: {
      productionTip: false,
    },
  },

  build: {
    parallel: true,
    transpile: ['vuetify/lib', 'vee-validate/dist/rules'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          fiber: require('fibers'),
          indentedSyntax: true,
        },
        additionalData: "@import '@/assets/variables.scss'",
      },
    },
  },
}

export default config
