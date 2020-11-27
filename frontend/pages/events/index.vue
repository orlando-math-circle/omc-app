<template>
  <div>
    <v-row>
      <v-col cols="5" md="3">
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
        <v-btn @click="resetDate">Today</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <calendar
          ref="calendar"
          v-model="calendar.date"
          :type.sync="calendar.type"
          :project-filter-ids="projectFilterIds"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-chip-group
          v-model="projectFilter"
          multiple
          :show-arrows="$vuetify.breakpoint.mobile"
          @change="onFilterChange"
        >
          <v-chip v-for="project in projects" :key="project.id" filter>
            {{ project.name }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h2>{{ header }}</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-slide-group class="mb-4">
          <v-slide-item v-for="event in eventsForDate" :key="event.id">
            <event-block
              :event="event"
              :link="`/events/${event.id}`"
              class="mr-4"
            ></event-block>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { format, isSameDay, parseISO } from 'date-fns'
import { Component, Vue } from 'nuxt-property-decorator'
import Calendar from '~/components/Calendar.vue'

@Component({
  head() {
    return {
      title: 'Events',
    }
  },
  fetch({ app: { $accessor } }) {
    $accessor.projects.findAll()
  },
})
export default class EventsPage extends Vue {
  $refs!: {
    calendar: InstanceType<typeof Calendar>
  }

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

  projectFilter = []
  projectFilterIds: number[] = []

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

  get projects() {
    return this.$accessor.projects.projects
  }

  onFilterChange(indices: number[]) {
    this.projectFilterIds = indices.map((i) => this.projects[i].id)
  }

  resetDate() {
    this.calendar.date = new Date().toISOString().substr(0, 10)
  }

  async onEventCreated() {
    await this.$refs.calendar.refresh()
  }
}
</script>
