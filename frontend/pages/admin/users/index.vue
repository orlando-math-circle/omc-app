<template>
  <div>
    <admin-header title="Users" :breadcrumbs="breadcrumbs">
      <v-row>
        <v-col cols="auto" align-self="center">
          <v-btn color="primary">Create User</v-btn>
        </v-col>

        <v-col cols="auto" align-self="center">
          <v-btn @click="filters.panel = !filters.panel">
            Filters <v-icon>mdi-filter-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </admin-header>

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
                  @change="onRefresh(options)"
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
                  @change="onRefresh(options)"
                />
              </v-col>
            </v-row>
          </v-toolbar>

          <v-card-title>
            <v-menu v-if="selected.length" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on"
                  >Actions
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title>Email</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              placeholder="filter for id, name, email, etc"
              label="Search"
              clearable
              single-line
              solo
              hide-details
            ></v-text-field>

            <v-btn class="ml-3" icon large @click="onRefresh(options)">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <v-data-table-paginated
            v-model="selected"
            :headers="headers"
            :items="$store.state.users.users"
            :search="search"
            :loading="isLoading"
            show-select
            @refresh="onRefresh"
          >
            <template #[`item.id`]="{ item }">
              # <link-copy :text="item.id"></link-copy>
            </template>

            <template #[`item.email`]="{ item }">
              <div class="d-flex align-center py-1">
                <v-avatar size="32px" class="elevation-1">
                  <v-img :src="$avatar(item)" />
                </v-avatar>

                <div class="ml-2">
                  <link-copy v-if="item.email" :text="item.email"></link-copy>
                  <span v-else>No Email</span>
                </div>
              </div>
            </template>

            <template #[`item.grade`]="{ item }">
              {{ grades[item.grade].text }}
            </template>

            <template #[`item.roles`]="{ item }">
              <v-chip
                v-for="role in item.roles"
                :key="role"
                :color="getRoleColor(role)"
                label
                dark
                class="font-weight-bold"
              >
                {{ role.toUpperCase() }}
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
import { Component, Vue } from 'nuxt-property-decorator'
import {
  contiguousGradeRanges,
  gradeGroups,
  grades,
} from '../../../utils/events'
import { Roles } from '../../../../backend/src/app.roles'
import { formatDate } from '~/utils/utilities'

@Component({
  layout: 'admin',
  head: {
    title: 'Users',
  },
  transition: 'admin',
})
export default class AdminUsersPage extends Vue {
  search = ''
  selected = []
  grades = grades
  options = null

  filters = {
    panel: false,
    grades: [],
    roles: [],
  }

  headers = [
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
    },
  ]

  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Users',
    },
  ]

  roles = [
    { text: 'Administrator', value: Roles.ADMIN },
    { text: 'Volunteer', value: Roles.VOLUNTEER },
  ]

  get isLoading() {
    return this.$accessor.users.isLoading
  }

  get gradeGroups() {
    return gradeGroups(contiguousGradeRanges(this.filters.grades))
  }

  getRoleColor(role: string) {
    switch (role) {
      case 'admin':
        return '#ec407a'
      case 'volunteer':
        return '#2196f3'
      default:
        return ''
    }
  }

  parseDate(date: string) {
    return formatDate(new Date(date), 'MMM d, yyyy')
  }

  parseDateTime(date: string) {
    return formatDate(new Date(date), 'MMM d, yyyy h:mm a')
  }

  async onRefresh(options: any) {
    if (this.options === null) {
      this.options = options

      return // Prevent fetching twice on first page load.
    }

    await this.$accessor.users.findAll(
      Object.assign(
        {},
        options,
        this.filters.grades.length && { grade: this.filters.grades },
        this.filters.roles.length && { role: this.filters.roles }
      )
    )
  }

  async fetch() {
    await this.$accessor.users.findAll()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table table th {
  text-transform: uppercase;
}
</style>
