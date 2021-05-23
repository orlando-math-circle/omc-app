import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { useAuth } from '@/stores'

/**
 * Auth Middleware
 *
 * Ensures that the user is logged in (has a token) and
 * has a complete token (picked a user, if necessary).
 */
export default defineNuxtMiddleware(({ pinia, redirect }) => {
  const authStore = useAuth(pinia)

  if (!authStore.token) {
    return redirect('/login')
  }

  if (authStore.complete === false) {
    return redirect('/switcher')
  }
})
