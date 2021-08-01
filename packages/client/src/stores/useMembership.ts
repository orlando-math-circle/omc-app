import { defineStore } from 'pinia'
import { CreateMembershipDto } from '@server/membership/dto/create-membership.dto'
import { EntityDTO } from '@server/shared/types/entity-dto'
import { StateStatus, StateError } from '@/types/state.interface'
import { Membership } from '@server/membership/membership.entity'

export type MembershipEntity = EntityDTO<Membership>

export const useMembership = defineStore({
  id: 'Membership',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    membership: null as MembershipEntity | null,
    memberships: [] as MembershipEntity[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(createMembershipDto: CreateMembershipDto) {
      await this.$nuxt.$axios.$post('/membership', createMembershipDto)
    },
    async findOne(id: number) {
      this.membership = await this.$nuxt.$axios.$get('/membership/' + id)
    },
    async findMemberships() {
      this.memberships = await this.$nuxt.$axios.$get('/membership/')
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete(`/memership/${id}`)
    },
  },
})
