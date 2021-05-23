<template>
  <div>
    <AdminHeader title="Courses" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <DialogCreateCourse @create:course="onCourseCreate">
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
          </DialogCreateCourse>
        </v-list>
      </v-menu>
    </AdminHeader>

    <v-row>
      <v-col>
        <v-card :loading="isLoading">
          <v-card-title>
            <v-spacer />

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              placeholder="Search..."
              label="Search"
              single-line
              solo
              hide-details
            />

            <v-btn class="ml-3" icon large @click="onRefresh">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <VDataTablePaginated
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
          </VDataTablePaginated>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/utils/utilities'
import { useDebouncedRef } from '@/composables'
import { useCourses } from '@/stores'

export default defineComponent({
  layout: 'admin',
  transition: 'admin',
  setup() {
    const search = useDebouncedRef('')

    const courseStore = useCourses()

    const onCourseCreate = async () => {
      await onRefresh()
    }

    const onRefresh = async () => {
      await courseStore.findAll({ contains: search.value })
    }

    return {
      search,
      courses: computed(() => courseStore.courses),
      isLoading: computed(() => courseStore.isLoading),
      format: (date: string, formatString: string) =>
        formatDate(date, formatString),
      onCourseCreate,
      onRefresh,
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Edit', value: 'edit' },
      ],
      breadcrumbs: [
        {
          text: 'Dashboard',
          href: '/admin/',
        },
        {
          text: 'Courses',
        },
      ],
    }
  },
  head: {
    title: 'Courses',
  },
})
</script>
