import { defineStore } from 'pinia'
import { FileAttachment } from '@server/file-attachment/file-attachment.entity'
import { FileField } from '@server/file-fields/file-field.entity'
import { StateStatus, StateError } from '@/types/state.interface'

export const useAttachments = defineStore({
  id: 'attachments',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    attachment: null as FileAttachment | null,
    attachments: [] as FileAttachment[],
    fields: [] as FileField[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(field: string, file: File) {
      const formData = new FormData()
      formData.append(field, file)

      const attachment = await this.$nuxt.$axios.$post(
        '/attachment/' + field,
        formData
      )

      this.attachment = attachment
      this.attachments.push(attachment)
    },
    async findOne(id: number) {
      this.attachment = await this.$nuxt.$axios.$get('/attachment/' + id)
    },
    async findAll(field?: string, own = false) {
      this.attachments = await this.$nuxt.$axios.$get(
        '/attachment/' + (own ? 'user/me/' : '') + field
      )
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/attachment/' + id)

      if (this.attachment?.id === id) {
        this.attachment = null
      }

      const index = this.attachments.findIndex((a) => a.id === id)

      if (index !== -1) {
        this.attachments.splice(index, 1)
      }
    },
  },
})
