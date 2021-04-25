import { defineStore } from 'pinia'
import { StateStatus, StateError } from '@/types/state.interface'

export const useTwitter = defineStore({
  id: 'twitter',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    tweets: [] as any[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async findAll() {
      this.tweets = await this.$nuxt.$axios.$get('/twitter')
    },
  },
})
