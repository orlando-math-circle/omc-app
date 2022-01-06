import { defineStore } from 'pinia'
import { ActivityRecord } from '@omc/server'
import { User, Event, EventRegistration } from '@/stores'
import { StateError, StateStatus } from '@/types/state.interface'

export { ActivityRecord }

export const useActivityRecords = defineStore({
  id: 'audit',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    record: null as ActivityRecord | null,
    records: [] as ActivityRecord[],
    users: [] as User[],
    events: [] as Event[],
    registrations: [] as EventRegistration[],
    count: 0,
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async findOne(id: number) {
      const { records, users, events, registrations, count } =
        await this.$nuxt.$axios.$get(`/activity-record/${id}`)

      this.record = records[0] || null
      this.users = users
      this.events = events
      this.registrations = registrations
      this.count = count
    },
    async findAll() {
      const { records, users, events, registrations, count } =
        await this.$nuxt.$axios.$get('/activity-record')

      this.records = records
      this.users = users
      this.events = events
      this.registrations = registrations
      this.count = count
    },
  },
})
