import { ActionTree, MutationTree } from 'vuex'
import { Course } from '../../backend/src/course/course.entity'
import { CreateCourseDto } from '../../backend/src/course/dtos/create-course.dto'
import { StateStatus } from '../interfaces/state-status.enum'

export const state = () => ({
  status: StateStatus.UNLOADED,
  course: null as Course | null,
  courses: [] as Course[],
})

export type CourseState = ReturnType<typeof state>

export const mutations: MutationTree<CourseState> = {
  SET_STATUS: (state, status: StateStatus) => (state.status = status),
  SET_COURE: (state, course: Course) => (state.course = course),
  SET_COURSES: (state, courses: Course[]) => (state.courses = courses),
}

export const actions: ActionTree<CourseState, CourseState> = {
  async createCourse({ commit }, dto: CreateCourseDto) {
    commit('SET_STATUS', StateStatus.BUSY)

    const course = await this.$axios.$post('/course', dto)

    commit('SET_EVENT', course)
    commit('SET_STATUS', StateStatus.WAITING)
  },
  async getCourses({ commit }) {
    commit('SET_STATUS', StateStatus.BUSY)

    const courses = await this.$axios.$get('/course')

    commit('SET_EVENTS', courses)
    commit('SET_STATUS', StateStatus.WAITING)
  },
}
