import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import Rollbar from 'rollbar'

/**
 * Enables error tracking using the Rollbar service.
 */

export default defineNuxtPlugin((ctx, inject) => {
  if (!ctx.$config.rollbarAccessToken) return

  const rollbar = new Rollbar({
    accessToken: ctx.$config.rollbarAccessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: process.env.NODE_ENV,
    },
  })

  ctx.$rollbar = rollbar
  inject('rollbar', rollbar)
})

declare module 'vue/types/vue' {
  interface Vue {
    $rollbar: Rollbar | undefined
  }
}

declare module '@nuxt/types' {
  interface Context {
    $rollbar: Rollbar | undefined
  }
}
