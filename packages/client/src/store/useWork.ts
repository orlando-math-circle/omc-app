import { defineStore } from 'pinia'
import { VolunteerWork } from '@server/volunteer-work/volunteer-work.entity'
import { CreateWorkDto } from '@server/volunteer-work/dto/create-work.dto'
import { FindAllWorksDto } from '@server/volunteer-work/dto/find-all-works.dto'
import { UpdateWorkDto } from '@server/volunteer-work/dto/update-work.dto'
import { StateStatus, StateError } from '@/types/state.interface'

export const useWork = defineStore({
  id: 'work',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    work: null as VolunteerWork | null,
    works: [] as VolunteerWork[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(createWorkDto: CreateWorkDto) {
      this.work = await this.$nuxt.$axios.$post(
        '/volunteer-work',
        createWorkDto
      )
    },
    async findOne(id: number) {
      this.work = await this.$nuxt.$axios.$get('/volunteer-work/' + id)
    },
    async findAll(findAllWorksDto?: FindAllWorksDto) {
      this.works = await this.$nuxt.$axios.$get('/volunteer-work', {
        params: findAllWorksDto,
      })
    },
    async update(id: number, updateWorkDto: UpdateWorkDto) {
      this.work = await this.$nuxt.$axios.$patch(
        '/volunteer-work/' + id,
        updateWorkDto
      )
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/volunteer-work/' + id)
    },
  },
})
