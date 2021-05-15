import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { useAuth } from '@/store/useAuth'

export default defineNuxtPlugin(({ $axios, redirect, pinia }) => {
  const authStore = useAuth(pinia)

  /**
   * Ensures that the token in the state is used
   * in each Axios request, or is removed when gone.
   */
  $axios.onRequest((config) => {
    if (authStore.token) {
      config.headers.common.Authorization = `Bearer ${authStore.token}`
    } else {
      delete config.headers.common.Authorization
    }

    return config
  })

  $axios.onError((error) => {
    // Issue with the current access token.
    if (error.response?.status === 401) {
      if (authStore.isLoggedIn) {
        authStore.logout()
        redirect('/')
      }
    }
  })
})
