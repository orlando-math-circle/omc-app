import { Middleware } from '@nuxt/types'
import { Roles } from '../../backend/src/app.roles'

/**
 * Admin Access Middleware
 */
const middleware: Middleware = (ctx) => {
  console.log(ctx.store.state.auth)
  if (!ctx.store.state.auth.user?.roles.includes(Roles.ADMIN)) {
    ctx.error({
      statusCode: 403,
      message: 'Insufficient permissions to access the admin interface',
    })
  }
}

export default middleware
