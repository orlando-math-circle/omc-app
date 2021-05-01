/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { User } from '@server/user/user.entity'

type avatarType = (user: User) => string
declare module 'vue/types/vue' {
  interface Vue {
    $avatar: avatarType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $avatar: avatarType
  }

  interface Context {
    $avatar: avatarType
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $avatar: avatarType
  }
}

export default defineNuxtPlugin((ctx, inject) => {
  inject('avatar', (user: User) => {
    if (!user) return ''

    if (!user.avatar)
      return `${ctx.$config.staticBase}${ctx.$config.avatarBase}/${
        user.id % 10
      }.png`

    if (user.avatar.startsWith('http')) return user.avatar

    return ctx.$config.staticBase + user.avatar
  })
})
