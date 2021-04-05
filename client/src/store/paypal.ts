import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { Invoice } from '@omc/server/invoice/invoice.entity'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
  isErrored: (state) => state.status === StateStatus.ERROR,
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
})

export const actions = actionTree(
  { state },
  {
    async create(
      { commit },
      { eventId, users }: { eventId: number; users: number[] }
    ) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const resp = await this.$axios.$post(
          `/registration/order/create/${eventId}`,
          {
            users,
          }
        )

        commit('setStatus', StateStatus.WAITING)

        return resp
      } catch (error) {
        commit('setError', error)
      }
    },
    async capture(
      { commit },
      { eventId, orderId }: { eventId: number; orderId: number }
    ) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const resp = await this.$axios.$post<Invoice[]>(
          `/registration/order/capture/${eventId}/${orderId}`
        )
        commit('setStatus', StateStatus.WAITING)

        return resp
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
