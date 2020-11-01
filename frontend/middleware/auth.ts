import { Middleware } from '@nuxt/types'

/**
 * Auth Middleware
 */
const middleware: Middleware = (ctx) => {
  if (!ctx.app.$accessor.auth.token) {
    return ctx.redirect('/login')
  }

  if (ctx.app.$accessor.auth.complete === false) {
    return ctx.redirect('/switcher')
  }
}

export default middleware
