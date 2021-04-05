import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { CreateProjectDto } from '@omc/server/project/dto/create-project.dto'
import { FindAllProjectsDto } from '@omc/server/project/dto/find-all-projects.dto'
import { UpdateProjectDto } from '@omc/server/project/dto/update-project.dto'
import { Project } from '@omc/server/project/project.entity'
import { StateError } from '../interfaces/state-error.interface'
import { StateStatus } from '../interfaces/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  project: null as Project | null,
  projects: [] as Project[],
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
  setProjects(state, projects: Project[]) {
    state.projects = projects
  },
  setProject(state, project: Project) {
    state.project = project
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
    async findOne({ commit }, id: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const project = await this.$axios.$get('/project/' + id)

        commit('setProject', project)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async update(
      { commit },
      {
        id,
        updateProjectDto,
      }: { id: number | string; updateProjectDto: UpdateProjectDto }
    ) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const project = await this.$axios.$patch(
          '/project/' + id,
          updateProjectDto
        )

        commit('setProject', project)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async delete({ commit }, id: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$delete('/project/' + id)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
