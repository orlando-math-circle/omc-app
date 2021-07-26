<template>
  <v-container class="pa-6">
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Attachment</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pt-0">
            <Breadcrumbs class="pa-0" :items="breadcrumbs" large />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-6">
      <v-col>
        <v-card>
          <v-card-title>
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              placeholder="filter for id, name, email, etc"
              label="Search"
              single-line
              solo
              hide-details
            />
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'admin',
  setup() {
    const search = ref('')

    const route = useRoute()

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

    const statuses = [
      { text: 'Pending', value: 'pending' },
      { text: 'Approved', value: 'approved' },
      { text: 'Denied', value: 'denied' },
      { text: 'Cancelled', value: 'cancelled' },
    ]

    const breadcrumbs = [
      {
        text: 'Dashboard',
        href: '/admin/files/attachments',
      },
      {
        text: 'Attachments',
        href: '/admin/files/attachments',
      },
      {
        text: route.value.params.id,
      },
    ]

    const getStatus = (value: string) => {
      const status = statuses.find((s) => s.value === value)

      return status?.text || 'Unknown'
    }

    return { search, headers, breadcrumbs, getStatus }
  },
  head: {
    title: 'Attachments',
  },
})
</script>
