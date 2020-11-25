import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateRegistrationDto } from '../../backend/src/event-registration/dtos/create-registration.dto'
import { EventRegistrationStatus } from '../../backend/src/event-registration/dtos/event-registration-status.dto'
import { EventRegistration } from '../../backend/src/event-registration/event-registration.entity'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  registration: null as EventRegistration | null,
  registrationStatuses: [] as EventRegistrationStatus[],
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
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
      try {
        commit('setStatus', StateStatus.BUSY)

        const registration: EventRegistration = await this.$axios.$post(
          '/registration',
          createRegistrationDto
        )

        commit('setRegistration', registration)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async getStatuses({ commit }, eventId: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const status: EventRegistrationStatus[] = await this.$axios.$get(
          `/registration/status/${eventId}`
        )

        commit('setStatuses', status)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async delete({ commit }, id: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$delete(`/registration/${id}`)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
