import { resolve } from 'path'
import { NuxtConfig } from '@nuxt/types'
import { VuetifyLoaderPlugin } from 'vuetify-loader'

const config: NuxtConfig = {
  ssr: true,
  srcDir: 'src/',
  buildDir: 'dist/',
  server: {
    port: process.env.PORT || 9000,
  },
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
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Spartan:wght@700&family=Quicksand:wght@400;500;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
      },
    ],
  },
  publicRuntimeConfig: {
    paypalClientId: process.env.PAYPAL_CLIENT_ID || 'sb',
    staticBase: process.env.STATIC_BASE || 'http://localhost:3000',
    avatarBase: process.env.AVATAR_BASE || '/defaults/avatars',
  },
  loading: { color: '#44d9e6' },
  plugins: [
    '~/plugins/error',
    '~/plugins/pinia',
    '~/plugins/auth',
    '~/plugins/vuetify',
    '~/plugins/vee-validate',
    '~/plugins/background',
    {
      src: '~/plugins/apex-charts',
      ssr: false,
    },
  ],
  components: ['~/components', '~/components/inputs'],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    '@nuxt/postcss8',
    'pinia/nuxt',
  ],
  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],
  axios: {
    baseURL: process.env.AXIOS_BASE_URL || 'http://localhost:3000/',
    browserBaseURL: process.env.AXIOS_BROWSER_BASE_URL || undefined,
    proxyHeaders: false,
  },
  typescript: {
    typeCheck: false,
  },
  cli: {
    bannerColor: 'magenta',
    badgeMessages: ['Orlando Math Circle'],
  },
  alias: {
    '@server': resolve(__dirname, '../server/src'),
    '@shared': resolve(__dirname, '../shared/src'),
  },
  build: {
    parallel: true,
    transpile: ['vuetify/lib', 'vee-validate/dist/rules'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      sass: {
        // @ts-ignore Outdated @types/sass-loader
        additionalData: "@import '~assets/styles/variables.scss'",
      },
    },
  },
  vue: {
    config: {
      devtools:
        process.env.NODE_ENV === 'development' ||
        process.env.DEVTOOLS === 'true',
      productionTip: false,
    },
  },
}

export default config
