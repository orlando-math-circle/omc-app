<template>
  <v-container class="pa-6">
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Users</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pt-0">
            <breadcrumbs class="pa-0" :items="breadcrumbs" large></breadcrumbs>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="auto" align-self="center">
        <v-btn color="primary">Create User</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
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
            <template v-slot:[`item.id`]="{ item }">
              # <link-copy :text="item.id"></link-copy>
            </template>

            <template v-slot:[`item.email`]="{ item }">
              <div class="d-flex align-center py-1">
                <v-avatar size="32px" class="elevation-1">
                  <v-img :src="item.avatar"></v-img>
                </v-avatar>

                <div class="ml-2">
                  <link-copy :text="item.email"></link-copy>
                </div>
              </div>
            </template>

            <template v-slot:[`item.roles`]="{ item }">
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

            <template v-slot:[`item.emailVerified`]="{ item }">
              <v-icon :class="`${item.emailVerified ? 'success--text' : ''}`">
                {{
                  item.emailVerified ? 'mdi-check-circle' : 'mdi-circle-outline'
                }}
              </v-icon>
            </template>

            <template v-slot:[`item.feeWaived`]="{ item }">
              <v-icon :class="`${item.feeWaived ? 'success--text' : ''}`">
                {{ item.feeWaived ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
            </template>

            <template v-slot:[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/users/${item.id}`">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-data-table-paginated>
        </v-card>
      </v-col>

      <v-col cols="3">
        <div class="text-h6 mb-3">Filters</div>
        <div class="font-weight-bold mt-3">Age Range</div>
        <v-range-slider
          hide-details
          thumb-label
          max="100"
          min="1"
        ></v-range-slider>

        <div class="font-weight-bold mt-3">Roles</div>

        <v-checkbox label="Admin" hide-details></v-checkbox>
        <v-checkbox label="Volunteer" hide-details></v-checkbox>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
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
  options = null

  headers = [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Verified', value: 'emailVerified' },
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

  get isLoading() {
    return this.$accessor.users.isLoading
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

    await this.$accessor.users.findAll(options)
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
