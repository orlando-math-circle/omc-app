import { Middleware } from '@nuxt/types'

/**
 * Auth Middleware
 */
const middleware: Middleware = (ctx) => {
  const loggedIn = ctx.app.$accessor.auth.loggedIn

  if (!loggedIn) return ctx.redirect('/login')
}

export default middleware
