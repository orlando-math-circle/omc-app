<template>
  <VDataTablePaginated
    :items="events"
    :headers="headers"
    @refresh="$emit('refresh:events')"
  >
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
  </VDataTablePaginated>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { EventEntity } from '@/stores'
import { useDates } from '@/composables'

export default defineComponent({
  props: {
    events: {
      type: Array as PropType<EventEntity[]>,
      required: true,
    },
  },
  setup() {
    const dateUtils = useDates()

    const headers = [
      { text: 'Id', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Description', value: 'description' },
      { text: 'Start', value: 'start' },
      { text: 'End', value: 'end' },
      { text: 'Edit', value: 'edit', sortable: false, filterable: false },
    ]

    return { headers, format: dateUtils.format }
  },
})
</script>
