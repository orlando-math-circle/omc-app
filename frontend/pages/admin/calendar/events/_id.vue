<template>
  <div>
    <admin-header title="Edit Event" :breadcrumbs="breadcrumbs">
      <dialog-update-event
        :event="event"
        @event:refresh="onEventRefresh"
        @event:update="onEventRefresh"
      >
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">Edit Event</v-btn>
        </template>
      </dialog-update-event>
    </admin-header>

    <v-row>
      <v-col> </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit Event',
  },
  async fetch({ app: { $accessor }, route }) {
    await $accessor.events.findOne(route.params.id)
  },
})
export default class AdminEventEditPage extends Vue {
  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Events',
      href: '/admin/calendar/events',
    },
    {
      text: 'Event',
    },
  ]

  get event() {
    return this.$accessor.events.event
  }

  async onEventRefresh(id: string) {
    await this.$accessor.events.findOne(id)
  }
}
</script>
