import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { File as FileEntity } from '@backend/file/file.entity'
import { FileAttachment } from '../../backend/src/file-attachment/file-attachment.entity'
import { FileField } from '../../backend/src/file-fields/file-field.entity'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  attachment: null as FileAttachment | null,
  attachments: [] as FileAttachment[],
  file: null as FileEntity | null,
  files: [] as FileEntity[],
  fields: [] as FileField[],
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
  setAttachment(state, attachment: FileAttachment) {
    state.attachment = attachment
  },
  setAttachments(state, attachments: FileAttachment[]) {
    state.attachments = attachments
  },
  setFields(state, fields: FileField[]) {
    state.fields = fields
  },
  setFiles(state, files: FileEntity[]) {
    state.files = files
  },
  setFile(state, file: FileEntity) {
    state.file = file
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
        commit('setStatus', StateStatus.BUSY)

        const formData = new FormData()
        formData.append(field, file)

        const attachment = await this.$axios.$post(
          `/attachment/${field}`,
          formData
        )

        commit('setAttachment', attachment)
        commit('setAttachments', [...state.attachments, attachment])
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async uploadFile({ commit }, filesIn: File | File[]) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const formData = new FormData()

        if (Array.isArray(filesIn)) {
          filesIn.forEach((file) => formData.append('file', file))
        } else {
          formData.append('file', filesIn)
        }

        const files = await this.$axios.$post('/file', formData)

        if (Array.isArray(filesIn)) {
          commit('setFiles', files)
        } else {
          commit('setFile', files)
        }
        commit('setStatus', StateStatus.WAITING)

        return files
      } catch (error) {
        commit('setError', error)
      }
    },
    async findMyAttachments({ commit }, field: string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const attachments = await this.$axios.$get(
          `/attachment/user/me/${field}`
        )

        commit('setAttachments', attachments)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findAllAttachments({ commit }, field?: string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const attachments = await this.$axios.$get('/attachment', {
          params: field,
        })

        commit('setAttachments', attachments)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findAllFields({ commit }) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const [fields] = await this.$axios.$get('/file-field')

        commit('setFields', fields)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async delete({ commit }, id: string | number) {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$delete(`/file/${id}`)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
