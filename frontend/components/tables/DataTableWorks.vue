<template>
  <v-data-table-paginated :headers="headers" :items="works" @refresh="refresh">
    <template #[`item.id`]="{ item }">
      #<link-copy :text="item.id"></link-copy>
    </template>

    <template #[`item.hours`]="{ item }">
      <v-chip>{{ item.hours }}</v-chip>
    </template>

    <template #[`item.total`]="{ item }">
      <v-chip>{{ item.user.volunteerHours || 'Unknown' }}</v-chip>
    </template>

    <template #[`item.status`]="{ item }">
      <v-chip>{{ getStatus(item.status) }}</v-chip>
    </template>

    <template #[`item.user`]="{ item }">
      <div class="d-flex align-center py-1">
        <v-avatar size="32px" class="elevation-1">
          <v-img :src="$avatar(item.user)" />
        </v-avatar>

        <div class="ml-2">
          <span>{{ item.user.name }}</span>
        </div>
      </div>
    </template>

    <template #[`item.project`]="{ item }">
      <span>{{ item.project.name }}</span>
      <v-btn icon :to="`/admin/calendar/projects/${item.project.id}`">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </template>

    <template #[`item.edit`]="{ item }">
      <v-btn icon :to="`/admin/volunteers/work/${item.id}`">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </template>
  </v-data-table-paginated>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { VolunteerWorkStatus } from '../../../backend/src/volunteer-work/enums/work-status.enum'
import { DTOEvent } from '../../store/events'
import { workStatuses } from '../../utils/constants'

@Component
export default class DataTableWorks extends Vue {
  @Prop({ required: true }) readonly works!: DTOEvent[]

  workStatuses = workStatuses

  headers = [
    { text: 'Id', value: 'id' },
    { text: 'User', value: 'user' },
    { text: 'Project', value: 'project' },
    { text: 'Hours', value: 'hours' },
    { text: 'Total', value: 'total' },
    { text: 'Status', value: 'status' },
    { text: 'Edit', value: 'edit', sortable: false, filterable: false },
  ]

  getStatus(status: VolunteerWorkStatus) {
    return this.workStatuses.find((s) => s.value === status)?.text || 'Unknown'
  }

  refresh() {
    this.$emit('refresh:works-table')
  }
}
</script>
