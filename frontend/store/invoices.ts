import { Invoice } from '@omc/server/invoice/invoice.entity'
import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  invoices: [] as Invoice[],
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
  setInvoices(state, invoices: Invoice[]) {
    state.invoices = invoices
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async findByEvent({ commit }, eventId: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const invoices = await this.$axios.$get(`/invoice/event/${eventId}`)

        commit('setInvoices', invoices)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findByCourse({ commit }, courseId: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const invoices = await this.$axios.$get(`/invoice/course/${courseId}`)

        commit('setInvoices', invoices)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findByAccount({ commit }) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const invoices = await this.$axios.$get('/invoice/account')

        commit('setInvoices', invoices)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
