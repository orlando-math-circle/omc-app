import { Context } from '@nuxt/types'
import { ActionTree } from 'vuex'
import { COOKIE_NAME } from '../utils/constants'

export type BaseState = {}

export const actions: ActionTree<BaseState, BaseState> = {
  /**
   * Nuxt calls `nuxtServerInit` on the first load or during reload.
   *
   * This method is used for reinstating the auth.
   */
  async nuxtServerInit({ dispatch }, ctx: Context) {
    const token = ctx.app.$cookies.get(COOKIE_NAME)

    if (!token) return dispatch('auth/removeTokenCookie')

    dispatch('auth/setTokenCookie', token)

    try {
      await dispatch('auth/getMe')
    } catch (error) {
      console.error('Error fetching user', error)

      dispatch('auth/removeTokenCookie')
    }
  },
}
