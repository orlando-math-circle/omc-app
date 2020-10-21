<template>
  <v-card :to="`/events/${value.id}`">
    <v-card-title>{{ value.name }}</v-card-title>
    <v-card-subtitle>{{ value.description }}</v-card-subtitle>

    <v-list-item>
      <v-list-item-content>
        <v-row no-gutters class="mb-2">
          <v-col cols="auto">
            <v-icon>mdi-clock-outline</v-icon>
          </v-col>

          <v-col class="pl-5">{{ start }}</v-col>
        </v-row>

        <v-row no-gutters class="mb-2">
          <v-col cols="auto">
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-col>

          <v-col class="pl-5">
            {{ value.author.first }} {{ value.author.last }}
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="auto">
            <v-icon>{{
              value.isOnline ? 'mdi-web' : 'mdi-map-marker-outline'
            }}</v-icon>
          </v-col>

          <v-col class="pl-5">
            {{ value.isOnline ? 'Online' : value.location }}
          </v-col>
        </v-row>
      </v-list-item-content>

      <v-list-item-avatar rounded size="100">
        <v-img :src="picture"></v-img>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { format, parseISO } from 'date-fns'
import { CalendarEvent } from '~/interfaces/calendar-event.interface'
import { Event } from '~/../backend/src/event/event.entity'

@Component
export default class EventComponent extends Vue {
  @Prop() value!: CalendarEvent | Event

  get date() {
    if ('start' in this.value) {
      return parseISO((this.value as CalendarEvent).start)
    }

    return parseISO(((this.value as Event).dtstart as unknown) as string)
  }

  get start() {
    return format(this.date, 'eee, MMM do, yyyy')
  }

  get picture() {
    return this.value.picture || require('~/assets/images/programmer.jpg')
  }
}
</script>
