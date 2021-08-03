<template>
  <div>
    <AdminHeader title="Users" :breadcrumbs="breadcrumbs">
      <v-row>
        <v-col cols="auto" align-self="center">
          <DialogCreateAccount @create:account="onAccountCreate">
            <template #activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on">
                Create Account
              </v-btn>
            </template>
          </DialogCreateAccount>
        </v-col>

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
                  v-model="filters.grades"
                  :items="grades"
                  label="Grades"
                  outlined
                  multiple
                  hide-details="auto"
                  clearable
                  @change="findAll()"
                >
                  <template #selection="{ index }">
                    <v-chip v-if="index < gradeGroups.length">
                      {{ gradeGroups[index] }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <v-col>
                <v-select
                  v-model="filters.roles"
                  :items="roles"
                  label="Roles"
                  hide-details="auto"
                  outlined
                  multiple
                  clearable
                  @change="findAll()"
                />
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
                <DialogEmail :users="selected">
                  <template #activator="{ on, attrs }">
                    <v-list-item v-bind="attrs" v-on="on">
                      <v-list-item-icon>
                        <v-icon>mdi-email</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title>Email</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </DialogEmail>

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
            :items="users"
            :loading="isLoading"
            show-select
          >
            <template #[`item.id`]="{ item }">
              # <LinkCopy :text="item.id" />
            </template>

            <template #[`item.email`]="{ item }">
              <div class="d-flex align-center py-1">
                <v-avatar size="32px" class="elevation-1">
                  <v-img :src="item.avatarUrl" />
                </v-avatar>

                <div class="ml-2">
                  <LinkCopy v-if="item.email" :text="item.email" />
                  <span v-else>No Email</span>
                </div>
              </div>
            </template>

            <template #[`item.grade`]="{ item }">
              {{
                typeof item.grade === 'number'
                  ? grades[item.grade].text
                  : 'No Grade'
              }}
            </template>

            <template #[`item.roles`]="{ item }">
              <v-chip
                v-for="role in item.roles"
                :key="role"
                :color="getRoleColor(role)"
                label
                dark
                class="font-weight-bold mr-2"
              >
                {{ role.charAt(0).toUpperCase() }}
              </v-chip>
            </template>

            <template #[`item.emailVerified`]="{ item }">
              <v-icon :class="`${item.emailVerified ? 'success--text' : ''}`">
                {{
                  item.emailVerified ? 'mdi-check-circle' : 'mdi-circle-outline'
                }}
              </v-icon>
            </template>

            <template #[`item.feeWaived`]="{ item }">
              <v-icon :class="`${item.feeWaived ? 'success--text' : ''}`">
                {{ item.feeWaived ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
            </template>

            <template #[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/users/${item.id}`">
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
import { Roles } from '@server/app.roles'
import { useDebouncedRef } from '@/composables'
import { useUsers } from '@/stores'
import { contiguousGradeRanges, gradeGroups, grades } from '@/utils/events'

const breadcrumbs = [
  {
    text: 'Dashboard',
    href: '/admin/',
  },
  {
    text: 'Users',
  },
]

const roles = [
  { text: 'Administrator', value: Roles.ADMIN },
  { text: 'Volunteer', value: Roles.VOLUNTEER },
]

export default defineComponent({
  layout: 'admin',
  transition: 'admin',
  setup() {
    const userStore = useUsers()

    const state = reactive({
      selected: [],
      options: null,
      filters: {
        panel: false,
        grades: [],
        roles: [],
      },
    })

    const search = useDebouncedRef<string | null>('')

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Verified', value: 'emailVerified' },
      { text: 'Grades', value: 'grade' },
      { text: 'Roles', value: 'roles' },
      { text: 'Fee Waived', value: 'feeWaived' },
      {
        text: 'Edit',
        value: 'edit',
        sortable: false,
        filterable: false,
      },
    ]

    const groups = computed(() =>
      gradeGroups(contiguousGradeRanges(state.filters.grades))
    )

    const getRoleColor = (role: string) => {
      switch (role) {
        case 'admin':
          return '#ec407a'
        case 'volunteer':
          return '#2196f3'
        default:
          return ''
      }
    }

    const findAll = async () => {
      await userStore.findAll({
        ...(state.filters.grades.length && { grade: state.filters.grades }),
        ...(state.filters.roles.length && { role: state.filters.roles }),
        ...(search.value?.length && { contains: search.value }),
      })
    }

    const onAccountCreate = () => findAll()

    useFetch(async () => await findAll())
    watch(search, async () => await findAll())

    return {
      ...toRefs(state),
      search,
      headers,
      grades,
      breadcrumbs,
      roles,
      getRoleColor,
      gradeGroups: groups,
      users: computed(() => userStore.users),
      isLoading: computed(() => userStore.isLoading),
      findAll,
      onAccountCreate,
    }
  },
  head: {
    title: 'Users',
  },
})
</script>

<style lang="scss" scoped>
::v-deep .v-data-table table th {
  text-transform: uppercase;
}
</style>
