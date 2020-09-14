import { Context } from '@nuxt/types'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default (ctx: Context) => {
  const vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
  })

  // Investigating adding types for these.
  // @ts-ignore
  ctx.app.vuetify = vuetify
  // @ts-ignore
  ctx.$vuetify = vuetify.framework
}
