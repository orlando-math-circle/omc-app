import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { StateStatus } from '../interfaces/state-status.enum'
import { User } from '../../backend/src/user/user.entity'
import { FindUsersDto } from '../../backend/src/user/dtos/find-users.dto'

export const state = () => ({
  status: StateStatus.UNLOADED,
  users: [] as User[],
})

export type UserState = ReturnType<typeof state>

export const getters: GetterTree<UserState, UserState> = {
  isLoading: (state) => state.status === StateStatus.BUSY,
}

export const mutations: MutationTree<UserState> = {
  SET_STATUS: (state, status: StateStatus) => (state.status = status),
  SET_USERS: (state, users: User[]) => (state.users = users),
}

export const actions: ActionTree<UserState, UserState> = {
  async fetchUsers({ commit }, findUsersDto: FindUsersDto) {
    commit('SET_STATUS', StateStatus.BUSY)

    const users = await this.$axios.$get('/user', { params: findUsersDto })

    commit('SET_USERS', users[0])
    commit('SET_STATUS', StateStatus.WAITING)
  },
}
