/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'
import { NuxtCookies } from 'cookie-universal-nuxt'
import { Framework } from 'vuetify'
import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $config: NuxtRuntimeConfig
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $config: NuxtRuntimeConfig
  }

  interface Context {
    $vuetify: Framework
    $cookies: NuxtCookies
    $config: NuxtRuntimeConfig
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $config: NuxtRuntimeConfig
  }
}
