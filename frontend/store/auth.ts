import { AxiosError } from 'axios'
import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { Account } from '../../backend/src/account/account.entity'
import { CreateAccountDto } from '../../backend/src/account/dtos/create-account.dto'
import { ChangePasswordDto } from '../../backend/src/auth/dtos/change-password.dto'
import { ResetPasswordDto } from '../../backend/src/auth/dtos/reset-password.dto'
import { Roles } from '../../backend/src/app.roles'
import { User } from '../../backend/src/user/user.entity'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { COOKIE_COMPLETE, COOKIE_JWT } from '../utils/constants'
import { parseAxiosError } from '../utils/utilities'

interface LoginDto {
  email: string
  password: string
  remember: boolean
}

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  user: null as User | null,
  account: null as Account | null,
  settings: {
    calendarType: 'month',
  },
  token: null as string | null,
  complete: false,
  remember: true,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
  isErrored: (state) => state.status === StateStatus.ERROR,
  loggedIn: (state) => !!state.token,
  accountUsers: (state) => (state.account?.users as unknown) as User[],
  isAdmin: (state) => state.user?.roles?.includes(Roles.ADMIN),
  isVolunteer: (state) => state.user?.roles?.includes(Roles.VOLUNTEER),
  isValidated: (state) => state.user?.emailVerified,
  avatar: (state) =>
    state.user?.avatar || '../images/default_avatars/default.svg',
})

export const mutations = mutationTree(state, {
  setStatus(state, status: StateStatus) {
    state.status = status

    if (status === StateStatus.BUSY) {
      state.error = null
    }
  },
  setError(state, error: AxiosError) {
    state.status = StateStatus.ERROR
    state.error = parseAxiosError(error)
  },
  setToken(state, token: string | null) {
    state.token = token
  },
  setComplete(state, complete: boolean) {
    state.complete = complete
  },
  setUser(state, user: User | null) {
    state.user = user
  },
  setAccount(state, account: Account) {
    state.account = account
  },
  setSettings(state, settings: any) {
    state.settings = Object.assign({}, state.settings, settings)
  },
  setRemember(state, remember: boolean) {
    state.remember = remember
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    setCookie(
      { state },
      { name, value }: { name: string; value: string | null }
    ): void {
      if (value === null) {
        this.app.$cookies.remove(name)
        return
      }

      this.app.$cookies.set(name, value, {
        maxAge: state.remember ? 365 * 24 * 60 * 60 * 1000 : undefined,
      })
    },
    async login({ commit }, loginDto: LoginDto): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const { token, complete } = await this.$axios.$post('/login', {
          email: loginDto.email,
          password: loginDto.password,
        })

        commit('setRemember', loginDto.remember)
        commit('setToken', token)
        commit('setComplete', complete)
        this.app.$accessor.auth.setCookie({ name: COOKIE_JWT, value: token })
        this.app.$accessor.auth.setCookie({
          name: COOKIE_COMPLETE,
          value: complete,
        })

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async logout({ commit }, everywhere?: boolean): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        if (everywhere) {
          await this.$axios.$post('/logout')
        }

        commit('setUser', null)
        commit('setToken', null)
        this.app.$accessor.auth.setCookie({ name: COOKIE_JWT, value: null })
        this.app.$accessor.auth.setCookie({
          name: COOKIE_COMPLETE,
          value: null,
        })

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async switchUser({ commit }, userId: number): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const { token, complete } = await this.$axios.$post(`/switch/${userId}`)

        commit('setToken', token)
        commit('setComplete', complete)
        this.app.$accessor.auth.setCookie({ name: COOKIE_JWT, value: token })
        this.app.$accessor.auth.setCookie({
          name: COOKIE_COMPLETE,
          value: complete,
        })

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async register(
      { commit },
      createAccountDto: CreateAccountDto
    ): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const { token, complete } = await this.$axios.$post(
          '/account/register',
          createAccountDto
        )

        commit('setToken', token)
        commit('setComplete', complete)
        this.app.$accessor.auth.setCookie({ name: COOKIE_JWT, value: null })
        this.app.$accessor.auth.setCookie({
          name: COOKIE_COMPLETE,
          value: complete,
        })

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async getMe({ commit }): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const user = await this.$axios.$get('/user/me')

        commit('setUser', user)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async getAccount({ commit }): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const account = await this.$axios.$get('/account/me')

        commit('setAccount', account)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async verify({ commit }, token: string): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$post('/verify/email', { token })

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async resendVerifyEmail({ commit }): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$post('/verify/resend')

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async changePassword(
      { commit },
      changePasswordDto: ChangePasswordDto
    ): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$post('/password/change', changePasswordDto)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async forgotPassword({ commit }, email: string): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$post('/password/forgot', { email })

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async verifyResetPassword({ commit }, token: string): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$post('/verify/reset', { token })

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async resetPassword(
      { commit },
      resetPasswordDto: ResetPasswordDto
    ): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$post('/password/reset', resetPasswordDto)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
