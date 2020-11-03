<template>
  <v-container class="pa-6">
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Attachments</h1>
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
            <v-select
              v-model="field"
              :items="fields"
              item-text="name"
              item-value="name"
              solo
              hide-details
              @change="onChangeField"
            ></v-select>

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

          <v-data-table
            :search="search"
            :headers="headers"
            :items="attachments"
          >
            <template v-slot:[`item.id`]="{ item }">
              <v-chip>#{{ item.id }}</v-chip>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              {{ getStatus(item.status) }}
            </template>

            <template v-slot:[`item.user`]="{ item }">
              {{ item.user.name }}
            </template>

            <template v-slot:[`item.edit`]="{ item }">
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
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Attachments',
  },
})
export default class AttachmentsIndexPage extends Vue {
  search = ''
  field = ''

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
    },
  ]

  getStatus(value: string) {
    const status = this.statuses.find((s) => s.value === value)

    return status?.text || 'Unknown'
  }

  get fields() {
    return this.$accessor.files.fields
  }

  get attachments() {
    return this.$accessor.files.attachments
  }

  async onChangeField() {
    await this.$accessor.files.findAllAttachments(this.field)
  }

  async fetch() {
    await this.$accessor.files.findAllFields()
  }
}
</script>
