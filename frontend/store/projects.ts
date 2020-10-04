import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateProjectDto } from '../../backend/src/project/dto/create-project.dto'
import { FindAllProjectsDto } from '../../backend/src/project/dto/find-all-projects.dto'
import { Project } from '../../backend/src/project/project.entity'
import { State, StatePayload } from '../interfaces/state.interface'

export const state = () => ({
  status: State.UNLOADED,
  error: null as Error | null,
  projects: [] as Project[],
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
        commit('setStatus', { status: State.BUSY })
        const project = await this.$axios.$post('/project', createProjectDto)

        commit('setProjects', [...state.projects, project])
        commit('setStatus', { status: State.WAITING })

        return project
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async findAll({ commit }, findAllProjectsDto: FindAllProjectsDto) {
      commit('setStatus', { status: State.BUSY })

      const [projects, count] = await this.$axios.$get('/project', {
        params: findAllProjectsDto,
      })

      commit('setProjects', projects)
      commit('setTotal', count)
      commit('setStatus', { status: State.WAITING })

      return [projects, count]
    },
  }
)
