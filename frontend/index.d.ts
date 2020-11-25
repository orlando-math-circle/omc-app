/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'
import { NuxtCookies } from 'cookie-universal-nuxt'
import { Framework } from 'vuetify'
import { User } from '../backend/src/user/user.entity'
import { DTOUser } from './store/users'
import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $avatar: (user: User | DTOUser) => string
    $accessor: typeof accessorType
    $config: NuxtRuntimeConfig
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $avatar: (user: User | DTOUser) => string
    $accessor: typeof accessorType
    $config: NuxtRuntimeConfig
  }

  interface Context {
    $avatar: (user: User | DTOUser) => string
    $vuetify: Framework
    $cookies: NuxtCookies
    $config: NuxtRuntimeConfig
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $avatar: (user: User | DTOUser) => string
    $config: NuxtRuntimeConfig
  }
}
