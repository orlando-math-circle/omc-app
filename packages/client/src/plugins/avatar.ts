import { Plugin } from '@nuxt/types'
import { User } from '@server/user/user.entity'

const plugin: Plugin = (ctx, inject) => {
  inject('avatar', (user: User) => {
    if (!user) return ''

    if (!user.avatar)
      return `${ctx.$config.staticBase}${ctx.$config.avatarBase}/${
        user.id % 10
      }.png`

    if (user.avatar.startsWith('http')) return user.avatar

    return ctx.$config.staticBase + user.avatar
  })
}

export default plugin
