import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { StateError } from '../types/state-error.interface'
import { StateStatus } from '../types/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  tweets: [] as any[],
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
  setTweets(state, tweets: any[]) {
    state.tweets = tweets
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async findAll({ commit }) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const tweets = await this.$axios.$get('/twitter')

        commit('setTweets', tweets)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
