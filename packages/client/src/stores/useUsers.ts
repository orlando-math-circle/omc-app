import { defineStore } from 'pinia'
import { CreateUserDto } from '@server/user/dtos/create-user.dto'
import { FindUsersDto } from '@server/user/dtos/find-users.dto'
import { UpdateOwnUserDto } from '@server/user/dtos/update-own-user.dto'
import { UpdateUserDto } from '@server/user/dtos/update-user.dto'
import { UserEntity } from '@/stores'
import { StateStatus, StateError } from '@/types/state.interface'
import { MonthlyUserStatistic as Statistic } from '@server/user/interfaces/monthly-user-statistic.interface'
import { EntityDTO } from '@server/shared/types/entity-dto'

export type MonthlyUserStatistic = EntityDTO<Statistic>

export const useUsers = defineStore({
  id: 'user',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    user: null as UserEntity | null,
    users: [] as UserEntity[],
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
