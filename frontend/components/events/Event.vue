<template>
  <v-card :to="`/events/${value.id}`">
    <div class="d-flex flex-row">
      <div class="d-flex flex-column" style="width: 100%">
        <v-card-title>{{ value.name }}</v-card-title>
        <v-card-subtitle>{{ value.description }}</v-card-subtitle>

        <v-row class="pa-5">
          <v-col cols="auto">
            <v-icon>mdi-clock-outline</v-icon> {{ start }}
          </v-col>

          <v-col cols="auto">
            <v-icon>
              {{
                value.location === 'Online'
                  ? 'mdi-web'
                  : 'mdi-map-marker-outline'
              }}</v-icon
            >
            {{ value.location }}</v-col
          >
        </v-row>
      </div>

      <div class="d-flex align-self-end pa-4">
        <v-img :src="picture" width="200px" class="rounded"></v-img>
      </div>
    </div>
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
