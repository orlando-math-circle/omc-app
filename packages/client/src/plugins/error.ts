import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { useAuth } from '@/stores'
import { StateError } from '@/types/state.interface'

export type StateErrorHandler = (error: StateError) => void

declare module 'vue/types/vue' {
  interface Vue {
    $error: StateErrorHandler
  }
}

declare module '@nuxt/types' {
  interface Context {
    $error: StateErrorHandler
  }
}

export default defineNuxtPlugin((ctx, inject) => {
  const authStore = useAuth(ctx.$pinia)

  const onStateError: StateErrorHandler = (error) => {
    if (error.status === 401) {
      authStore.logout()
      ctx.redirect('/')
    }
  }

  inject('error', onStateError)
})
