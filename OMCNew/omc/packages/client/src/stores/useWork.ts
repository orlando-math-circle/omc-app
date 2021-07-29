import { defineStore } from 'pinia'
import { VolunteerWork } from '@server/volunteer-work/volunteer-work.entity'
import { CreateWorkDto } from '@server/volunteer-work/dto/create-work.dto'
import { FindAllWorksDto } from '@server/volunteer-work/dto/find-all-works.dto'
import { UpdateWorkDto } from '@server/volunteer-work/dto/update-work.dto'
import { StateStatus, StateError } from '@/types/state.interface'
import { EntityDTO } from '@server/shared/types/entity-dto'

export type WorkEntity = EntityDTO<VolunteerWork>

export const useWork = defineStore({
  id: 'work',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    work: null as WorkEntity | null,
    works: [] as WorkEntity[],
    total: null as number | null,
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
      const resp = await this.$nuxt.$axios.$get('/volunteer-work', {
        params: findAllWorksDto,
      })

      this.works = resp[0]
      this.total = resp[1]
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
