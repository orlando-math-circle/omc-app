<template>
  <VDataTablePaginated
    :items="registrations"
    :headers="headers"
    @refresh="$emit('refresh')"
  >
    <template #[`item.id`]="{ item }">
      # <LinkCopy :text="item.id" />
    </template>

    <template #[`item.user`]="{ item }">
      <div class="d-flex align-center py-1">
        <v-avatar size="32px" class="elevation-1">
          <v-img :src="item.user.avatarUrl" />
        </v-avatar>

        <div class="ml-2">
          {{ item.user.name }}
        </div>
      </div>
    </template>

    <template #[`item.event`]="{ item }">
      {{ item.event.name }}
    </template>

    <template #[`item.edit`]="{ item }">
      <v-btn icon :to="`/admin/calendar/registrations/${item.id}`">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </template>
  </VDataTablePaginated>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { RegistrationEntity } from '@/stores'

export default defineComponent({
  props: {
    registrations: {
      type: Array as PropType<RegistrationEntity[]>,
      required: true,
    },
  },
  setup() {
    const headers = [
      { text: 'Id', value: 'id' },
      { text: 'User', value: 'user' },
      { text: 'Event', value: 'event' },
      { text: 'Invoice', value: 'invoice' },
      { text: 'Edit', value: 'edit', sortable: false },
    ]

    return { headers }
  },
})
</script>
