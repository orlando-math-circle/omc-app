<template>
  <v-container class="pa-6">
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

          <v-data-table :headers="headers" :items="attachments"></v-data-table>
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
    title: 'Lunch Forms',
  },
})
export default class LunchFilesPage extends Vue {
  search = ''

  headers = [
    { text: 'Id', value: 'id' },
    { text: 'Status', value: 'status' },
    { text: 'User', value: 'user' },
  ]

  get attachments() {
    return this.$accessor.files.attachments
  }

  async fetch() {
    await this.$accessor.files.findAllAttachments('REDUCED_LUNCH_FORM')
  }
}
</script>
