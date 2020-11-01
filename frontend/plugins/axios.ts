import { Plugin } from '@nuxt/types'
import { initializeAxios } from '../utils/axios'

const plugin: Plugin = ({ $axios, app }) => {
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
      console.log(`URL: ${config.url} - ${app.$accessor.auth.token.substr(-5)}`)
      config.headers.common.Authorization = `Bearer ${app.$accessor.auth.token}`
    } else {
      delete config.headers.common.Authorization
    }

    return config
  })

  $axios.onError((error) => {
    console.error(
      `URL: ${error.config.url} - ${app.$accessor.auth.token?.substr(-5)} - ${
        error.message
      }`
    )
  })
}

export default plugin
