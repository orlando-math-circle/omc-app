import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { State, StatePayload } from '../interfaces/state.interface'
import { VolunteerJob } from '../../backend/src/volunteer-job/volunteer-job.entity'
import { CreateJobDto } from '../../backend/src/volunteer-job/dto/create-job.dto'
import { FindAllJobsDto } from '../../backend/src/volunteer-job/dto/find-all-jobs.dto'

export const state = () => ({
  status: State.UNLOADED,
  error: null as Error | null,
  job: null as VolunteerJob | null,
  jobs: [] as VolunteerJob[],
  total: 0,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === State.BUSY,
})

export const mutations = mutationTree(state, {
  setStatus(state, { status, error }: StatePayload) {
    state.status = status
    state.error = error || null
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
        commit('setStatus', { status: State.BUSY })

        const job = await this.$axios.$post('/volunteer-job', createJobDto)

        commit('setJobs', [...state.jobs, job])
        commit('setStatus', { status: State.WAITING })

        return job
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async findAll({ commit }, findAllJobsDto?: FindAllJobsDto) {
      try {
        commit('setStatus', { status: State.BUSY })

        const [jobs, count] = await this.$axios.$get('/volunteer-job', {
          params: findAllJobsDto,
        })

        commit('setJobs', jobs)
        commit('setTotal', count)
        commit('setStatus', { status: State.WAITING })

        return jobs
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
  }
)
