<template>
  <VDataTablePaginated
    :items="jobs"
    :headers="headers"
    @refresh="$emit('refresh:jobs')"
  >
    <template #[`item.id`]="{ item }"> #<LinkCopy :text="item.id" /> </template>

    <template #[`item.hours`]="{ item }">
      <v-chip>{{ item.hours }}</v-chip>
    </template>

    <template #[`item.edit`]="{ item }">
      <v-btn icon :to="`/admin/volunteers/jobs/${item.id}`">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </template>
  </VDataTablePaginated>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { JobEntity } from '@/stores'

export default defineComponent({
  props: {
    jobs: {
      type: Array as PropType<JobEntity[]>,
      required: true,
    },
  },
  setup() {
    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Description', value: 'description' },
      { text: 'Hours', value: 'hours' },
      { text: 'Edit', value: 'edit', sortable: false, filterable: false },
    ]

    return { headers }
  },
})
</script>
