import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { useAuth } from '@/stores'

/**
 * Guest Middleware
 *
 * Redirects users out of pages or layouts protected
 * with this middleware if they are already logged in.
 */
export default defineNuxtMiddleware(({ pinia, redirect, route }) => {
  const authStore = useAuth(pinia)

  const isOnSwitcher = route.fullPath === '/switcher'

  if (authStore.token && !isOnSwitcher) {
    return redirect('/home')
  }
})
