import { defineStore } from 'pinia'
import { Account, CreateAccountDto } from '@omc/server'

export { Account }

export const useAccount = defineStore({
  id: 'account',
  state: () => ({
    account: null as Account | null,
  }),
  actions: {
    async create(createAccountDto: CreateAccountDto) {
      this.account = await this.$nuxt.$axios.$post('/account', createAccountDto)
    },
  },
})
