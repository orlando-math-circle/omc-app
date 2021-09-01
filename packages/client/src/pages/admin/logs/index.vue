<template>
  <div>
    <AdminHeader title="Activity" :breadcrumbs="breadcrumbs" />

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-spacer />

            <v-text-field
              v-model.trim="search"
              append-icon="mdi-magnify"
              placeholder="Filter for id, name, email, ...etc"
              label="Search"
              clearable
              single-line
              solo
              hide-details
            />

            <v-btn class="ml-3" icon large @click="findAll()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <v-data-table-paginated
            :headers="headers"
            :items="records"
            :loading="isLoading"
          >
            <template #[`item.id`]="{ item }">
              # <LinkCopy :text="item.id" />
            </template>

            <template #[`item.description`]="{ item }">
              <RecordDescription :record="item" />
            </template>

            <template #[`item.createdAt`]="{ item }">
              {{ format(item.createdAt, "EEE, MMM do, yyyy 'at' h:mmaaa") }}
            </template>
          </v-data-table-paginated>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { useDates, useDebouncedRef } from '@/composables'
import { useActivityRecords } from '@/stores'
import {
  computed,
  defineComponent,
  useFetch,
  watch,
} from '@nuxtjs/composition-api'

const breadcrumbs = [
  {
    text: 'Dashboard',
    href: '/admin/',
  },
  {
    text: 'Activity',
  },
]

export default defineComponent({
  layout: 'admin',
  transition: 'admin',
  setup() {
    const activityStore = useActivityRecords()
    const dates = useDates()

    const search = useDebouncedRef<string | null>('')
    const isLoading = computed(() => activityStore.isLoading)
    const records = computed(() => activityStore.records)

    const headers = [
      { text: 'Id', value: 'id' },
      { text: 'Description', value: 'description' },
      { text: 'Date', value: 'createdAt' },
    ]

    const findAll = async () => await activityStore.findAll()

    useFetch(async () => await findAll())
    // TODO: Search does nothing currently.
    watch(search, findAll)

    return {
      search,
      records,
      headers,
      isLoading,
      breadcrumbs,
      findAll,
      format: dates.format,
    }
  },
  head: {
    title: 'Activity',
  },
})
</script>

<style lang="scss" scoped>
::v-deep .v-data-table table th {
  text-transform: uppercase;
}
</style>
