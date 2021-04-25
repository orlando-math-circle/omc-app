import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

declare module 'vuetify-loader'

Vue.use(Vuetify)

export default defineNuxtPlugin((ctx) => {
  // Check if the user has a previously set dark theme token.
  const isDark = ctx.$cookies.get('omc-theme-dark')

  const vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
    theme: {
      dark: !!isDark,
      themes: {
        light: {
          primary: '#44D9E6',
          accent: '#1B1E23',
          // primary: '#1B1E23',
          // accent: '#44D9E6',
          secondary: '#FF4299',
          // secondary: '#1B1E23',
          // accent: '#FF4299',
        },
        dark: {},
      },
    },
  })

  ctx.app.vuetify = vuetify
  ctx.$vuetify = vuetify.framework
})
