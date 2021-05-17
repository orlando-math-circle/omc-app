import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { useAuth } from '@/store/useAuth'
import { COOKIE_COMPLETE, COOKIE_JWT } from '@/utils/constants'

/**
 * Plugin: Auth Handler
 *
 * As this website utilizes server-side rendering (SSR) cookie
 * management has special considerations.
 *
 * Data is retrieved on the server by accessing cookies sent from the
 * user's browser in the initial request. If the cookies are used to successfully
 * retrieve user data on the API then the token is saved in the `AuthStore`.
 * Since stores are sent as part of the pre-hydrated data back to the client,
 * the token can then be used to make authenticated requests as bearer tokens.
 *
 * This plugin will run twice — on the server and client. This is beneficial
 * because unlike the stores, Axios will not transfer the token from server to client
 * during hydration and needs to be set using the token found in the store.
 */

export default defineNuxtPlugin(async ({ $cookies, $axios, $pinia }) => {
  const authStore = useAuth($pinia)

  // 1. Check for token in order to fetch the user on the server.
  if (process.server) {
    const token = $cookies.get<string | undefined>(COOKIE_JWT)
    const complete = $cookies.get<boolean | undefined>(COOKIE_COMPLETE) || false

    // 2a. No token means the user isn't logged in.
    if (!token) return

    // 2b. Otherwise, we set the axios token on the server.
    $axios.setToken(token, 'Bearer')

    // 3. Fetch the user or account based on the token type.
    if (complete) {
      await authStore.getMyUser()
    } else {
      await authStore.getMyAccount()
    }

    // 4. Store credentials if successful.
    if (!authStore.error) {
      authStore.token = token
      authStore.complete = complete
    }
  }

  // 5. Set the token after the client renders.
  if (process.client && authStore.token) {
    $axios.setToken(authStore.token, 'Bearer')
  }
})
