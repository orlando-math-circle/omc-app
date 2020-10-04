import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex'
import { Course } from '../../backend/src/course/course.entity'
import { CreateCourseDto } from '../../backend/src/course/dto/create-course.dto'
import { FindAllCoursesDto } from '../../backend/src/course/dto/find-all-courses.dto'
import { State, StatePayload } from '../interfaces/state.interface'

export const state = () => ({
  status: State.UNLOADED,
  error: null as Error | null,
  courses: [] as Course[],
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
  setCourses(state, courses: Course[]) {
    state.courses = courses
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
        commit('setStatus', { status: State.BUSY })
        const course = await this.$axios.$post('/course', createCourseDto)

        commit('setCourses', [...state.courses, course])
        commit('setStatus', { status: State.WAITING })

        return course
      } catch (error) {
        commit('setStatus', { status: State.ERROR, error })
      }
    },
    async findAll({ commit }, dto: FindAllCoursesDto) {
      commit('setStatus', { status: State.BUSY })
      const [courses, total] = await this.$axios.$get('/course', {
        params: dto,
      })

      commit('setCourses', courses)
      commit('setTotal', total)
      commit('setStatus', { status: State.WAITING })
    },
  }
)
