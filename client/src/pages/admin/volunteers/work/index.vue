<template>
  <div>
    <admin-header title="Volunteer Work" :breadcrumbs="breadcrumbs">
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
    </admin-header>

    <v-row>
      <v-col>
        <data-table-works :works="works" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Work',
  },
  async fetch({ app: { $accessor } }) {
    await $accessor.volunteers.findAllWork()
  },
})
export default class VolunteerWorkAdminPage extends Vue {
  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Volunteer Work',
    },
  ]

  get works() {
    return this.$accessor.volunteers.works
  }

  async onWorkCreate() {
    await this.refresh()
  }

  async refresh() {
    await this.$accessor.volunteers.findAllWork()
  }
}
</script>
