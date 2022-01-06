import { defineStore } from 'pinia'
import {
  EventRegistration,
  EventRegistrationStatus,
  CreateRegistrationDto,
  CreateVolunteerRegistrationDto,
  UpdateOwnEventRegistrationDto,
} from '@omc/server'
import { StateStatus, StateError } from '@/types/state.interface'

export { EventRegistration, EventRegistrationStatus }

export const useRegistrations = defineStore({
  id: 'registrations',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    registration: null as EventRegistration | null,
    registrations: [] as EventRegistration[],
    total: null as number | null,
    statuses: [] as EventRegistrationStatus[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(
      data: CreateRegistrationDto | CreateVolunteerRegistrationDto,
      volunteering = false
    ) {
      this.registration = await this.$nuxt.$axios.$post(
        '/registration' + (volunteering ? '/volunteer' : ''),
        data
      )
    },
    async swap(id: number) {
      await this.$nuxt.$axios.$post(`/registration/swap/${id}`)
    },
    async findOne(id: number) {
      this.registration = await this.$nuxt.$axios.$get('/registration/' + id)
    },
    async findAll(params?: { volunteering?: boolean; coverable?: boolean }) {
      const resp = await this.$nuxt.$axios.$get('/registration', {
        params,
      })

      this.registrations = resp[0]
      this.total = resp[1]
    },
    async findStatuses(eventId: number) {
      this.statuses = await this.$nuxt.$axios.$get(
        '/registration/status/' + eventId
      )
    },
    async update(
      id: number,
      updateOwnEventRegistrationDto: UpdateOwnEventRegistrationDto
    ) {
      await this.$nuxt.$axios.$patch(
        `/registration/${id}`,
        updateOwnEventRegistrationDto
      )
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/registration/' + id)
    },
  },
})
