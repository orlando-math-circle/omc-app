import { defineStore } from 'pinia'
import { Invoice } from '@server/invoice/invoice.entity'

export const useInvoices = defineStore({
  id: 'invoices',
  state: () => ({
    invoices: [] as Invoice[],
  }),
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
