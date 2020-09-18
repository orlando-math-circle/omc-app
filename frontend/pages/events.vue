<template>
  <v-row>
    <!-- Left Sidebar -->
    <v-col v-if="false" md="3">
      <!-- Monthly Calendar -->
      <v-card class="rounded-card" flat>
        <v-card-title></v-card-title>

        <v-card-text>
          <v-calendar
            ref="mini-calendar"
            v-model="calendar.value"
            type="month"
            :events="events"
          ></v-calendar>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col>
      <v-row class="mb-10">
        <v-col>
          <h1 class="d-inline-flex" v-text="header" />
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon x-large>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon x-large>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-select
            v-model="calendar.type"
            class="filled--bright type-selector elevation-2"
            :items="calendar.types"
            append-icon="mdi-chevron-down"
            solo
            flat
            hide-details
            :menu-props="{ offsetY: true }"
          >
          </v-select>
        </v-col>

        <v-col cols="auto">
          <create-event-dialog @created="onCreate">
            <template #activator="{ on, attrs }">
              <v-btn class="add-event" v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon>Add
              </v-btn>
            </template>
          </create-event-dialog>
        </v-col>
      </v-row>

      <!-- Calendar -->
      <v-row>
        <v-col>
          <v-sheet class="rounded">
            <v-calendar
              ref="calendar"
              v-model="calendar.value"
              class="calendar"
              :type="calendar.type"
              :events="events"
              :loading="$store.getters['events/isLoading']"
              :short-weekdays="false"
              @click:event="showEvent"
              @change="updateRange"
            />

            <v-menu
              v-model="selected.open"
              :close-on-content-click="false"
              :activator="selected.element"
              offset-x
            >
              <v-card v-if="selected.event">
                <v-toolbar>
                  <v-btn icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-toolbar-title>{{ selected.event.name }}</v-toolbar-title>
                </v-toolbar>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row>
        <h2>Events</h2>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { CalendarTimestamp } from 'vuetify/types'
import { Event } from '~/types/event.interface'
import { months } from '~/utils/constants'

export type CalendarUpdateType = {
  start: CalendarTimestamp
  end: CalendarTimestamp
}

@Component({
  head: {
    title: 'Events',
  },
})
export default class EventsPage extends Vue {
  $refs!: {
    calendar: any
  }

  today = new Date()

  calendar = {
    value: '',
    type: 'month',
    types: [
      { value: 'month', text: 'Month' },
      { value: 'week', text: 'Week' },
      { value: 'day', text: 'Day' },
      { value: '4day', text: '4-Day' },
    ],
    events: [],
    dialogs: {
      create: false,
    },
    range: {
      start: null as CalendarTimestamp | null,
      end: null as CalendarTimestamp | null,
    },
  }

  selected = {
    open: false,
    event: null as Event | null,
    element: null,
  }

  loaded = false

  get events() {
    return this.$store.getters['events/events']
  }

  get header() {
    if (this.calendar.range.start) {
      return `${months[this.calendar.range.start.month - 1]}, ${
        this.calendar.range.start.year
      }`
    }

    return `${months[this.today.getMonth()]}, ${this.today.getFullYear()}`
  }

  getEvents(start: Date, end: Date) {
    return this.$axios.$get('/event', { params: { start, end } })
  }

  showEvent({ nativeEvent, event }: any) {
    const open = () => {
      this.selected.event = event
      this.selected.element = nativeEvent.target
      setTimeout(() => (this.selected.open = true), 10)
    }

    if (this.selected.open) {
      this.selected.open = false
      setTimeout(open, 10)
    } else {
      open()
    }

    nativeEvent.stopPropagation()
  }

  onCreate() {
    const { start, end } = this.calendar.range

    if (!start || !end) return

    this.updateRange({ start, end })
  }

  async updateRange({ start, end }: CalendarUpdateType) {
    this.calendar.range.start = start
    this.calendar.range.end = end

    await this.$store.dispatch('events/fetchEvents', {
      start: new Date(Date.UTC(start.year, start.month - 1, start.day)),
      end: new Date(Date.UTC(end.year, end.month - 1, end.day)),
    })
  }
}
</script>

<style lang="scss" scoped>
.rounded {
  border-radius: 25px !important;
}

// .calendar {
//   border-radius: 25px;
//   border: 0;

//   ::v-deep {
//     .v-calendar-weekly__head-weekday {
//       padding-top: 20px;

//       &:last-child {
//         border-right: 0;
//       }
//     }

//     .v-calendar-weekly__week {
//       .v-calendar-weekly__day:last-child {
//         border-right: 0;
//       }

//       &:last-child {
//         .v-calendar-weekly__day {
//           border-bottom: 0;
//         }
//       }
//     }
//   }
// }

.rounded-card {
  border-radius: 20px;
}

.type-selector {
  font-weight: bold;
  width: 140px;
}

.add-event {
  font-weight: bold;
  height: 55px !important;
  border-radius: 15px;
}

.filled--bright {
  border-radius: 15px;
  height: 55px;

  ::v-deep .v-input__slot {
    height: 55px;
    padding: 0 20px !important;
  }
}
</style>
