import { defineStore } from 'pinia'
import { File as FileEntity } from '@server/file/file.entity'
import { StateStatus, StateError } from '@/types/state.interface'

export const useFiles = defineStore({
  id: 'files',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    file: null as FileEntity | null,
    files: [] as FileEntity[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
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
