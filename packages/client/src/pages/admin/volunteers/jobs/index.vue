<template>
  <div>
    <admin-header title="Volunteer Jobs" :breadcrumbs="breadcrumbs">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" v-on="on">
            Actions <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <dialog-create-job :is-static="false" @create:job="onCreateJob">
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-tag-plus</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Create Job</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </dialog-create-job>
        </v-list>
      </v-menu>
    </admin-header>

    <v-row>
      <v-col>
        <data-table-jobs :jobs="jobs" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Jobs',
  },
  async fetch({ app: { $accessor } }) {
    await $accessor.volunteers.findAll()
  },
})
export default class AdminJobsPage extends Vue {
  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Volunteer Jobs',
    },
  ]

  get jobs() {
    return this.$accessor.volunteers.jobs
  }

  onCreateJob() {
    this.refresh()
  }

  async refresh() {
    await this.$accessor.volunteers.findAll()
  }
}
</script>
