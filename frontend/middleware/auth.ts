import { Middleware } from '@nuxt/types'

/**
 * Auth Middleware
 */
const middleware: Middleware = (ctx) => {
  const loggedIn = ctx.store.getters['auth/loggedIn']

  if (!loggedIn) {
    return ctx.redirect('/login')
  }
}

export default middleware
