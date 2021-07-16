import { defineStore } from 'pinia'
import { MarkAttendanceDto } from '@server/attendance/dtos/mark-attendance.dto'
import { UpdateAttendanceDto } from '@server/attendance/dtos/update-attendance.dto'
import { EntityDTO } from '@server/shared/types/entity-dto'
import { StateStatus, StateError } from '@/types/state.interface'
import { Attendance } from '@server/attendance/attendance.entity'

export type AttendanceEntity = EntityDTO<Attendance>

export const useAttendance = defineStore({
  id: 'attendance',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    attendance: null as AttendanceEntity | null,
    attendances: [] as AttendanceEntity[],
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
    async findAll() {
      const resp = await this.$nuxt.$axios.$get('/attendance', {})

      this.attendances = resp[0]
    },
    async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
      this.attendance = await this.$nuxt.$axios.$patch(
        '/attendance/' + id,
        updateAttendanceDto
      )
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/attendace/' + id)
    },
  },
})
