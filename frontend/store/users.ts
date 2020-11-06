import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { FindUsersDto } from '@backend/user/dtos/find-users.dto'
import { User } from '@backend/user/user.entity'
import { CreateUserDto } from '@backend/user/dtos/create-user.dto'
import { UpdateUserDto } from '@backend/user/dtos/update-user.dto'
import { State, StatePayload } from '../interfaces/state.interface'

export const state = () => ({
  status: State.UNLOADED,
  error: null as Error | null,
  users: [] as User[],
  user: null as User | null,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === State.BUSY,
})

export const mutations = mutationTree(state, {
  setStatus(state, { status, error }: StatePayload) {
    state.status = status
    state.error = error || null
  },
  setUser(state, user: User) {
    state.user = user
  },
  setUserById(state, { id, user }: { id: number; user: User }) {
    const index = state.users.findIndex((u) => u.id === id)

    state.users.splice(index, 1, user)
  },
  setUsers(state, users: User[]) {
    state.users = users
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async create({ commit }, createUserDto: CreateUserDto) {
      try {
        commit('setStatus', { status: State.BUSY })

        const user = await this.$axios.$post('/user', createUserDto)

        commit('setUser', user)
        commit('setStatus', { status: State.WAITING })

        return user
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async getUser({ commit }, id: number | string) {
      try {
        commit('setStatus', { status: State.BUSY })

        const user = await this.$axios.$get(`/user/${id}`)

        commit('setUser', user)
        commit('setStatus', { status: State.WAITING })
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async findAll({ commit }, findUsersDto?: FindUsersDto) {
      try {
        commit('setStatus', { status: State.BUSY })

        const users = await this.$axios.$get('/user', { params: findUsersDto })

        commit('setUsers', users[0])
        commit('setStatus', { status: State.WAITING })
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async update(
      { commit },
      { id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto }
    ) {
      try {
        commit('setStatus', { status: State.BUSY })

        const user = await this.$axios.$patch(`/user/${id}`, updateUserDto)

        commit('setUserById', { id, user })
        commit('setStatus', { status: State.WAITING })
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async delete({ commit }, id: number) {
      try {
        commit('setStatus', { status: State.BUSY })

        await this.$axios.$delete(`/user/${id}`)

        commit('setStatus', { status: State.WAITING })
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
  }
)
