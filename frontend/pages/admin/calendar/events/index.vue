<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="6" sm="5" md="3">
        <v-select
          v-model="calendar.type"
          class="filled--bright type-selector elevation-2"
          :items="calendar.types"
          append-icon="mdi-chevron-down"
          solo
          flat
          dense
          hide-details
          :menu-props="{ offsetY: true }"
        />
      </v-col>

      <v-col cols="auto" class="ml-auto">
        <dialog-create-event @created="onEventCreated">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" color="primary" v-on="on">Create Event</v-btn>
          </template>
        </dialog-create-event>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <calendar
          ref="calendar"
          v-model="calendar.date"
          :type.sync="calendar.type"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table-paginated :items="eventsForDate" :headers="headers">
          <template v-slot:[`item.id`]="{ item }">
            # <link-copy :text="item.id"></link-copy>
          </template>

          <template v-slot:[`item.start`]="{ item }">
            {{ format(item.dtstart, 'EEE, MMM do, yyyy') }}
          </template>

          <template v-slot:[`item.end`]="{ item }">
            {{ format(item.dtend, 'EEE, MMM do, yyyy') }}
          </template>

          <template v-slot:[`item.edit`]="{ item }">
            <v-btn icon :to="`/admin/calendar/events/${item.id}`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
        </v-data-table-paginated>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { format, isSameDay, parseISO } from 'date-fns'
import { Component, Vue } from 'nuxt-property-decorator'
import { formatDate } from '../../../../utils/utilities'
import Calendar from '~/components/Calendar.vue'

@Component({
  layout: 'admin',
  transition: 'admin',
})
export default class CalendarAdminPage extends Vue {
  $refs!: {
    calendar: InstanceType<typeof Calendar>
  }

  headers = [
    { text: 'Id', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: 'Start', value: 'start' },
    { text: 'End', value: 'end' },
    { text: 'Edit', value: 'edit' },
  ]

  calendar = {
    type: 'simple',
    types: [
      { value: 'simple', text: 'Simple' },
      { value: 'month', text: 'Month' },
      { value: 'week', text: 'Week' },
      { value: 'day', text: 'Day' },
      { value: '4day', text: '4-Day' },
    ],
    date: new Date().toISOString().substr(0, 10),
  }

  get dateNative() {
    return parseISO(this.calendar.date)
  }

  get events() {
    return this.$accessor.events.calendarEvents
  }

  get eventsForDate() {
    return this.events.filter((event) =>
      isSameDay(this.dateNative, parseISO(event.dtstart))
    )
  }

  get header() {
    const date = format(this.dateNative, 'EEEE, LLLL do')

    if (!this.eventsForDate.length) {
      return `Nothing scheduled for ${date}`
    }

    return `Events on ${date}`
  }

  format(date: Date | string, formatString: string) {
    return formatDate(date, formatString)
  }

  async onEventCreated() {
    await this.$refs.calendar.refresh()
  }
}
</script>
