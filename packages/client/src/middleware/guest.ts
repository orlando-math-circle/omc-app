import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

/**
 * Guest Middleware
 *
 * Redirects users out of pages or layouts protected
 * with this middleware if they are already logged in.
 */
export default defineNuxtMiddleware((ctx) => {
  const isOnSwitcher = ctx.route.fullPath === '/switcher'

  if (ctx.$accessor.auth.token && !isOnSwitcher) {
    return ctx.redirect('/home')
  }
})
