import { StateError, StateStatus } from '@/types/state.interface'
import { Course } from '@server/course/course.entity'
import { CreateCourseDto } from '@server/course/dto/create-course.dto'
import { FindAllCoursesDto } from '@server/course/dto/find-all-courses.dto'
import { EntityDTO } from '@server/shared/types/entity-dto'
import { defineStore } from 'pinia'

export type CourseEntity = EntityDTO<Course>

export const useCourses = defineStore({
  id: 'courses',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    course: null as CourseEntity | null,
    courses: [] as CourseEntity[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(createCourseDto: CreateCourseDto) {
      this.course = await this.$nuxt.$axios.$post('/course', createCourseDto)
    },
    async findOne(id: number) {
      this.course = await this.$nuxt.$axios.$get('/course/' + id)
    },
    async findAll(findAllCoursesDto?: FindAllCoursesDto) {
      this.courses = (
        await this.$nuxt.$axios.$get('/course', { params: findAllCoursesDto })
      )[0]
    },
    async findAllByProject(
      projectId: number,
      findAllCoursesDto?: FindAllCoursesDto
    ) {
      this.courses = (
        await this.$nuxt.$axios.$get('/course/project/' + projectId, {
          params: findAllCoursesDto,
        })
      )[0]
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/course/' + id)
    },
  },
})
