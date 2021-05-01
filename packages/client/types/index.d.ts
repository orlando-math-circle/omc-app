import { NuxtCookies } from 'cookie-universal-nuxt'
import { Framework } from 'vuetify'
import { User } from '@server/src/user/user.entity'
import { accessorType } from '~/store'
import { DTOUser } from '~/store/users'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $vuetify: Framework
    $accessor: typeof accessorType
  }

  interface Context {
    $accessor: typeof accessorType
    $vuetify: Framework
    $cookies: NuxtCookies
  }
}
