<template>
  <div>
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Edit Event Registration</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pt-0">
            <breadcrumbs class="pa-0" :items="breadcrumbs" large></breadcrumbs>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="auto" align-self="center">
        <dialog-confirm @confirm="onDeleteConfirm">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">Delete</v-btn>
          </template>

          Are you sure you wish to delete this event registration?
        </dialog-confirm>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title></v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RegistrationIdAdminPage extends Vue {
  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Registrations',
      href: '/admin/calendar/registrations',
    },
    {
      text: 'Edit Registration',
    },
  ]

  async onDeleteConfirm() {
    await this.$accessor.registrations.delete(this.$route.params.id)

    this.$router.push('/admin/calendar/registrations')
  }
}
</script>
