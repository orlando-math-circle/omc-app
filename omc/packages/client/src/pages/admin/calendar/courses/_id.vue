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
              <Breadcrumbs class="pa-0" :items="breadcrumbs" large />
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
              <Breadcrumbs class="pa-0" :items="breadcrumbs" large />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-card>
                <v-card-title>Page Incomplete</v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useFetch,
  useRoute,
  computed,
} from '@nuxtjs/composition-api'
import { useCourses } from '@/stores'

export default defineComponent({
  layout: 'admin',
  setup() {
    const route = useRoute()
    const courseStore = useCourses()

    useFetch(async () => {
      await courseStore.findOne(+route.value.params.id)
    })

    return {
      course: computed(() => courseStore.course),
      breadcrumbs: [
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
      ],
    }
  },
  head: {
    title: 'Edit Course',
  },
})
</script>
