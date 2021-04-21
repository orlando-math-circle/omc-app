import { Middleware } from '@nuxt/types'

/**
 * Guest Middleware
 *
 * Redirects users out of pages or layouts protected
 * with this middleware if they are already logged in.
 */
const middleware: Middleware = (ctx) => {
  const isOnSwitcher = ctx.route.fullPath === '/switcher'

  if (ctx.app.$accessor.auth.token && !isOnSwitcher) {
    return ctx.redirect('/home')
  }
}

export default middleware
