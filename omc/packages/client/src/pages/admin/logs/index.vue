<template>
  <div>
    <AdminHeader title="Activity" :breadcrumbs="breadcrumbs">
      <v-row>
        <v-col cols="auto" align-self="center">
          <v-btn @click="filters.panel = !filters.panel">
            Filters <v-icon>mdi-filter-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </AdminHeader>

    <v-row>
      <v-col>
        <v-card>
          <v-toolbar v-if="filters.panel" flat class="pa-3">
            <v-row>
              <v-col>
                <v-select
                  v-model="filters.names"
                  :items="names"
                  label="Names"
                  outlined
                  multiple
                  hide-details="auto"
                  clearable
                  @change="findAll()"
                >
                </v-select>
              </v-col>
            </v-row>
          </v-toolbar>

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
            v-model="selected"
            :headers="headers"
            :items="logs"
            :loading="isLoading"
            show-select
          >
            <template #[`item.id`]="{ item }">
              # <LinkCopy :text="item.id" />
            </template>

            <template>
              <div class="ml-2">
                  <span>No Email</span>
                </div>
            </template>

            <template>
              <v-btn icon @click="deleteDialog && deleteDialog.open(status)">
                <v-icon>mdi-delete-circle</v-icon>
              </v-btn>
            </template>
          </v-data-table-paginated>
        </v-card>
      </v-col>
    </v-row>

    <DialogConfirm ref="deleteDialog" @confirm="onDelete">
      This will delete the entry from the audit log.
    </DialogConfirm>
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
import { useUsers, useAuditLogs, useSnackbar } from '@/stores'
import { useDebouncedRef } from '@/composables'

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
    const userStore = useUsers()
    const snackbar = useSnackbar()
    const auditLogStore = useAuditLogs()

    const state = reactive({
      selected: [],
      selection: null as number | null,
      options: null,
      filters: {
        panel: false,
        names: [],
      },
    })

    const search = useDebouncedRef<string | null>('')

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Record', value: 'record' },
      {
        text: 'Edit',
        value: 'edit',
        sortable: false,
        filterable: false,
      },
    ]

    const findAll = async () => {
      await auditLogStore.findAll()
    }

    const onDelete = async () => {
      await auditLogStore.delete(state.selection)

      if (auditLogStore.error) {
        snackbar.error('Unable to delete audit record')
      }

      snackbar.success('Audit record successfully deleted')
    }

    useFetch(async () => await findAll())
    watch(search, async () => await findAll())

    return {
      ...toRefs(state),
      search,
      headers,
      breadcrumbs,
      users: computed(() => userStore.users),
      logs: computed(() => auditLogStore.auditLogs),
      isLoading: computed(() => auditLogStore.isLoading),
      findAll,
      onDelete,
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
