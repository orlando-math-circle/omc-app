import { NuxtCookies } from 'cookie-universal-nuxt'
import { Framework } from 'vuetify'

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $vuetify: Framework
  }

  interface Context {
    $vuetify: Framework
    $cookies: NuxtCookies
  }
}
