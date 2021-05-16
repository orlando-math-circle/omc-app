import { defineStore } from 'pinia'
import { VolunteerJob } from '@server/volunteer-job/volunteer-job.entity'
import { CreateJobDto } from '@server/volunteer-job/dto/create-job.dto'
import { FindAllJobsDto } from '@server/volunteer-job/dto/find-all-jobs.dto'
import { UpdateJobDto } from '@server/volunteer-job/dto/update-job.dto'
import { StateStatus, StateError } from '@/types/state.interface'

export const useJobs = defineStore({
  id: 'jobs',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    job: null as VolunteerJob | null,
    jobs: [] as VolunteerJob[],
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
      this.jobs = await this.$nuxt.$axios.$get('/volunteer-job', {
        params: findAllJobsDto,
      })
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
