import { defineStore } from 'pinia'
import {
  Membership,
  CreateMembershipDto,
  MembershipStatusDto,
} from '@omc/server'
import { StateStatus, StateError } from '@/types/state.interface'

export const useMembership = defineStore({
  id: 'Membership',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    membership: null as Membership | null,
    memberships: [] as Membership[],
    statuses: [] as MembershipStatusDto[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(createMembershipDto: CreateMembershipDto) {
      this.membership = await this.$nuxt.$axios.$post(
        '/membership',
        createMembershipDto
      )
    },
    async findOne(id: number) {
      this.membership = await this.$nuxt.$axios.$get('/membership/' + id)
    },
    async findAll(params?: {
      limit?: number
      offset?: number
      account?: boolean
      active?: boolean
    }) {
      const [memberships] = await this.$nuxt.$axios.$get('/membership/', {
        params,
      })

      this.memberships = memberships
    },
    async findStatuses() {
      this.statuses = await this.$nuxt.$axios.$get('/membership/statuses')
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete(`/membership/${id}`)
    },
    createOrder(createMembershipDto: CreateMembershipDto) {
      return this.$nuxt.$axios.$post(
        '/membership/order/create',
        createMembershipDto
      )
    },
    captureOrder(orderId: string) {
      return this.$nuxt.$axios.$post(`/membership/order/capture/${orderId}`)
    },
  },
})
