import { Context } from '@nuxt/types'
import { actionTree, getAccessorType } from 'nuxt-typed-vuex'
import { COOKIE_CALENDAR_TYPE } from '../utils/constants'
import * as auth from '~/store/auth'
import * as courses from '~/store/courses'
import * as events from '~/store/events'
import * as invoices from '~/store/invoices'
import * as paypal from '~/store/paypal'
import * as projects from '~/store/projects'
import * as registrations from '~/store/registrations'
import * as users from '~/store/users'
import * as files from '~/store/files'

export const state = () => ({})

export const getters = {}

export const mutations = {}

/**
 * Nuxt calls `nuxtServerInit` on the first load or during reload.
 *
 * This method is used for rectifying cookies and login state.
 */
export const actions = actionTree(
  { state, getters, mutations },
  {
    async nuxtServerInit(_vuexContext, { app }: Context): Promise<void> {
      const token = app.$cookies.get('omc-token')

      if (!token) return

      app.$accessor.auth.setToken(token)

      try {
        await app.$accessor.auth.getMe()
      } catch (error) {
        console.error(
          'Unable to retrieve user from token',
          error.message,
          token.substr(-5)
        )

        app.$accessor.auth.setToken(null)
        app.$cookies.remove('omc-token')
      }

      // Parse calendar type setting.
      const calendarType = app.$cookies.get(COOKIE_CALENDAR_TYPE)

      if (calendarType) {
        this.app.$accessor.auth.setSettings({ calendarType })
      }
    },
  }
)

export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
  modules: {
    auth,
    courses,
    events,
    invoices,
    paypal,
    projects,
    registrations,
    users,
    files,
  },
})
