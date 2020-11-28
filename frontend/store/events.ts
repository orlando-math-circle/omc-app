import { UpdateEventDto } from '@backend/event/dto/update-event.dto'
import { UpdateEventsDto } from '@backend/event/dto/update-events.dto'
import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateEventDto } from '../../backend/src/event/dto/create-event.dto'
import { FindAllEventsDto } from '../../backend/src/event/dto/find-all-events.dto'
import { Event } from '../../backend/src/event/event.entity'
import { CalendarEvent } from '../interfaces/calendar-event.interface'
import { DTO } from '../interfaces/date-to-string.interface'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError, toLocalISO } from '../utils/utilities'

export type DTOEvent = DTO<Event>

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  events: [] as DTOEvent[],
  event: null as DTOEvent | null,
  defaultPicture: require('~/assets/images/programmer.jpg'),
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
  isErrored: (state) => state.status === StateStatus.ERROR,
  calendarEvents: (state): DTOEvent[] =>
    state.events.map((event) =>
      Object.assign(event, {
        start: toLocalISO(event.dtstart),
        end: event.dtend ? toLocalISO(event.dtend) : undefined,
      })
    ),
  dates: (_state, getters): string[] =>
    getters.calendarEvents.map((e: CalendarEvent) => e.start.substr(0, 10)),
})

export const mutations = mutationTree(state, {
  setStatus(state, status: StateStatus) {
    state.status = status

    if (status === StateStatus.BUSY) {
      state.error = null
    }
  },
  setError(state, error: any) {
    state.status = StateStatus.ERROR
    state.error = parseAxiosError(error)
  },
  setEvents(state, events: DTOEvent[]) {
    state.events = events
  },
  setEvent(state, event: DTOEvent) {
    state.event = event
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async create({ commit }, createEventDto: DTO<CreateEventDto>) {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$post('/event', createEventDto)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findAll({ commit }, findAllEventsDto?: FindAllEventsDto) {
      try {
        commit('setStatus', StateStatus.BUSY)
        const events = await this.$axios.$get('/event', {
          params: findAllEventsDto,
        })

        commit('setEvents', events)
        commit('setStatus', StateStatus.WAITING)

        return events
      } catch (error) {
        console.error(`Error: ${error}`)
        // commit('setError', error)
      }
    },
    async findOne({ commit }, eventId: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const event = await this.$axios.$get(`/event/${eventId}`)

        commit('setEvent', event)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async update(
      { commit },
      {
        id,
        dto,
        type,
      }: {
        id: number | string
        dto: DTO<UpdateEventDto> | DTO<UpdateEventsDto>
        type: 'single' | 'future' | 'all'
      }
    ) {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$patch(`/event/${id}/${type}`, dto)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
