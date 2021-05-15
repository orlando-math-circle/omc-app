import { defineStore } from 'pinia'
import { File as FileEntity } from '@server/file/file.entity'

export const useFiles = defineStore({
  id: 'files',
  state: () => ({
    file: null as FileEntity | null,
    files: [] as FileEntity[],
  }),
  actions: {
    async create(...files: File[]) {
      const formData = new FormData()

      files.forEach((f) => formData.append('file', f))

      const resp = await this.$nuxt.$axios.$post('/file', formData)

      if (Array.isArray(resp)) {
        this.files = resp
      } else {
        this.file = resp
      }

      return resp
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/file/' + id)
    },
  },
})
