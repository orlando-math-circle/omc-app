import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateJobDto } from '../../backend/src/volunteer-job/dto/create-job.dto'
import { UpdateJobDto } from '../../backend/src/volunteer-job/dto/update-job.dto'
import { FindAllJobsDto } from '../../backend/src/volunteer-job/dto/find-all-jobs.dto'
import { VolunteerJob } from '../../backend/src/volunteer-job/volunteer-job.entity'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  job: null as VolunteerJob | null,
  jobs: [] as VolunteerJob[],
  total: 0,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
  isErrored: (state) => state.status === StateStatus.ERROR,
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
  setJobs(state, jobs: VolunteerJob[]) {
    state.jobs = jobs
  },
  setJob(state, job: VolunteerJob) {
    state.job = job
  },
  setTotal(state, total: number) {
    state.total = total
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async create({ commit, state }, createJobDto: CreateJobDto) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const job = await this.$axios.$post('/volunteer-job', createJobDto)

        commit('setJobs', [...state.jobs, job])
        commit('setStatus', StateStatus.WAITING)

        return job
      } catch (error) {
        commit('setError', error)
      }
    },
    async findOne({ commit }, id: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const job = await this.$axios.$get('/volunteer-job/' + id)

        commit('setJob', job)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findAll({ commit }, findAllJobsDto?: FindAllJobsDto) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const [jobs, count] = await this.$axios.$get('/volunteer-job', {
          params: findAllJobsDto,
        })

        commit('setJobs', jobs)
        commit('setTotal', count)
        commit('setStatus', StateStatus.WAITING)

        return jobs
      } catch (error) {
        commit('setError', error)
      }
    },
    async update(
      { commit },
      { id, updateJobDto }: { id: number | string; updateJobDto: UpdateJobDto }
    ) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const job = await this.$axios.$patch(
          '/volunteer-job/' + id,
          updateJobDto
        )

        commit('setJob', job)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async delete({ commit }, id: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$delete('/volunteer-job/' + id)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
