<template>
  <v-data-table-paginated :headers="headers" :items="events" @refresh="refresh">
    <template #[`item.id`]="{ item }">
      # <link-copy :text="item.id"></link-copy>
    </template>

    <template #[`item.name`]="{ item }">
      <div class="d-flex align-center py-1">
        <v-avatar size="32px" class="elevation-1">
          <v-img :src="$background(item)" />
        </v-avatar>

        <div class="ml-2">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </template>

    <template #[`item.start`]="{ item }">
      {{ format(item.dtstart, 'EEE, MMM do, yyyy') }}
    </template>

    <template #[`item.end`]="{ item }">
      {{ format(item.dtend, 'EEE, MMM do, yyyy') }}
    </template>

    <template #[`item.edit`]="{ item }">
      <v-btn icon :to="`/admin/calendar/events/${item.id}`">
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
  @Prop({ required: true }) readonly events!: DTOEvent[]

  headers = [
    { text: 'Id', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: 'Start', value: 'start' },
    { text: 'End', value: 'end' },
    { text: 'Edit', value: 'edit', sortable: false, filterable: false },
  ]

  refresh() {
    this.$emit('refresh:event-table')
  }

  format(date: Date | string, formatString: string) {
    return formatDate(date, formatString)
  }
}
</script>
