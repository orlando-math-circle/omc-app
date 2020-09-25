import { Middleware } from '@nuxt/types'
import { Roles } from '../../backend/src/app.roles'
import { User } from '../../backend/src/user/user.entity'

/**
 * Auth Middleware
 */
const middleware: Middleware = (ctx) => {
  const loggedIn = ctx.store.getters['auth/loggedIn']

  if (!loggedIn) return ctx.redirect('/login')

  const roles: Roles[] = ctx.route.meta.auth?.roles

  console.log(ctx.route)
  console.log(`Roles: ${roles}`)

  if (roles) {
    const user = ctx.store.state.auth.user as User
    const hasRole = user.roles.some((role) => roles.includes(role))

    console.log(hasRole)

    if (!hasRole)
      return ctx.error({
        statusCode: 403,
        message: 'Insufficient permissions to access the admin interface',
      })
  }
}

export default middleware
