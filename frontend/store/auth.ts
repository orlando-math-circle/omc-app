import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { Account } from '../../backend/src/account/account.entity'
import { Roles } from '../../backend/src/app.roles'
import { User } from '../../backend/src/user/user.entity'
import { State } from '../interfaces/state.interface'
import { COOKIE_NAME } from '../utils/constants'

interface LoginDto {
  email: string
  password: string
  remember: boolean
}

export const state = () => ({
  status: State.UNLOADED,
  user: null as User | null,
  account: null as Account | null,
  settings: {
    calendarType: 'month',
  },
  token: {
    jwt: null as string | null,
    complete: false,
    remember: true,
  },
})

type AuthState = ReturnType<typeof state>

export const getters = getterTree(state, {
  loggedIn: (state) => state.token.jwt && state.token.complete,
  isAdmin: (state) => state.user?.roles?.includes(Roles.ADMIN),
})

export const mutations = mutationTree(state, {
  setStatus(state, status: State) {
    state.status = status
  },
  setToken(state, token: Partial<AuthState['token']>) {
    state.token = Object.assign({}, state.token, token)
  },
  setUser(state, user: User) {
    state.user = user
  },
  setAccount(state, account: Account) {
    state.account = account
  },
  setSettings(state, settings: Partial<AuthState['settings']>) {
    state.settings = Object.assign({}, state.settings, settings)
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    setTokenCookie(
      { commit, state },
      token: Partial<AuthState['token']>
    ): void {
      commit('setToken', token)

      this.app.$cookies.set(COOKIE_NAME, state.token, {
        maxAge: state.token.remember ? 365 * 24 * 60 * 60 * 1000 : undefined,
      })
    },
    removeTokenCookie({ commit }): void {
      commit('setToken', {
        jwt: null,
        complete: false,
        remember: true,
      })
      this.app.$cookies.remove(COOKIE_NAME)
    },
    async login(
      { commit },
      { email, password, remember }: LoginDto
    ): Promise<void> {
      commit('setStatus', State.BUSY)

      const { token, complete } = await this.$axios.$post('/login', {
        email,
        password,
      })

      this.app.$accessor.auth.setTokenCookie({ jwt: token, complete, remember })
      commit('setStatus', State.WAITING)
    },
    async logout({ commit }, everywhere?: boolean): Promise<void> {
      if (everywhere) {
        commit('setStatus', State.BUSY)
        await this.$axios.$post('/logout')
      }

      this.app.$accessor.auth.removeTokenCookie()

      if (everywhere) {
        commit('setStatus', State.WAITING)
      }
    },
    async switchUser({ commit }, userId: number): Promise<void> {
      commit('setStatus', State.BUSY)

      const { token, complete } = await this.$axios.$post(`/switch/${userId}`)

      this.app.$accessor.auth.setTokenCookie({ jwt: token, complete })
      commit('setStatus', State.WAITING)
    },
    async getMe({ commit }): Promise<void> {
      commit('setStatus', State.BUSY)

      const user = await this.$axios.$get('/user/me')

      commit('setUser', user)
      commit('setStatus', State.WAITING)
    },
    async getAccount({ commit }): Promise<void> {
      commit('setStatus', State.BUSY)

      const account = await this.$axios.$get('/account/me')

      commit('setAccount', account)
      commit('setStatus', State.WAITING)
    },
  }
)
