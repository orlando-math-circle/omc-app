import { defineStore } from 'pinia'
import { Invoice } from '@server/invoice/invoice.entity'
import { StateStatus, StateError } from '@/types/state.interface'

export const usePayPal = defineStore({
  id: 'paypal',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    createOrder(eventId: number, users: number[]) {
      return this.$nuxt.$axios.$post('/registration/order/create/' + eventId, {
        users,
      })
    },
    captureOrder(eventId: number, orderId: number) {
      return this.$nuxt.$axios.$post<Invoice[]>(
        `/registration/order/capture/${eventId}/${orderId}`
      )
    },
  },
})
