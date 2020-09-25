import { Context } from '@nuxt/types'
import { ActionTree } from 'vuex'
import { COOKIE_CALENDAR_TYPE, COOKIE_NAME } from '../utils/constants'

export type BaseState = {}

export const actions: ActionTree<BaseState, BaseState> = {
  /**
   * Nuxt calls `nuxtServerInit` on the first load or during reload.
   *
   * This method is used for rectifying cookies and login state.
   */
  async nuxtServerInit({ commit, dispatch }, ctx: Context) {
    const token = ctx.app.$cookies.get(COOKIE_NAME)

    if (!token) return dispatch('auth/removeTokenCookie')

    dispatch('auth/setTokenCookie', token)

    try {
      await dispatch('auth/getMe')
    } catch (error) {
      console.error('Error fetching user', error)

      dispatch('auth/removeTokenCookie')
    }

    // Parse calendar type setting.
    const calendarType = ctx.app.$cookies.get(COOKIE_CALENDAR_TYPE)

    if (calendarType) {
      commit('auth/SET_SETTINGS', { calendarType })
    }
  },
}
