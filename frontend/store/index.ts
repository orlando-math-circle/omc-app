import { Context } from '@nuxt/types'
import { actionTree, getAccessorType } from 'nuxt-typed-vuex'
import { COOKIE_CALENDAR_TYPE, COOKIE_NAME } from '../utils/constants'
import * as auth from '~/store/auth'
import * as courses from '~/store/courses'
import * as events from '~/store/events'
import * as invoices from '~/store/invoices'
import * as paypal from '~/store/paypal'
import * as projects from '~/store/projects'
import * as registrations from '~/store/registrations'
import * as users from '~/store/users'

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
    async nuxtServerInit(_vuexContext, nuxtContext: Context): Promise<void> {
      const token = nuxtContext.app.$cookies.get(COOKIE_NAME)

      if (!token) {
        console.info('No Token Found')
        return this.app.$accessor.auth.removeTokenCookie()
      }

      this.app.$accessor.auth.setTokenCookie(token)

      console.info(token)

      try {
        await this.app.$accessor.auth.getMe()
      } catch (error) {
        console.error(
          'Unable to retrieve user from token',
          error.message,
          token.jwt
        )

        this.app.$accessor.auth.removeTokenCookie()
      }

      // Parse calendar type setting.
      const calendarType = nuxtContext.app.$cookies.get(COOKIE_CALENDAR_TYPE)

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
  },
})
