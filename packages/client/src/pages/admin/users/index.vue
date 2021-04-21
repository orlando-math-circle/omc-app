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
                <v-btn v-bind="attrs" color="primary" v-on="on"
                  >Actions
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list nav dense>
                <dialog-email :users="selected">
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
                </dialog-email>
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

          <data-table-users
            v-model="selected"
            :users="$accessor.users.users"
            :search="search"
            :loading="isLoading"
            show-select
          >
          </data-table-users>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Roles } from '@server/app.roles'
import {
  contiguousGradeRanges,
  gradeGroups,
  grades,
} from '../../../utils/events'
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
