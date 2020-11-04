import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateRegistrationDto } from '../../backend/src/event-registration/dtos/create-registration.dto'
import { EventRegistrationStatus } from '../../backend/src/event-registration/dtos/event-registration-status.dto'
import { EventRegistration } from '../../backend/src/event-registration/event-registration.entity'
import { State, StatePayload } from '../interfaces/state.interface'

export const state = () => ({
  status: State.UNLOADED,
  error: null as Error | null,
  registration: null as EventRegistration | null,
  registrationStatuses: [] as EventRegistrationStatus[],
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === State.BUSY,
})

export const mutations = mutationTree(state, {
  setStatus(state, { status, error }: StatePayload) {
    state.status = status
    state.error = error || null
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
        commit('setStatus', { status: State.BUSY })

        const registration: EventRegistration = await this.$axios.$post(
          '/registration',
          createRegistrationDto
        )

        commit('setRegistration', registration)
        commit('setStatus', { status: State.WAITING })
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async getStatuses({ commit }, eventId: number | string) {
      try {
        commit('setStatus', { status: State.BUSY })

        const status: EventRegistrationStatus[] = await this.$axios.$get(
          `/registration/status/${eventId}`
        )

        commit('setStatuses', status)
        commit('setStatus', { status: State.WAITING })
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
  }
)
