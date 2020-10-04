import { actionTree, mutationTree } from 'nuxt-typed-vuex'
import { Invoice } from '../../backend/src/invoice/invoice.entity'
import { State } from '../interfaces/state.interface'

export const state = () => ({
  status: State.UNLOADED,
  invoices: [] as Invoice[],
})

export const mutations = mutationTree(state, {
  setStatus(state, status: State) {
    state.status = status
  },
  setInvoices(state, invoices: Invoice[]) {
    state.invoices = invoices
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async findByEvent({ commit }, eventId: number | string) {
      commit('setStatus', State.BUSY)

      const invoices = await this.$axios.$get(`/invoice/event/${eventId}`)

      commit('setInvoices', invoices)
      commit('setStatus', State.WAITING)
    },
    async findByCourse({ commit }, courseId: number | string) {
      commit('setStatus', State.BUSY)
      const invoices = await this.$axios.$get(`/invoice/course/${courseId}`)

      commit('setInvoices', invoices)
      commit('setStatus', State.WAITING)
    },
  }
)
