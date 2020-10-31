<template>
  <v-container class="pa-6">
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Projects</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pt-0">
            <breadcrumbs class="pa-0" :items="breadcrumbs" large></breadcrumbs>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="auto" align-self="center">
        <dialog-create-project
          @create:project="onCreate"
        ></dialog-create-project>
      </v-col>
    </v-row>

    <v-row>
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

          <v-data-table :headers="headers" :items="projects" :search="search">
            <template v-slot:[`item.id`]="{ item }">
              <v-chip>#{{ item.id }}</v-chip>
            </template>

            <template v-slot:[`item.createdAt`]="{ item }">
              {{ format(item.createdAt, 'MMM d, yyyy') }}
            </template>

            <template v-slot:[`item.updatedAt`]="{ item }">
              {{ format(item.updatedAt, 'MMM d, yyyy h:mm a') }}
            </template>

            <template v-slot:[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/users/${item.id}`">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>

            // eslint-enable
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { formatDate } from '~/utils/utilities'

@Component({
  layout: 'admin',
  head: {
    title: 'Users',
  },
})
export default class ProjectsPage extends Vue {
  search = ''

  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Projects',
    },
  ]

  headers = [
    { text: 'Id', value: 'id' },
    { text: 'name', value: 'name' },
    { text: 'Description', value: 'description' },
  ]

  get projects() {
    return this.$accessor.projects.projects
  }

  format(date: string, formatString: string) {
    return formatDate(date, formatString)
  }

  async onCreate() {
    await this.$fetch()
  }

  async fetch() {
    await this.$accessor.projects.findAll({ limit: 40, offset: 0 })
  }
}
</script>
