import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { Course } from '@omc/server/course/course.entity'
import { CreateCourseDto } from '@omc/server/course/dto/create-course.dto'
import { FindAllCoursesDto } from '@omc/server/course/dto/find-all-courses.dto'
import { StateError } from '../types/state-error.interface'
import { StateStatus } from '../types/state.interface'
import { parseAxiosError } from '../utils/utilities'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  course: null as Course | null,
  courses: [] as Course[],
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
  setCourses(state, courses: Course[]) {
    state.courses = courses
  },
  setCourse(state, course: Course) {
    state.course = course
  },
  setTotal(state, total: number) {
    state.total = total
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async create({ commit, state }, createCourseDto: CreateCourseDto) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const course = await this.$axios.$post('/course', createCourseDto)

        commit('setCourses', [...state.courses, course])
        commit('setStatus', StateStatus.WAITING)

        return course
      } catch (error) {
        commit('setError', error)
      }
    },
    async findOne({ commit }, id: number | string) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const course = await this.$axios.$get(`/course/${id}`)

        commit('setCourse', course)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findAll({ commit }, findAllCoursesDto?: FindAllCoursesDto) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const [courses, total] = await this.$axios.$get('/course', {
          params: findAllCoursesDto,
        })

        commit('setCourses', courses)
        commit('setTotal', total)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async findAllByProject(
      { commit },
      {
        project,
        findAllCoursesDto,
      }: { project: number; findAllCoursesDto?: FindAllCoursesDto }
    ) {
      try {
        commit('setStatus', StateStatus.BUSY)

        const [courses, total] = await this.$axios.$get(
          `/course/project/${project}`,
          {
            params: findAllCoursesDto,
          }
        )

        commit('setCourses', courses)
        commit('setTotal', total)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
