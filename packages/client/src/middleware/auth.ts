import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

/**
 * Auth Middleware
 */
export default defineNuxtMiddleware((ctx) => {
  if (!ctx.$accessor.auth.token) {
    return ctx.redirect('/login')
  }

  if (ctx.$accessor.auth.complete === false) {
    return ctx.redirect('/switcher')
  }
})
