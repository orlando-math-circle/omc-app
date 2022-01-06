import { defineStore } from 'pinia'
import {
  CreateUserDto,
  FindUsersDto,
  MonthlyUserStatistic,
  UpdateOwnUserDto,
  UpdateUserDto,
  User,
} from '@omc/server'
import { StateError, StateStatus } from '@/types/state.interface'

export const useUsers = defineStore({
  id: 'user',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    user: null as User | null,
    users: [] as User[],
    statistics: [] as MonthlyUserStatistic[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(createUserDto: CreateUserDto) {
      this.user = await this.$nuxt.$axios.$post('/user', createUserDto)
    },
    async findOne(id: number | string) {
      this.user = await this.$nuxt.$axios.$get('/user/' + id)
    },
    async findAll(findUsersDto?: FindUsersDto, commit = true) {
      const resp = await this.$nuxt.$axios.$get('/user', {
        params: findUsersDto,
      })

      if (commit) {
        this.users = resp[0]
      }

      return resp
    },
    async getStatistics() {
      this.statistics = await this.$nuxt.$axios.$get('/user/statistics')
    },
    async update(
      id: number,
      updateUserDto: UpdateUserDto | UpdateOwnUserDto,
      own = false
    ) {
      await this.$nuxt.$axios.$patch(
        '/user/' + (own ? 'own/' : '') + id,
        updateUserDto
      )
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/user/' + id)
    },
  },
})
