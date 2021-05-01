import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { initializeAxios } from '../utils/axios'

export default defineNuxtPlugin(({ $axios, app, redirect }) => {
  /**
   * Attaches $axios to the Nuxt axios instance.
   */
  initializeAxios($axios)

  /**
   * Ensures that the token in the state is used
   * in each Axios request, or is removed when gone.
   */
  $axios.onRequest((config) => {
    if (app.$accessor.auth.token) {
      config.headers.common.Authorization = `Bearer ${app.$accessor.auth.token}`
    } else {
      delete config.headers.common.Authorization
    }

    return config
  })

  $axios.onError((error) => {
    if (!error.config) return

    // Issue with the current access token.
    if (error.response?.status === 401) {
      if (app.$accessor.auth.loggedIn) {
        app.$accessor.auth.logout()
        redirect('/')
      }
    }
  })
})
