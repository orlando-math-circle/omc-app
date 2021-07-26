import { defineStore } from 'pinia'
import { AuditLogDto } from '@server/audit-log/dto/audit-log.dto'
import { EntityDTO } from '@server/shared/types/entity-dto'
import { StateStatus, StateError } from '@/types/state.interface'
import { AuditLog } from '@server/audit-log/audit-log.entity'

export type AuditLogEntity = EntityDTO<AuditLog>

export const useAuditLogs = defineStore({
  id: 'audit',
  state: () => ({
    status: 'Idle' as StateStatus,
    error: null as StateError | null,
    auditLog: null as AuditLogEntity | null,
    auditLogs: [] as AuditLogEntity[],
  }),
  getters: {
    isLoading: (state) => state.status === 'Loading',
  },
  actions: {
    async create(dto: AuditLogDto) {
      this.auditLog = await this.$nuxt.$axios.$post(
        '/auditLog',
        dto
      )
    },
    async findOne(id: number) {
      this.auditLog = await this.$nuxt.$axios.$get('/auditLog/' + id)
    },
    async findAll() {
      const resp = await this.$nuxt.$axios.$get('/auditLog', {})
      this.auditLogs = resp[0]
    },
    async delete(id: number) {
      await this.$nuxt.$axios.$delete('/auditLog/' + id)
    },
  },
})