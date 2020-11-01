import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { FileAttachment } from '../../backend/src/file-attachment/file-attachment.entity'
import { State, StatePayload } from '../interfaces/state.interface'

export const state = () => ({
  status: State.UNLOADED,
  error: null as Error | null,
  attachment: null as FileAttachment | null,
  attachments: [] as FileAttachment[],
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === State.BUSY,
})

export const mutations = mutationTree(state, {
  setStatus(state, { status, error }: StatePayload) {
    state.status = status
    state.error = error || null
  },
  setAttachment(state, attachment: FileAttachment) {
    state.attachment = attachment
  },
  setAttachments(state, attachments: FileAttachment[]) {
    state.attachments = attachments
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async uploadAttachment(
      { commit, state },
      { file, field }: { file: File; field: string }
    ) {
      try {
        commit('setStatus', { status: State.BUSY })

        const formData = new FormData()
        formData.append(field, file)

        const attachment = await this.$axios.$post(
          `/attachment/${field}`,
          formData
        )

        commit('setAttachment', attachment)
        commit('setAttachments', [...state.attachments, attachment])
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async findMyAttachments({ commit }, field: string) {
      try {
        commit('setStatus', { status: State.BUSY })

        const attachments = await this.$axios.$get(
          `/attachment/user/me/${field}`
        )

        commit('setAttachments', attachments)
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async findAllAttachments({ commit }, field?: string) {
      try {
        commit('setStatus', { status: State.BUSY })

        const attachments = await this.$axios.$get('/attachment', {
          params: field,
        })

        commit('setAttachments', attachments)
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
  }
)
