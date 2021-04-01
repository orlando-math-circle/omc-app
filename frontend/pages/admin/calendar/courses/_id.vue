<template>
  <div>
    <template v-if="course == null">
      <v-row no-gutters class="mb-6">
        <v-col>
          <v-row>
            <v-col>
              <h1>Edit User — Course # {{ $route.params.id }}</h1>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="pt-0">
              <breadcrumbs
                class="pa-0"
                :items="breadcrumbs"
                large
              ></breadcrumbs>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-alert border="left" elevation="2" type="error">
            Course with id #{{ $route.params.id }} was not found or the
            retrieval was not successful. Check your console for more
            information.
          </v-alert>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row no-gutters class="mb-6">
        <v-col>
          <v-row>
            <v-col>
              <h1>Edit Course — {{ course.name }}</h1>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="pt-0">
              <breadcrumbs
                class="pa-0"
                :items="breadcrumbs"
                large
              ></breadcrumbs>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit Course',
  },
})
export default class AdminEditCoursePage extends Vue {
  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Courses',
      href: '/admin/calendar/courses',
    },
    {
      text: 'Edit Course',
    },
  ]

  get course() {
    return this.$accessor.courses.course
  }

  async fetch() {
    await this.$accessor.courses.findOne(this.$route.params.id)
  }
}
</script>
