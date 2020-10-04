import { Context } from '@nuxt/types'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default (ctx: Context) => {
  const vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
    theme: {
      themes: {
        light: {
          primary: '#1B1E23',
          accent: '#44D9E6',
          secondary: '#FF4299',
          // secondary: '#1B1E23',
          // accent: '#FF4299',
        },
      },
    },
  })

  // Investigating adding types for these.
  // @ts-ignore
  ctx.app.vuetify = vuetify
  // @ts-ignore
  ctx.$vuetify = vuetify.framework
}
