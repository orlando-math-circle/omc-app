import { NuxtCookies } from 'cookie-universal-nuxt'
import { Framework } from 'vuetify'
import { User } from '@server/src/user/user.entity'
import { accessorType } from '~/store'
import { DTOUser } from '~/store/users'

declare module 'vue/types/vue' {
  interface Vue {
    $avatar: (user: User | DTOUser) => string
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $avatar: (user: User | DTOUser) => string
    $vuetify: Framework
    $accessor: typeof accessorType
  }

  interface Context {
    $avatar: (user: User | DTOUser) => string
    $accessor: typeof accessorType
    $vuetify: Framework
    $cookies: NuxtCookies
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $avatar: (user: User | DTOUser) => string
  }
}
