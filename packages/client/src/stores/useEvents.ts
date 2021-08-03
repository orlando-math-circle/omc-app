import { defineStore } from 'pinia'
import { FindAllEventsDto } from '@server/event/dto/find-all-events.dto'
import { Event } from '@server/event/event.entity'
import { CreateEventDto } from '@server/event/dto/create-event.dto'
import { UpdateEventsDto } from '@server/event/dto/update-events.dto'
import { UpdateEventDto } from '@server/event/dto/update-event.dto'
import { FindAllRegisteredEventsDto } from '@server/event/dto/find-all-registered-events.dto'
import { toLocalISO } from '@/utils/utilities'
import { EntityDTO } from '@server/shared/types/entity-dto'
import { StateStatus, StateError } from '@/types/state.interface'

export type EventEntity = EntityDTO<Event>
export type EventMode = 'single' | 'future' | 'all'

export const useEvents = defineStore({
  id: 'events',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    event: null as EventEntity | null,
    events: [] as EventEntity[],
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
      this.events = await this.$nuxt.$axios.$get('/event/registered', {
        params,
      })
    },
    async update(
      id: number,
      data: EntityDTO<UpdateEventDto> | EntityDTO<UpdateEventsDto>,
      mode: EventMode
    ) {
      await this.$nuxt.$axios.$patch(`/event/${id}/${mode}`, data)
    },
    async delete(id: number, mode: EventMode) {
      await this.$nuxt.$axios.$delete(`/event/${id}/${mode}`)
    },
  },
})
