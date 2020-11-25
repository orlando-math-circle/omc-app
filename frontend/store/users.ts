import { CreateUserDto } from '@backend/user/dtos/create-user.dto'
import { FindUsersDto } from '@backend/user/dtos/find-users.dto'
import { UpdateUserDto } from '@backend/user/dtos/update-user.dto'
import { User } from '@backend/user/user.entity'
import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { UpdateOwnUserDto } from '../../backend/src/user/dtos/update-own-user.dto'
import { DTO } from '../interfaces/date-to-string.interface'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError } from '../utils/utilities'

export type DTOUser = DTO<User>

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  users: [] as DTOUser[],
  user: null as DTOUser | null,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
})

export const mutations = mutationTree(state, {
  setStatus(state, status: StateStatus) {
    state.status = status

    if (status === StateStatus.BUSY) {
      state.error = null
    }
  },
  setError(state, error: any) {
    state.status = StateStatus.ERROR
    state.error = parseAxiosError(error)
  },
  setUser(state, user: DTOUser) {
    state.user = user
  },
  setUserById(state, { id, user }: { id: number; user: DTOUser }) {
    const index = state.users.findIndex((u) => u.id === id)

    state.users.splice(index, 1, user)
  },
  setUsers(state, users: DTOUser[]) {
    state.users = users
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async create({ commit }, createUserDto: CreateUserDto) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const user = await this.$axios.$post('/user', createUserDto)

        commit('setUser', user)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async getUser({ commit }, id: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const user = await this.$axios.$get(`/user/${id}`)

        commit('setUser', user)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findAll({ commit }, findUsersDto?: FindUsersDto) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const users = await this.$axios.$get('/user', { params: findUsersDto })

        commit('setUsers', users[0])
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async update(
      { commit },
      { id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto }
    ) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const user = await this.$axios.$patch(`/user/${id}`, updateUserDto)

        commit('setUserById', { id, user })
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async updateOwn(
      { commit },
      {
        id,
        updateOwnUserDto,
      }: { id: number; updateOwnUserDto: UpdateOwnUserDto }
    ) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const user = await this.$axios.$patch(
          `/user/own/${id}`,
          updateOwnUserDto
        )

        commit('setUserById', { id, user })
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async delete({ commit }, id: number) {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$delete(`/user/${id}`)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
