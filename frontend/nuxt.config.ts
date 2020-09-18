import { NuxtConfig } from '@nuxt/types'
import { VuetifyLoaderPlugin } from 'vuetify-loader'

const config: NuxtConfig = {
  mode: 'universal',

  server: {
    port: 8000,
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - OMC',
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
          'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900',
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
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vuetify', '~/plugins/vee-validate'],
  /**
   * Automatic importing of components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/color-mode'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://localhost:3030/',
  },

  auth: {
    redirect: {
      home: '/landing',
    },
    strategies: {
      local: {
        token: {
          property: 'token',
        },
        user: {
          autoFetch: true,
          property: false,
        },
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: false,
          user: { url: '/user/me', method: 'get' },
        },
      },
    },
  },

  build: {
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
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient && config.module) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
}

export default config
