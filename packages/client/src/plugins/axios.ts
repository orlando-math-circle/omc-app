import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { useAuth } from '@/store/useAuth'

export default defineNuxtPlugin(({ $axios, redirect, pinia }) => {
  const authStore = useAuth(pinia)

  $axios.onError((error) => {
    // console.log(error)
    // Issue with the current access token.
    if (error.response?.status === 401) {
      if (authStore.isLoggedIn) {
        authStore.logout()
        redirect('/')
      }
    }
  })
})
