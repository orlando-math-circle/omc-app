/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plugin } from '@nuxt/types'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'

declare module 'vue/types/vue' {
  interface Vue {
    $snack: (text: string, timeout?: number, color?: string) => void
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $snack: (text: string, timeout?: number, color?: string) => void
  }

  interface Context {
    $snack: (text: string, timeout?: number, color?: string) => void
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $snack: (text: string, timeout?: number, color?: string) => void
  }
}

export default defineNuxtPlugin((ctx, inject) => {
  inject('snack', (text: string, timeout?: number, color?: string) => {
    ctx.app.$accessor.snackbar.show({ text, timeout, color })
  })
})
