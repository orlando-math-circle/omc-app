import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateProjectDto } from '../../backend/src/project/dto/create-project.dto'
import { FindAllProjectsDto } from '../../backend/src/project/dto/find-all-projects.dto'
import { Project } from '../../backend/src/project/project.entity'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  projects: [] as Project[],
  total: 0,
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
  setProjects(state, projects: Project[]) {
    state.projects = projects
  },
  setTotal(state, total: number) {
    state.total = total
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async create({ commit, state }, createProjectDto: CreateProjectDto) {
      try {
        commit('setStatus', StateStatus.BUSY)
        const project = await this.$axios.$post('/project', createProjectDto)

        commit('setProjects', [...state.projects, project])
        commit('setStatus', StateStatus.WAITING)

        return project
      } catch (error) {
        commit('setError', error)
      }
    },
    async findAll({ commit }, findAllProjectsDto?: FindAllProjectsDto) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const [projects, count] = await this.$axios.$get('/project', {
          params: findAllProjectsDto,
        })

        commit('setProjects', projects)
        commit('setTotal', count)
        commit('setStatus', StateStatus.WAITING)

        return [projects, count]
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
