import { defineStore } from 'pinia'

export const useTwitter = defineStore({
  id: 'twitter',
  state: () => ({
    tweets: [] as any[],
  }),
  actions: {
    async findAll() {
      this.tweets = await this.$nuxt.$axios.$get('/twitter')
    },
  },
})
