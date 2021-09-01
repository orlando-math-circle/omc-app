import { StateError, StateStatus } from '@/types/state.interface'
import type { ActivityRecord as ActivityRecordEntity } from '@server/activity-record/activity-record.entity'
import { EntityDTO } from '@server/shared/types/entity-dto'
import { defineStore } from 'pinia'
import { UserEntity } from './useAuth'
import { EventEntity } from './useEvents'
import { RegistrationEntity } from './useRegistrations'

export type RecordEntity = EntityDTO<ActivityRecordEntity>

export const useActivityRecords = defineStore({
  id: 'audit',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    record: null as RecordEntity | null,
    records: [] as RecordEntity[],
    users: [] as UserEntity[],
    events: [] as EventEntity[],
    registrations: [] as RegistrationEntity[],
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
