import { defineStore } from 'pinia'
import { Course } from '../../../server/src/course/course.entity'
import { CreateCourseDto } from '../../../server/src/course/dto/create-course.dto'
import { FindAllCoursesDto } from '../../../server/src/course/dto/find-all-courses.dto'

export const useCourses = defineStore({
  id: 'courses',
  state: () => ({
    course: null as Course | null,
    courses: [] as Course[],
  }),
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
