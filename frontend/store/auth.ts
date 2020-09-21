import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { Account } from '../../backend/src/account/account.entity'
import { Roles } from '../../backend/src/app.roles'
import { User } from '../../backend/src/user/user.entity'
import { StateStatus } from '../interfaces/state-status.enum'
import { COOKIE_NAME } from '../utils/constants'

export const state = () => ({
  status: StateStatus.UNLOADED,
  token: {
    jwt: null as string | null,
    complete: false,
    remember: true,
  },
  user: null as User | null,
  account: null as Account | null,
})

export type AuthState = ReturnType<typeof state>

export const getters: GetterTree<AuthState, AuthState> = {
  loggedIn: (state) => state.token.jwt && state.token.complete,
  isAdmin: (state) =>
    state.token.jwt &&
    state.token.complete &&
    state.user?.roles?.includes(Roles.ADMIN),
}

export const mutations: MutationTree<AuthState> = {
  SET_STATUS: (state, status: StateStatus) => (state.status = status),
  SET_TOKEN: (state, data: AuthState['token']) =>
    (state.token = Object.assign({}, state.token, data)),
  SET_USER: (state, user: User) => (state.user = user),
  SET_ACCOUNT: (state, account: Account) => (state.account = account),
}

export const actions: ActionTree<AuthState, AuthState> = {
  async login({ commit, dispatch }, { email, password, remember }) {
    commit('SET_STATUS', StateStatus.BUSY)

    const { token, complete } = await this.$axios.$post('/login', {
      email,
      password,
    })

    dispatch('setTokenCookie', { jwt: token, complete, remember })

    commit('SET_STATUS', StateStatus.WAITING)
  },
  async logout({ commit, dispatch }, everywhere?: boolean) {
    // This method will invalidate any existing tokens.
    if (everywhere === true) {
      commit('SET_STATUS', StateStatus.BUSY)
      await this.$axios.$post('/logout')
    }

    dispatch('removeTokenCookie')

    if (everywhere === true) {
      commit('SET_STATUS', StateStatus.WAITING)
    }
  },
  async switchUser({ commit, dispatch }, id: number) {
    commit('SET_STATUS', StateStatus.BUSY)

    const { token, complete } = await this.$axios.$post(`/switch/${id}`)

    dispatch('setTokenCookie', { jwt: token, complete })
    commit('SET_STATUS', StateStatus.WAITING)
  },
  async getMe({ commit }) {
    commit('SET_STATUS', StateStatus.BUSY)

    const user = await this.$axios.$get('/user/me')

    commit('SET_USER', user)
    commit('SET_STATUS', StateStatus.WAITING)
  },
  setTokenCookie({ state, commit }, data: AuthState['token']) {
    commit('SET_TOKEN', data)

    // Sets the Authorization: Bearer <token> header on requests.
    this.$axios.setToken(state.token.jwt as string, 'Bearer')

    this.$cookies.set(COOKIE_NAME, state.token, {
      maxAge: state.token.remember ? 365 * 24 * 60 * 60 * 1000 : undefined,
    })
  },
  removeTokenCookie({ commit }) {
    commit('SET_TOKEN', { jwt: null, complete: false, remember: true })
    this.$axios.setToken(false, 'Bearer')
    this.$cookies.remove(COOKIE_NAME)
  },
}
