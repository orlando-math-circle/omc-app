import { defineStore } from 'pinia'
import {
  Event,
  CreateEventDto,
  UpdateEventDto,
  UpdateEventsDto,
  FindAllEventsDto,
  FindAllRegisteredEventsDto,
} from '@omc/server'
import { toLocalISO } from '@/utils/utilities'
import { StateStatus, StateError } from '@/types/state.interface'

export { Event }

export type EventMode = 'single' | 'future' | 'all'

export const useEvents = defineStore({
  id: 'events',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    event: null as Event | null,
    events: [] as Event[],
    defaultPicture: require('~/assets/images/programmer.jpg'),
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
    calendarEvents: (state) =>
      state.events.map((e) => ({
        ...e,
        start: toLocalISO(e.dtstart),
        end: e.dtend ? toLocalISO(e.dtend) : undefined,
      })),
    dates(): string[] {
      return this.calendarEvents.map((e) => e.start.substr(0, 10))
    },
  },
  actions: {
    async create(createEventDto: CreateEventDto) {
      await this.$nuxt.$axios.$post('/event', createEventDto)
    },
    async findOne(id: number) {
      this.event = await this.$nuxt.$axios.$get('/event/' + id)
    },
    async findAll(findAllEventsDto?: FindAllEventsDto) {
      this.events = await this.$nuxt.$axios.$get('/event', {
        params: findAllEventsDto,
      })
    },
    async findAllRegistered(params: FindAllRegisteredEventsDto) {
      const [events] = await this.$nuxt.$axios.$get('/event/registered', {
        params,
      })

      this.events = events
    },
    async update(
      id: number,
      data: UpdateEventDto | UpdateEventsDto,
      mode: EventMode
    ) {
      await this.$nuxt.$axios.$patch(`/event/${id}/${mode}`, data)
    },
    async delete(id: number, mode: EventMode) {
      await this.$nuxt.$axios.$delete(`/event/${id}/${mode}`)
    },
    createOrder(eventId: number, userIds: number[]) {
      return this.$nuxt.$axios.$post(`/registration/order/create/${eventId}`, {
        userIds,
      })
    },
    captureOrder(eventId: number, orderId: number) {
      return this.$nuxt.$axios.$post(
        `/registration/order/capture/${eventId}/${orderId}`
      )
    },
  },
})
