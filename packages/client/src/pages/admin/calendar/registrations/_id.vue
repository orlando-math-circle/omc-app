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
            <Breadcrumbs class="pa-0" :items="breadcrumbs" large />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="auto" align-self="center">
        <DialogConfirm @confirm="onDeleteConfirm">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">Delete</v-btn>
          </template>

          Are you sure you wish to delete this event registration?
        </DialogConfirm>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Registration Editing Not Yet Implemented</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, useRoute, useRouter } from '@nuxtjs/composition-api'
import { useRegistrations } from '@/stores'

export default defineComponent({
  layout: 'admin',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const registrationStore = useRegistrations()

    const breadcrumbs = [
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

    const onDeleteConfirm = async () => {
      await registrationStore.delete(+route.value.params.id)

      router.push('/admin/calendar/registrations')
    }

    return { breadcrumbs, onDeleteConfirm }
  },
})
</script>
