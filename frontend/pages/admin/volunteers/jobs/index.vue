<template>
  <v-container class="pa-6">
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Volunteer Jobs</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <breadcrumbs class="pa-0" :items="breadcrumbs"></breadcrumbs>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="auto" aalign-self="center">
        <v-btn>Create Job</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table-paginated :items="jobs"></v-data-table-paginated>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Jobs',
  },
})
export default class AdminJobsPage extends Vue {
  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Volunteer Jobs',
    },
  ]

  get jobs() {
    return this.$accessor.volunteers.jobs
  }

  async fetch() {
    await this.$accessor.volunteers.findAll()
  }
}
</script>
