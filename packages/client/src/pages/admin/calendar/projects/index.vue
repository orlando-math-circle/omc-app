<template>
  <div>
    <v-row no-gutters>
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
        <dialog-create-project @create:project="onCreate">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">Create Project</v-btn>
          </template>
        </dialog-create-project>
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

          <v-data-table-paginated
            :headers="headers"
            :items="projects"
            :search="search"
            :loading="isLoading"
            @refresh="onRefresh"
          >
            <template #[`item.id`]="{ item }">
              # <link-copy :text="item.id"></link-copy>
            </template>

            <template #[`item.createdAt`]="{ item }">
              {{ format(item.createdAt, 'MMM d, yyyy') }}
            </template>

            <template #[`item.updatedAt`]="{ item }">
              {{ format(item.updatedAt, 'MMM d, yyyy h:mm a') }}
            </template>

            <template #[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/calendar/projects/${item.id}`">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-data-table-paginated>
        </v-card>
      </v-col>
    </v-row>
  </div>
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
    { text: 'Name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: 'Edit', value: 'edit' },
  ]

  get isLoading() {
    return this.$accessor.projects.isLoading
  }

  get projects() {
    return this.$accessor.projects.projects
  }

  format(date: string, formatString: string) {
    return formatDate(date, formatString)
  }

  async onRefresh(options: any) {
    await this.$accessor.projects.findAll(options)
  }

  async onCreate() {}
}
</script>
