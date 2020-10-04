import { actionTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateRegistrationDto } from '../../backend/src/event-registration/dtos/create-registration.dto'
import { EventRegistrationStatus } from '../../backend/src/event-registration/dtos/event-registration-status.dto'
import { EventRegistration } from '../../backend/src/event-registration/event-registration.entity'
import { State } from '../interfaces/state.interface'

export const state = () => ({
  status: State.UNLOADED,
  registration: null as EventRegistration | null,
  registrationStatuses: [] as EventRegistrationStatus[],
})

export const mutations = mutationTree(state, {
  setStatus(state, status: State) {
    state.status = status
  },
  setRegistration(state, registration: EventRegistration) {
    state.registration = registration
  },
  setStatuses(state, statuses: EventRegistrationStatus[]) {
    state.registrationStatuses = statuses
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async create({ commit }, createRegistrationDto: CreateRegistrationDto) {
      commit('setStatus', State.BUSY)

      const registration: EventRegistration = await this.$axios.$post(
        '/registration',
        createRegistrationDto
      )

      commit('setRegistration', registration)
      commit('setStatus', State.WAITING)
    },
    async getStatuses({ commit }, eventId: number | string) {
      commit('setStatus', State.BUSY)
      const status: EventRegistrationStatus[] = await this.$axios.$get(
        `/registration/status/${eventId}`
      )

      commit('setStatuses', status)
      commit('setStatus', State.WAITING)
    },
  }
)
