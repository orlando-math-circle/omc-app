import { defineStore } from 'pinia'
import { Account as AccountEntity } from '@server/account/account.entity'
import { CreateAccountDto } from '@server/account/dto/create-account.dto'
import { EntityDTO } from '@server/shared/types/entity-dto'

export type Account = EntityDTO<AccountEntity>

export const useAccount = defineStore({
  id: 'account',
  state: () => ({
    account: null as Account | null,
  }),
  actions: {
    async create(createAccountDto: EntityDTO<CreateAccountDto>) {
      this.account = await this.$nuxt.$axios.$post('/account', createAccountDto)
    },
  },
})
