import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { CreateProjectDto } from '../../backend/src/project/dto/create-project.dto'
import { FindAllProjectsDto } from '../../backend/src/project/dto/find-all-projects.dto'
import { Project } from '../../backend/src/project/project.entity'
import { StateStatus } from '../interfaces/state-status.enum'

export const state = () => ({
  status: StateStatus.UNLOADED,
  projects: [] as Project[],
  total: 0,
})

export type ProjectState = ReturnType<typeof state>

export const getters: GetterTree<ProjectState, ProjectState> = {
  isLoading: (state) => state.status === StateStatus.BUSY,
}

export const mutations: MutationTree<ProjectState> = {
  SET_STATUS: (state, status: StateStatus) => (state.status = status),
  SET_PROJECTS: (state, projects: Project[]) => (state.projects = projects),
  SET_TOTAL: (state, number: number) => (state.total = number),
}

export const actions: ActionTree<ProjectState, ProjectState> = {
  async create({ commit }, createProjectDto: CreateProjectDto) {
    commit('SET_STATUS', StateStatus.BUSY)

    const project = await this.$axios.$post('/project', createProjectDto)

    commit('SET_STATUS', StateStatus.WAITING)

    return project
  },
  async findAll({ commit }, findAllProjectsDto: FindAllProjectsDto) {
    commit('SET_STATUS', StateStatus.BUSY)

    const [projects, count] = await this.$axios.$get('/project', {
      params: findAllProjectsDto,
    })

    commit('SET_PROJECTS', projects)
    commit('SET_TOTAL', count)
    commit('SET_STATUS', StateStatus.WAITING)

    return [projects, count]
  },
}
