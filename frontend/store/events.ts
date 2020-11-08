import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateEventDto } from '../../backend/src/event/dtos/create-event.dto'
import { FindAllEventsDto } from '../../backend/src/event/dtos/find-all-events.dto'
import { Event } from '../../backend/src/event/event.entity'
import { CalendarEvent } from '../interfaces/calendar-event.interface'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError, toLocalISO } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  events: [] as Event[],
  event: null as Event | null,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
  calendarEvents: (state): CalendarEvent[] =>
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
  setEvents(state, events: Event[]) {
    state.events = events
  },
  setEvent(state, event: Event) {
    state.event = event
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async create({ commit }, createEventDto: CreateEventDto) {
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
  }
)
