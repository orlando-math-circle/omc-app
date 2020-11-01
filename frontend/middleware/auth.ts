import { Middleware } from '@nuxt/types'

/**
 * Auth Middleware
 */
const middleware: Middleware = (ctx) => {
  if (!ctx.app.$accessor.auth.token) {
    console.log('Redirect: Not logged in.')
    return ctx.redirect('/login')
  }

  if (ctx.app.$accessor.auth.complete === false) {
    console.info('Redirect: Incomplete token.')
    return ctx.redirect('/switcher')
  }
}

export default middleware
