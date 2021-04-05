<template>
  <v-data-table-paginated
    :value="value"
    :headers="headers"
    :items="users"
    v-bind="$attrs"
    @refresh="refresh"
    @input="$emit('input', $event)"
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
      {{
        typeof item.grade === 'number' ? grades[item.grade].text : 'No Grade'
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
        {{ item.emailVerified ? 'mdi-check-circle' : 'mdi-circle-outline' }}
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { DTOUser } from '../../store/users'
import { grades } from '../../utils/events'

@Component
export default class DataTableUsers extends Vue {
  @Prop() readonly value?: any[]
  @Prop({ required: true }) readonly users!: DTOUser[]

  grades = grades

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
      filterable: false,
    },
  ]

  refresh() {
    this.$emit('refresh:jobs-table')
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
}
</script>
