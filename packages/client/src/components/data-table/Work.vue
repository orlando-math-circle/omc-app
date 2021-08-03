<template>
  <VDataTablePaginated
    :items="works"
    :headers="headers"
    @refresh="$emit('refresh')"
  >
    <template #[`item.id`]="{ item }"> #<LinkCopy :text="item.id" /> </template>

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
          <v-img :src="item.user.avatarUrl" />
        </v-avatar>

        <div class="ml-2">
          <span>{{ item.user.name }}</span>
        </div>
      </div>
    </template>

    <template #[`item.project`]="{ item }">
      <template v-if="item.project">
        <span>{{ item.project.name }}</span>
        <v-btn icon :to="`/admin/calendar/projects/${item.project.id}`">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </template>

      <template v-else>
        <span>No Project</span>
      </template>
    </template>

    <template #[`item.edit`]="{ item }">
      <v-btn icon :to="`/admin/volunteers/work/${item.id}`">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </template>
  </VDataTablePaginated>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { VolunteerWorkStatus } from '@server/volunteer-work/enums/work-status.enum'
import { WorkEntity } from '@/stores'
import { workStatuses } from '@/utils/constants'

export default defineComponent({
  props: {
    works: {
      type: Array as PropType<WorkEntity[]>,
      required: true,
    },
  },
  setup() {
    const headers = [
      { text: 'Id', value: 'id' },
      { text: 'User', value: 'user' },
      { text: 'Project', value: 'project' },
      { text: 'Hours', value: 'hours' },
      { text: 'Total', value: 'total' },
      { text: 'Status', value: 'status' },
      { text: 'Edit', value: 'edit', sortable: false, filterable: false },
    ]

    const getStatus = (status: VolunteerWorkStatus) =>
      workStatuses.find((s) => s.value === status)?.text || 'Unknown'

    return { headers, getStatus }
  },
})
</script>
