import { defineStore } from 'pinia'
import { Invoice } from '@server/invoice/invoice.entity'
import { StateStatus, StateError } from '@/types/state.interface'

export const useMemberPayPal = defineStore({
  id: 'paypal',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    createOrder(users: number[]) {
      return this.$nuxt.$axios.$post('/membership/order/create/', {
        users,
      })
    },
    captureOrder(orderId: number) {
      return this.$nuxt.$axios.$post<Invoice[]>(
        `/membership/order/capture/${orderId}`
      )
    },
  },
})
