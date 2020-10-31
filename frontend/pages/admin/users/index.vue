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
        <v-btn>Create User</v-btn>
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
          </v-card-title>

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="$store.state.users.users"
            :search="search"
            show-select
          >
            <template v-slot:[`item.id`]="{ item }">
              <v-chip>#{{ item.id }}</v-chip>
            </template>

            <template #item.email="{ item }">
              <div class="d-flex align-center py-1">
                <v-avatar size="32px" class="elevation-1">
                  <v-img :src="item.avatar"></v-img>
                </v-avatar>
                <div class="ml-2">{{ item.email }}</div>
              </div>
            </template>

            <template #item.roles="{ item }">
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

            <template v-slot:[`item.createdAt`]="{ item }">
              {{ parseDate(item.createdAt) }}
            </template>

            <template v-slot:[`item.updatedAt`]="{ item }">
              {{ parseDateTime(item.updatedAt) }}
            </template>

            <template v-slot:[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/users/${item.id}`">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>

            // eslint-enable
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { format } from 'date-fns'
import { FindUsersDto } from '~/../backend/src/user/dtos/find-users.dto'

@Component({
  layout: 'admin',
  head: {
    title: 'Users',
  },
})
export default class UsersPage extends Vue {
  search = ''
  selected = []

  headers = [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Verified', value: 'emailVerified' },
    { text: 'Roles', value: 'roles' },
    { text: 'Fee Waived', value: 'feeWaived' },
    { text: 'Created', value: 'createdAt' },
    { text: 'Last Updated', value: 'updatedAt' },
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
    return format(new Date(date), 'MMM d, yyyy')
  }

  parseDateTime(date: string) {
    return format(new Date(date), 'MMM d, yyyy h:mm a')
  }

  async fetch() {
    const payload: FindUsersDto = { limit: 10, offset: 0 }

    try {
      await this.$store.dispatch('users/fetchUsers', payload)
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table table th {
  text-transform: uppercase;
}
</style>
