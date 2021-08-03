import { defineStore } from 'pinia'
import { Account } from '@server/account/account.entity'
import { RegisterAccountDto } from '@server/account/dto/register.dto'
import { Roles } from '@server/app.roles'
import { ChangePasswordDto } from '@server/auth/dtos/change-password.dto'
import { User } from '@server/user/user.entity'
import { COOKIE_COMPLETE, COOKIE_JWT } from '@/utils/constants'
import { useCookies } from '@/composables'
import { ResetPasswordDto } from '@server/auth/dtos/reset-password.dto'
import { StateStatus, StateError } from '@/types/state.interface'
import { EntityDTO } from '@server/shared/types/entity-dto'
import { ChangeEmailDto } from '@server/auth/dtos/change-email.dto'

export type UserEntity = EntityDTO<User>
export type AccountEntity = EntityDTO<Account>

export const useAuth = defineStore({
  id: 'auth',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    user: null as UserEntity | null,
    account: null as AccountEntity | null,
    token: null as string | null,
    complete: false,
    remember: true,
    settings: {
      calendarType: 'month',
    },
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
    primaryUser: (state) => state.account?.primaryUser,
    isAdmin: (state) => state.user?.roles.includes(Roles.ADMIN),
    isVolunteer: (state) => state.user?.roles.includes(Roles.VOLUNTEER),
    isVerified: (state) => state.user?.emailVerified,
    isLoggedIn: (state) => !!state.user,
    isPrimaryUser: (state) => state.account?.primaryUser.id === state.user?.id,
    accountUsers: (state) => state.account?.users,
    roleTitle: (state) =>
      // TODO: Refactor this onto the server side.
      state.user?.roles.includes(Roles.ADMIN)
        ? 'Administrator'
        : state.user?.roles.includes(Roles.VOLUNTEER)
        ? 'Volunteer'
        : null,
  },
  actions: {
    async login(email: string, password: string, remember: boolean) {
      const cookies = useCookies(this.$nuxt)

      const { token, complete, user } = await this.$nuxt.$axios.$post(
        '/login',
        {
          email,
          password,
        }
      )

      this.remember = remember
      this.token = token
      this.complete = complete

      if (complete) {
        this.user = user
      }

      cookies.set(COOKIE_JWT, token)
      cookies.set(COOKIE_COMPLETE, complete)

      this.$nuxt.$axios.setToken(token, 'Bearer')
    },
    async logout(everywhere?: boolean) {
      const cookies = useCookies(this.$nuxt)

      if (everywhere) {
        await this.$nuxt.$axios.$post('/logout')
      }

      this.user = null
      this.token = null
      cookies.remove(COOKIE_JWT)
      cookies.remove(COOKIE_COMPLETE)
      this.$nuxt.$axios.setToken(false)
    },
    async register(registerAccountDto: RegisterAccountDto) {
      const cookies = useCookies(this.$nuxt)

      const { token, complete } = await this.$nuxt.$axios.$post(
        '/account/register',
        registerAccountDto
      )

      this.token = token
      this.complete = complete
      cookies.set(COOKIE_JWT, token)
      cookies.set(COOKIE_COMPLETE, complete)
    },
    async getMyUser() {
      this.user = await this.$nuxt.$axios.$get('/user/me')
    },
    async getMyAccount() {
      this.account = await this.$nuxt.$axios.$get('/account/me')
    },
    async findAccountByUser(id: number) {
      this.account = await this.$nuxt.$axios.$get('/account/user/' + id)
    },
    async switchUser(id: number | string) {
      const cookies = useCookies(this.$nuxt)

      const { token, complete } = await this.$nuxt.$axios.$post(`/switch/${id}`)

      this.token = token
      this.complete = complete
      cookies.set(COOKIE_JWT, token)
      cookies.set(COOKIE_COMPLETE, complete)
      this.$nuxt.$axios.setToken(token, 'Bearer')
    },
    async forgotPassword(email: string) {
      await this.$nuxt.$axios.$post('/password/forgot', { email })
    },
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
      await this.$nuxt.$axios.$post('/password/reset', resetPasswordDto)
    },
    async changePassword(changePasswordDto: ChangePasswordDto) {
      await this.$nuxt.$axios.$post('/password/change', changePasswordDto)
    },
    async requestEmailChange(changeEmailDto: ChangeEmailDto) {
      await this.$nuxt.$axios.$post('/email/change', changeEmailDto)
    },
    async verifyEmailResend() {
      await this.$nuxt.$axios.$post('/verify/resend')
    },
    async verifyEmail(token: string) {
      await this.$nuxt.$axios.$post('/verify/email', { token })
    },
    async verifyReset(token: string) {
      await this.$nuxt.$axios.$post('/verify/reset', { token })
    },
    async verifyEmailChange(token: string) {
      await this.$nuxt.$axios.$post('/verify/email-change', { token })
    },
  },
})
