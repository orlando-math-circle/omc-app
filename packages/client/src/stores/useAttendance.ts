import { defineStore } from 'pinia'
import {
  Attendance,
  AttendanceStatus,
  MarkAttendanceDto,
  UpdateAttendanceDto,
  FindAllAttendancesDto,
} from '@omc/server'
import { StateStatus, StateError } from '@/types/state.interface'

export { Attendance, AttendanceStatus }

export const useAttendance = defineStore({
  id: 'attendance',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    attendance: null as Attendance | null,
    attendances: [] as Attendance[],
    statuses: [] as AttendanceStatus[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(markAttendanceDto: MarkAttendanceDto) {
      this.attendance = await this.$nuxt.$axios.$post(
        '/attendance',
        markAttendanceDto
      )
    },
    async findOne(id: number) {
      this.attendance = await this.$nuxt.$axios.$get('/attendance/' + id)
    },
    async findAll(findAllAttendancesDto?: FindAllAttendancesDto) {
      const resp = await this.$nuxt.$axios.$get('/attendance', {
        params: findAllAttendancesDto,
      })

      this.attendances = resp[0]
    },
    async findStatuses(eventId: number) {
      this.statuses = await this.$nuxt.$axios.$get(
        '/attendance/status/' + eventId
      )
    },

    async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
      this.attendance = await this.$nuxt.$axios.$patch(
        '/attendance/' + id,
        updateAttendanceDto
      )
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/attendance/' + id)
    },
  },
})
