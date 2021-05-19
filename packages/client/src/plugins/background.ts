import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { Event } from '@server/event/event.entity'

declare module 'vue/types/vue' {
  interface Vue {
    $background: (eventOrPicture: Event | string) => string
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $background: (eventOrPicture: Event | string) => string
  }

  interface Context {
    $background: (eventOrPicture: Event | string) => string
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $background: (eventOrPicture: Event | string) => string
  }
}

export default defineNuxtPlugin((ctx, inject) => {
  inject('background', (eventOrPicture: Event | string) => {
    const url =
      typeof eventOrPicture === 'string'
        ? eventOrPicture
        : eventOrPicture.picture

    if (url.startsWith('http')) return url

    return `${ctx.$config.staticBase}${url}`
  })
})
