import { Plugin } from '@nuxt/types'
import { initializeAxios } from '../utils/axios'

const plugin: Plugin = ({ $axios, store }) => {
  /**
   * Attaches $axios to the Nuxt axios instance.
   */
  initializeAxios($axios)

  /**
   * Ensures that the token in the state is used
   * in each Axios request, or is removed when gone.
   */
  $axios.onRequest((config) => {
    if (store.state.auth.token.jwt) {
      config.headers.common.Authorization = `Bearer ${store.state.auth.token.jwt}`
    } else {
      delete config.headers.common.Authorization
    }

    return config
  })
}

export default plugin
