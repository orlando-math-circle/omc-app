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
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/utils/utilities'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { useProjects } from '@/store/useProjects'

export default defineComponent({
  layout: 'admin',
  setup() {
    const search = useDebouncedRef('')

    const projectStore = useProjects()

    const onRefresh = async () => {
      await projectStore.findAll()
    }

    return {
      search,
      onRefresh,
      isLoading: computed(() => projectStore.isLoading),
      projects: computed(() => projectStore.projects),
      format: (date: string, formatString: string) =>
        formatDate(date, formatString),
      breadcrumbs: [
        {
          text: 'Dashboard',
          href: '/admin/',
        },
        {
          text: 'Projects',
        },
      ],
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Edit', value: 'edit' },
      ],
    }
  },
  head: {
    title: 'Users',
  },
})
</script>
