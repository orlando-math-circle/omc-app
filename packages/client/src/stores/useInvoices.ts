import { defineStore } from 'pinia'
import { Invoice } from '@omc/server'
import { StateStatus, StateError } from '@/types/state.interface'

export { Invoice }

export const useInvoices = defineStore({
  id: 'invoices',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    invoices: [] as Invoice[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async findAllByAccount() {
      this.invoices = await this.$nuxt.$axios.$get('/invoice/account')
    },
    async findAllByEvent(id: number) {
      this.invoices = await this.$nuxt.$axios.$get('/invoice/event/' + id)
    },
    async findAllByCourse(id: number) {
      this.invoices = await this.$nuxt.$axios.$get('/invoice/course/' + id)
    },
  },
})
