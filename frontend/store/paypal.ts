import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { StateStatus } from '../interfaces/state-status.enum'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as Error | null,
})

export type PayPalState = ReturnType<typeof state>

export const getters: GetterTree<PayPalState, PayPalState> = {}

export const mutations: MutationTree<PayPalState> = {
  SET_STATUS: (state, status: StateStatus) => (state.status = status),
  SET_ERROR: (state, error: Error | null) => (state.error = error),
}

export const actions: ActionTree<PayPalState, PayPalState> = {
  createOrder() {
    return this.$axios.$post('/paypal/orders/create')
  },
  captureOrder(_ctx, { id }) {
    return this.$axios.$post(`/paypal/orders/capture/${id}`)
  },
}
