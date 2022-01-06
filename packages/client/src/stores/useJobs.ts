import { defineStore } from 'pinia'
import {
  VolunteerJob,
  CreateJobDto,
  FindAllJobsDto,
  UpdateJobDto,
} from '@omc/server'
import { StateStatus, StateError } from '@/types/state.interface'

export { VolunteerJob }

export const useJobs = defineStore({
  id: 'jobs',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    job: null as VolunteerJob | null,
    jobs: [] as VolunteerJob[],
    total: null as number | null,
  }),
  actions: {
    async create(createJobDto: CreateJobDto) {
      const job = await this.$nuxt.$axios.$post('/volunteer-job', createJobDto)

      this.jobs.push(job)
    },
    async findOne(id: number) {
      this.job = await this.$nuxt.$axios.$get('/volunteer-job/' + id)
    },
    async findAll(findAllJobsDto?: FindAllJobsDto) {
      const resp = await this.$nuxt.$axios.$get('/volunteer-job', {
        params: findAllJobsDto,
      })

      this.jobs = resp[0]
      this.total = resp[1]
    },
    async update(id: number, updateJobDto: UpdateJobDto) {
      this.job = await this.$nuxt.$axios.$patch(
        '/volunteer-job/' + id,
        updateJobDto
      )
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/volunteer-job/' + id)
    },
  },
})
