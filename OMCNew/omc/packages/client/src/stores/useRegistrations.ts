import { defineStore } from 'pinia'
import { CreateRegistrationDto } from '@server/event-registration/dtos/create-registration.dto'
import { CreateVolunteerRegistrationDto } from '@server/event-registration/dtos/create-volunteer-registration.dto'
import { EventRegistrationStatus } from '@server/event-registration/dtos/event-registration-status.dto'
import { EventRegistration } from '@server/event-registration/event-registration.entity'
import { UpdateOwnEventRegistrationDto } from '@server/event-registration/dtos/update-event-registration.dto'
import { EntityDTO } from '@server/shared/types/entity-dto'
import { StateStatus, StateError } from '@/types/state.interface'

export type RegistrationEntity = EntityDTO<EventRegistration>
export type RegistrationStatusEntity = EntityDTO<EventRegistrationStatus>

export const useRegistrations = defineStore({
  id: 'registrations',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    registration: null as RegistrationEntity | null,
    registrations: [] as RegistrationEntity[],
    total: null as number | null,
    statuses: [] as RegistrationStatusEntity[],
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
