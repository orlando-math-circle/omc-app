<template>
  <v-container class="pa-6">
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Edit Event — {{ event.name }}</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pt-0">
            <breadcrumbs class="pa-0" :items="breadcrumbs" large></breadcrumbs>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Edit Event</v-card-title>

          <v-form-validated>
            <v-card-text>
              <v-text-field-validated
                v-model="event.name"
                label="Name"
                hide-details="auto"
                vid="name"
                rules="required"
                required
              ></v-text-field-validated>
            </v-card-text>
          </v-form-validated>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Event } from '@backend/event/event.entity'

@Component
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
      text: 'Edit Event',
    },
  ]

  internalData = null as Event | null

  get event() {
    if (this.internalData == null) {
      this.internalData = Object.assign({}, this.$accessor.events.event)
    }

    return this.$accessor.events.event
  }

  set event(value: null | Event) {
    this.internalData = value
  }

  async fetch() {
    await this.$accessor.events.findOne(this.$route.params.id)
  }
}
</script>
