import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

/**
 * Admin Access Middleware
 */
export default defineNuxtMiddleware((ctx) => {
  if (!ctx.$accessor.auth.isAdmin) {
    ctx.error({
      statusCode: 403,
      message: 'Insufficient permissions to access the admin interface',
    })
  }
})
