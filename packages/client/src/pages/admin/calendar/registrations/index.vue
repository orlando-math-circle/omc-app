<template>
  <div>
    <AdminHeader title="Event Registrations" :breadcrumbs="breadcrumbs">
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
    </AdminHeader>

    <v-row>
      <v-col>
        <v-card :loading="isLoading">
          <v-card-title>
            <v-spacer />

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              placeholder="Search..."
              label="Search"
              single-line
              solo
              hide-details
            />

            <v-btn class="ml-3" icon large @click="onRefresh">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <DataTableRegistrations
            :registrations="registrations"
            :search="search"
            @refresh="onRefresh"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useRegistrations } from '@/stores'
import { useDebouncedRef } from '@/composables'

export default defineComponent({
  layout: 'admin',
  setup() {
    const registrationStore = useRegistrations()

    // TODO: Search NYI
    const search = useDebouncedRef('')

    const breadcrumbs = [
      {
        text: 'Dashboard',
        href: '/admin/',
      },
      {
        text: 'Registrations',
      },
    ]

    const registrations = computed(() => registrationStore.registrations)
    const isLoading = computed(() => registrationStore.isLoading)

    const onRefresh = async () => {
      await registrationStore.findAll()
    }

    return { search, breadcrumbs, registrations, onRefresh, isLoading }
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
