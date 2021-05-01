import { Context } from '@nuxt/types'
import { actionTree, getAccessorType } from 'typed-vuex'
import * as auth from '~/store/auth'
import * as courses from '~/store/courses'
import * as events from '~/store/events'
import * as files from '~/store/files'
import * as invoices from '~/store/invoices'
import * as paypal from '~/store/paypal'
import * as projects from '~/store/projects'
import * as registrations from '~/store/registrations'
import * as snackbar from '~/store/snackbar'
import * as twitter from '~/store/twitter'
import * as users from '~/store/users'
import * as volunteers from '~/store/volunteers'
import {
  COOKIE_CALENDAR_TYPE,
  COOKIE_COMPLETE,
  COOKIE_JWT,
} from '~/utils/constants'

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
      const token = app.$cookies.get(COOKIE_JWT)
      const complete = app.$cookies.get(COOKIE_COMPLETE) || false

      if (!token) return

      app.$cookies.set(COOKIE_JWT, token)
      app.$cookies.set(COOKIE_COMPLETE, complete)
      app.$accessor.auth.setToken(token)
      app.$accessor.auth.setComplete(complete)

      try {
        if (complete) {
          await app.$accessor.auth.getMe()
        } else {
          await app.$accessor.auth.getAccount()
        }
      } catch (error) {
        if (error.response?.status === 401) {
          app.$cookies.remove(COOKIE_JWT)
          app.$cookies.remove(COOKIE_COMPLETE)
        }
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
    volunteers,
    snackbar,
    twitter,
  },
})
