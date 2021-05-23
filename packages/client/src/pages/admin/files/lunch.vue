<template>
  <v-container class="pa-6">
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Reduced Lunch Forms</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pt-0">
            <breadcrumbs class="pa-0" :items="breadcrumbs" large></breadcrumbs>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-6">
      <v-col>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              placeholder="filter for id, name, email, etc"
              label="Search"
              single-line
              solo
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table :headers="headers" :items="attachments">
            <template #[`item.id`]="{ item }">
              <v-chip>#{{ item.id }}</v-chip>
            </template>

            <template #[`item.status`]="{ item }">
              {{ getStatus(item.status) }}
            </template>

            <template #[`item.user`]="{ item }">
              {{ item.user.name }}
            </template>

            <template #[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/files/attachments/${item.id}`">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, useFetch } from '@nuxtjs/composition-api'
import { useDebouncedRef } from '@/composables'
import { useAttachments } from '@/stores'

export default defineComponent({
  layout: 'admin',
  setup() {
    const search = useDebouncedRef('')

    const attachmentStore = useAttachments()

    const breadcrumbs = [
      {
        text: 'Dashboard',
        href: '/admin/files/lunch',
      },
      {
        text: 'Reduced Lunch Forms',
      },
    ]

    const statuses = [
      { text: 'Pending', value: 'pending' },
      { text: 'Approved', value: 'approved' },
      { text: 'Denied', value: 'denied' },
      { text: 'Cancelled', value: 'cancelled' },
    ]

    const headers = [
      { text: 'Id', value: 'id' },
      { text: 'Status', value: 'status' },
      { text: 'User', value: 'user' },
      {
        text: 'Edit',
        value: 'edit',
        sortable: false,
      },
    ]

    const attachments = computed(() => attachmentStore.attachments)

    const getStatus = (value: string) => {
      const status = statuses.find((s) => s.value === value)

      return status?.text || 'Unknown'
    }

    useFetch(async () => await attachmentStore.findAll('REDUCED_LUNCH_FORM'))

    return { search, breadcrumbs, statuses, headers, attachments, getStatus }
  },
  head: {
    title: 'Lunch Forms',
  },
})
</script>
