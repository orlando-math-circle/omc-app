<template>
  <div>
    <AdminHeader title="Attendance" :breadcrumbs="breadcrumbs" />

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="!selected.length"
                  v-bind="attrs"
                  color="primary"
                  v-on="on"
                >
                  Actions
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list nav dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-trash</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer />

            <v-btn class="ml-3" icon large @click="findAll()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <v-data-table-paginated
            v-model="selected"
            :headers="headers"
            :items="attendances"
            :loading="isLoading"
            show-select
          >
            <template #[`item.id`]="{ item }">
              # <LinkCopy :text="item.id" />
            </template>

            <template #[`item.user`]="{ item }">
              {{ typeof item.user === 'string' ? user.text : 'No User Id' }}
            </template>

            <template #[`item.eventId`]="{ item }">
              {{
                typeof item.eventId === 'number' ? eventId.text : 'No Event Id'
              }}
            </template>

            <template #[`item.attended`]="{ item }">
              <v-icon :class="`${item.attended ? 'success--text' : ''}`">
                {{ item.attended ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
            </template>

            <template #[`item.jobId`]="{ item }">
              {{ typeof item.jobId === 'number' ? jobId.text : 'No Job Id' }}
            </template>

            <template #[`item.workId`]="{ item }">
              {{ typeof item.workId === 'number' ? workId.text : 'No Work Id' }}
            </template>

            <template #[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/calendar/attendance/${item.id}`">
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
import {
  computed,
  defineComponent,
  reactive,
  useFetch,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'

import { useDebouncedRef } from '@/composables'
import { useAttendance } from '@/stores'

const breadcrumbs = [
  {
    text: 'Dashboard',
    href: '/admin/',
  },
  {
    text: 'Attendance',
  },
]

export default defineComponent({
  layout: 'admin',
  transition: 'admin',
  setup() {
    const attendanceStore = useAttendance()

    const state = reactive({
      selected: [],
      options: null,
    })

    const search = useDebouncedRef<string | null>('')

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'User', value: 'user.name' },
      { text: 'Event Id', value: 'event.name' },
      { text: 'Attended', value: 'attended' },
      { text: 'Job Id', value: 'job' },
      { text: 'Work Id', value: 'work' },
      {
        text: 'Edit',
        value: 'edit',
        sortable: false,
      },
    ]

    const findAll = async () => {
      await attendanceStore.findAll({
        ...(search.value?.length && { contains: search.value }),
      })
    }

    useFetch(async () => await findAll())
    watch(search, async () => await findAll())

    return {
      ...toRefs(state),
      search,
      headers,
      breadcrumbs,
      attendances: computed(() => attendanceStore.attendances),
      isLoading: computed(() => attendanceStore.isLoading),
      findAll,
    }
  },
  head: {
    title: 'Attendance',
  },
})
</script>
