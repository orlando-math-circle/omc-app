import { defineStore } from 'pinia'
import { Invoice } from '@server/invoice/invoice.entity'

export const usePayPal = defineStore({
  id: 'paypal',
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
