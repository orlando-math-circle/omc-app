import { Middleware } from '@nuxt/types'

/**
 * Guest Middleware
 *
 * Redirects users out of pages or layouts protected
 * with this middleware if they are already logged in.
 */
const middleware: Middleware = (ctx) => {
  const loggedIn = ctx.app.$accessor.auth.loggedIn
  const isSwitcher = ctx.route.fullPath === '/switcher'

  if (loggedIn && !isSwitcher) return ctx.redirect('/home')
}

export default middleware
