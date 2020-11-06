<template>
  <v-container class="pa-6">
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Course</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pt-0">
            <breadcrumbs class="pa-0" :items="breadcrumbs" large></breadcrumbs>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="auto" align-self="center">
        <dialog-create-course @create:course="onCreate"></dialog-create-course>
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
            :items="courses"
            :search="search"
            @refresh="onRefresh"
          >
            <template v-slot:[`item.id`]="{ item }">
              # <link-copy :text="item.id"></link-copy>
            </template>

            <template v-slot:[`item.createdAt`]="{ item }">
              {{ format(item.createdAt, 'MMM d, yyyy') }}
            </template>

            <template v-slot:[`item.updatedAt`]="{ item }">
              {{ format(item.updatedAt, 'MMM d, yyyy h:mm a') }}
            </template>

            <template v-slot:[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/calendar/courses/${item.id}`">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-data-table-paginated>
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
    title: 'Courses',
  },
  transition: 'admin',
})
export default class AdminCoursesPage extends Vue {
  search = ''

  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Courses',
    },
  ]

  headers = [
    { text: 'Id', value: 'id' },
    { text: 'name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: 'Edit', value: 'edit' },
  ]

  get courses() {
    return this.$accessor.courses.courses
  }

  get isLoading() {
    return this.$accessor.courses.isLoading
  }

  format(date: string, formatString: string) {
    return formatDate(date, formatString)
  }

  async onCreate() {
    await this.$fetch()
  }

  async onRefresh(options: any) {
    await this.$accessor.courses.findAll(options)
  }

  // async fetch() {
  //   await this.$accessor.courses.findAll()
  // }
}
</script>
