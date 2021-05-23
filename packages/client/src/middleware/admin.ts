import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { useAuth } from '@/stores'

/**
 * Admin Access Middleware
 */
export default defineNuxtMiddleware(({ pinia, error }) => {
  const authStore = useAuth(pinia)

  if (!authStore.isAdmin) {
    error({
      statusCode: 403,
      message: 'Insufficient permissions to access the admin interface',
    })
  }
})
