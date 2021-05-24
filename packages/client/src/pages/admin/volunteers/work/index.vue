<template>
  <div>
    <AdminHeader title="Volunteer Work" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <DialogCreateWork :is-static="false" @create:work="fetch">
            <template #activator="cw">
              <v-list-item v-bind="cw.attrs" v-on="cw.on">
                <v-list-item-icon>
                  <v-icon>mdi-tag-plus</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Create Work</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </DialogCreateWork>
        </v-list>
      </v-menu>
    </AdminHeader>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-spacer />

            <v-text-field
              v-model.trim="search"
              append-icon="mdi-magnify"
              placeholder="Filter..."
              label="Search"
              clearable
              single-line
              solo
              hide-details
            />

            <v-btn class="ml-3" icon large @click="fetch">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <DataTableWork :works="works" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  watch,
} from '@nuxtjs/composition-api'
import { useWork } from '@/stores'
import { useDebouncedRef } from '@/composables'

export default defineComponent({
  layout: 'admin',
  setup() {
    const workStore = useWork()

    const search = useDebouncedRef('')

    const breadcrumbs = [
      {
        text: 'Dashboard',
        href: '/admin/',
      },
      {
        text: 'Volunteer Work',
      },
    ]

    const works = computed(() => workStore.works)

    const fetch = async () =>
      await workStore.findAll({ contains: search.value })

    useFetch(fetch)
    watch(search, fetch)

    return { breadcrumbs, fetch, works, search }
  },
  head: {
    title: 'Work',
  },
})
</script>
