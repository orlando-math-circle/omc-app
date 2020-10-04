import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateEventDto } from '../../backend/src/event/dtos/create-event.dto'
import { Event } from '../../backend/src/event/event.entity'
import { CalendarEvent } from '../interfaces/calendar-event.interface'
import { GetEventsDto } from '../interfaces/events/get-events.interface'
import { State } from '../interfaces/state.interface'
import { toLocalISO } from '../utils/utilities'

export const state = () => ({
  status: State.UNLOADED,
  error: null as Error | null,
  events: [] as Event[],
  event: null as Event | null,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === State.BUSY,
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
  setStatus(state, status: State) {
    state.status = status
  },
  setError(state, error: Error) {
    state.error = error
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
      commit('setStatus', State.BUSY)

      await this.$axios.$post('/event', createEventDto)

      commit('setStatus', State.WAITING)
    },
    async findAll({ commit }, { start, end }: GetEventsDto) {
      commit('setStatus', State.BUSY)

      const events = await this.$axios.$get('/event', {
        params: { start, end },
      })

      commit('setEvents', events)
      commit('setStatus', State.WAITING)
    },
    async findOne({ commit }, eventId: number | string) {
      commit('setStatus', State.BUSY)

      const event = await this.$axios.$get(`/event/${eventId}`)

      commit('setEvent', event)
      commit('setStatus', State.WAITING)
    },
  }
)
