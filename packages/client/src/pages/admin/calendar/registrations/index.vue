<template>
  <div>
    <admin-header title="Event Registrations" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            Manage
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <dialog-create-registration>
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-account-plus-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Create Registration</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </dialog-create-registration>
        </v-list>
      </v-menu>
    </admin-header>

    <v-row>
      <v-col>
        <v-data-table-paginated :items="registrations" :headers="headers">
          <template #[`item.id`]="{ item }">
            # <link-copy :text="item.id"></link-copy>
          </template>

          <template #[`item.user`]="{ item }">
            <div class="d-flex align-center py-1">
              <v-avatar size="32px" class="elevation-1">
                <v-img :src="$avatar(item.user)" />
              </v-avatar>

              <div class="ml-2">
                {{ item.user.name }}
              </div>
            </div>
          </template>

          <template #[`item.event`]="{ item }">
            {{ item.event.name }}
          </template>

          <template #[`item.edit`]="{ item }">
            <v-btn icon :to="`/admin/calendar/registrations/${item.id}`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
        </v-data-table-paginated>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useRegistrations } from '@/store/useRegistrations'

export default defineComponent({
  layout: 'admin',
  setup() {
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

    const headers = [
      { text: 'Id', value: 'id' },
      { text: 'User', value: 'user' },
      { text: 'Event', value: 'event' },
      { text: 'Invoice', value: 'invoice' },
      { text: 'Edit', value: 'edit', sortable: false },
    ]

    const registrationStore = useRegistrations()

    const registrations = computed(() => registrationStore.registrations)

    return { breadcrumbs, headers, registrations }
  },
  async asyncData({ pinia }) {
    const registrationStore = useRegistrations(pinia)

    await registrationStore.findAll()
  },
  head: {
    title: 'Registrations',
  },
})
</script>
