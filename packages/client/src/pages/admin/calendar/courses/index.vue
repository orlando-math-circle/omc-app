<template>
  <div>
    <admin-header title="Courses" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <dialog-create-course @create:course="onCourseCreate">
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-tag-plus</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Create Course</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </dialog-create-course>
        </v-list>
      </v-menu>
    </admin-header>

    <v-row>
      <v-col>
        <v-card :loading="isLoading">
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              placeholder="Search..."
              label="Search"
              single-line
              solo
              hide-details
            ></v-text-field>
            <v-btn class="ml-3" icon large @click="onRefresh(null)">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <v-data-table-paginated
            :headers="headers"
            :items="courses"
            :search="search"
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
              <v-btn icon :to="`/admin/calendar/courses/${item.id}`">
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

  async onCourseCreate() {
    await this.onRefresh(null)
  }

  async onCreate() {
    await this.$fetch()
  }

  async onRefresh(options: any) {
    await this.$accessor.courses.findAll(options)
  }
}
</script>
