import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { Event } from '../../backend/src/event/event.entity'
import { CreateEventDto } from '../interfaces/events/create-event.interface'
import { GetEventsDto } from '../interfaces/events/get-events.interface'
import { StateStatus } from '../interfaces/state-status.enum'
import { CalendarEvent } from '../interfaces/calendar-event.interface'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as Error | null,
  events: [] as Event[],
})

export type EventState = ReturnType<typeof state>

export const getters: GetterTree<EventState, EventState> = {
  isLoading: (state) => state.status === StateStatus.BUSY,
  events: (state): CalendarEvent[] =>
    state.events.map((e) => {
      const start = new Date(e.dtstart)
      const end = e.dtend ? new Date(e.dtend) : undefined

      return Object.assign(e, {
        start: new Date(start.getTime() - start.getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 16),
        end: end
          ? new Date(end.getTime() - end.getTimezoneOffset() * 60000)
              .toISOString()
              .substr(0, 16)
          : undefined,
      })
    }),
}

export const mutations: MutationTree<EventState> = {
  SET_STATUS: (state, status: StateStatus) => (state.status = status),
  SET_ERROR: (state, error: Error | null) => (state.error = error),
  SET_EVENTS: (state, events: Event[]) => (state.events = events),
}

export const actions: ActionTree<EventState, EventState> = {
  async fetchEvents({ commit }, { start, end }: GetEventsDto) {
    commit('SET_STATUS', StateStatus.BUSY)

    const events = await this.$axios.$get('/event', { params: { start, end } })

    commit('SET_EVENTS', events)
    commit('SET_STATUS', StateStatus.WAITING)
  },
  async createEvent({ commit }, createEventDto: CreateEventDto) {
    commit('SET_STATUS', StateStatus.BUSY)

    await this.$axios.$post('/event', createEventDto)

    commit('SET_STATUS', StateStatus.WAITING)
  },
}
