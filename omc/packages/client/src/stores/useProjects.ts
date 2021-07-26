import { defineStore } from 'pinia'
import { Project } from '@server/project/project.entity'
import { CreateProjectDto } from '@server/project/dto/create-project.dto'
import { FindAllProjectsDto } from '@server/project/dto/find-all-projects.dto'
import { UpdateProjectDto } from '@server/project/dto/update-project.dto'
import { StateStatus, StateError } from '@/types/state.interface'

export const useProjects = defineStore({
  id: 'projects',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    project: null as Project | null,
    projects: [] as Project[],
    total: null as number | null,
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(createProjectDto: CreateProjectDto) {
      const project = await this.$nuxt.$axios.$post(
        '/project',
        createProjectDto
      )

      this.projects.push(project)
    },
    async findOne(id: number) {
      this.project = await this.$nuxt.$axios.$get('/project/' + id)
    },
    async findAll(params?: FindAllProjectsDto) {
      const resp = await this.$nuxt.$axios.$get('/project', { params })

      this.projects = resp[0]
      this.total = resp[1]
    },
    async update(id: number, updateProjectDto: UpdateProjectDto) {
      this.project = await this.$nuxt.$axios.$patch(
        '/project/' + id,
        updateProjectDto
      )
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/project/' + id)
    },
  },
})
