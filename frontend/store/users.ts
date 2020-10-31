import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { FindUsersDto } from '../../backend/src/user/dtos/find-users.dto'
import { User } from '../../backend/src/user/user.entity'
import { State } from '../interfaces/state.interface'

export const state = () => ({
  status: State.UNLOADED,
  users: [] as User[],
  user: null as User | null,
})

export const getters = getterTree(state, {
  isLoading(state) {
    return state.status === State.BUSY
  },
})

export const mutations = mutationTree(state, {
  setStatus(state, status: State) {
    state.status = status
  },
  setUser(state, user: User) {
    state.user = user
  },
  setUsers(state, users: User[]) {
    state.users = users
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async getUser({ commit }, id: number | string) {
      commit('setStatus', State.BUSY)
      const user = await this.$axios.$get(`/user/${id}`)

      commit('setUser', user)
      commit('setStatus', State.WAITING)
    },
    async fetchUsers({ commit }, findUsersDto: FindUsersDto) {
      commit('setStatus', State.BUSY)

      const users = await this.$axios.$get('/user', { params: findUsersDto })

      commit('setUsers', users[0])
      commit('setStatus', State.WAITING)
    },
  }
)
