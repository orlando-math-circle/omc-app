import { defineStore } from 'pinia'
import { Project } from '@server/project/project.entity'
import { CreateProjectDto } from '@server/project/dto/create-project.dto'
import { FindAllProjectsDto } from '@server/project/dto/find-all-projects.dto'
import { UpdateProjectDto } from '@server/project/dto/update-project.dto'

export const useProjects = defineStore({
  id: 'projects',
  state: () => ({
    project: null as Project | null,
    projects: [] as Project[],
  }),
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
