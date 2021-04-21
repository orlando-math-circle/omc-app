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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Attachments',
  },
})
export default class AttachmentPage extends Vue {
  search = ''

  headers = [
    { text: 'Id', value: 'id' },
    { text: 'Status', value: 'status' },
    { text: 'User', value: 'user' },
    {
      text: 'Edit',
      value: 'edit',
      sortable: false,
    },
  ]

  statuses = [
    { text: 'Pending', value: 'pending' },
    { text: 'Approved', value: 'approved' },
    { text: 'Denied', value: 'denied' },
    { text: 'Cancelled', value: 'cancelled' },
  ]

  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/files/attachments',
    },
    {
      text: 'Attachments',
      href: '/admin/files/attachments',
    },
    {
      text: this.$route.params.id,
    },
  ]

  getStatus(value: string) {
    const status = this.statuses.find((s) => s.value === value)

    return status?.text || 'Unknown'
  }
}
</script>
