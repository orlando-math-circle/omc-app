<template>
  <v-data-table-paginated :headers="headers" :items="jobs" @refresh="refresh">
    <template #[`item.id`]="{ item }">
      #<link-copy :text="item.id"></link-copy>
    </template>

    <template #[`item.hours`]="{ item }">
      <v-chip>{{ item.hours }}</v-chip>
    </template>

    <template #[`item.edit`]="{ item }">
      <v-btn icon :to="`/admin/volunteers/jobs/${item.id}`">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </template>
  </v-data-table-paginated>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { DTOEvent } from '../../store/events'
import { formatDate } from '../../utils/utilities'

@Component
export default class DataTableEvents extends Vue {
  @Prop({ required: true }) readonly jobs!: DTOEvent[]

  headers = [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: 'Hours', value: 'hours' },
    { text: 'Edit', value: 'edit', sortable: false, filterable: false },
  ]

  refresh() {
    this.$emit('refresh:jobs-table')
  }

  format(date: Date | string, formatString: string) {
    return formatDate(date, formatString)
  }
}
</script>
