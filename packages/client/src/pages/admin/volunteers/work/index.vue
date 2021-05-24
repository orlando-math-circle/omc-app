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
          <dialog-create-work :is-static="false" @create:work="onWorkCreate">
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
          </dialog-create-work>
        </v-list>
      </v-menu>
    </AdminHeader>

    <v-row>
      <v-col>
        <data-table-works :works="works" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useFetch } from '@nuxtjs/composition-api'
import { useWork } from '@/stores'

export default defineComponent({
  layout: 'admin',
  setup() {
    const workStore = useWork()
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

    const onWorkCreate = async () => await refresh()

    const refresh = async () => await workStore.findAll()

    useFetch(async () => await workStore.findAll())

    return { breadcrumbs, onWorkCreate, works }
  },
  head: {
    title: 'Work',
  },
})
</script>
