import { NuxtCookies } from 'cookie-universal-nuxt'
import { Framework } from 'vuetify'
import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }

  interface Context {
    $vuetify: Framework
    $cookies: NuxtCookies
  }
}
