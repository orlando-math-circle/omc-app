import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { useAuth } from '@/store/useAuth'

/**
 * Plugin: Axios Interceptor
 *
 * If any API request results in a `401 Unauthorized` error
 * there is a credential issue, this plugin will logout
 * the user and remove any associated data.
 */

export default defineNuxtPlugin(({ $axios, redirect, $pinia }) => {
  const authStore = useAuth($pinia)

  $axios.onError((error) => {
    if (error.response?.status === 401) {
      if (authStore.isLoggedIn) {
        authStore.logout()
        redirect('/')
      }
    }
  })
})
