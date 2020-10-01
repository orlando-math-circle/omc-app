<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col cols="auto" class="ml-auto py-0">
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
          >
          </v-select>
        </v-col>

        <v-col cols="auto py-0 pl-0">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                class="filled--bright"
                color="primary"
                v-bind="attrs"
                v-on="on"
              >
                <span>Admin</span>
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <create-event-dialog @created="onCreate">
                <template #activator="{ on, attrs }">
                  <v-list-item v-bind="attrs" v-on="on">
                    <v-list-item-content>
                      <v-list-item-title>Add Event</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </create-event-dialog>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <!-- Header -->
      <!-- <v-row> -->
      <!-- <v-col>
          <h1 class="d-inline-flex header" v-text="header" />
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon x-large>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon x-large>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col> -->
      <!-- </v-row> -->

      <!-- Full-Size Calendar -->
      <v-row v-if="calendar.type !== 'simple'">
        <v-col>
          <v-card>
            <div class="calendar--header d-flex justify-center align-center">
              <v-btn icon @click="$refs.calendar.prev()">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <div class="calendar--header__title">
                {{ header }}
              </div>

              <v-btn icon @click="$refs.calendar.next()">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>

            <v-sheet class="calendar--wrapper" height="500">
              <v-calendar
                ref="calendar"
                v-model="calendar.value"
                class="calendar"
                :type="calendar.type"
                :events="events"
                :loading="$store.getters['events/isLoading']"
                :short-weekdays="false"
                @click:event="showEvent"
                @click:date="setDate"
                @change="updateRange"
              >
                <!-- <template #day-body="{ date, week }">
                  <div
                    class="calendar__time"
                    :class="{ first: date === week[0].date }"
                    :style="{ top: nowY }"
                  ></div>
                </template> -->
              </v-calendar>

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
          </v-card>
        </v-col>
      </v-row>

      <!-- Date-Picker Calendar -->
      <v-row v-else>
        <v-col>
          <v-date-picker
            v-model="calendar.date"
            :events="eventsArray"
            :allowed-dates="(date) => eventsArray.includes(date)"
            :event-color="
              (date) =>
                date[9] % 3 ? '#44d9e6' : date[9] % 2 ? '#ff4299' : '#fee266'
            "
            full-width
            no-title
            elevation="2"
            @change="setDate"
          />
        </v-col>
      </v-row>

      <!-- Event List -->
      <v-row>
        <v-col>
          <h2
            class="mb-3"
            v-text="
              calendar.date ? `Events on ${formattedDate(calendar.date)}` : ''
            "
          ></h2>

          <template v-for="event in calendar.eventsForDate" class="mb-3">
            <event :key="event.id" :value="event" />
          </template>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { format } from 'date-fns'
import { CalendarTimestamp } from 'vuetify/types'
import moment from 'moment'
// import { Event } from '../../backend/src/event/event.entity'
import { months } from '~/utils/constants'

export type CalendarUpdateType = {
  start: CalendarTimestamp
  end: CalendarTimestamp
}

@Component({
  async fetch({ store }) {
    await store.dispatch('events/fetchEvents', {
      start: moment().startOf('month').toDate(),
      end: moment().endOf('year').toDate(),
    })
  },
  head: {
    title: 'Events',
  },
})
export default class EventsPage extends Vue {
  $refs!: {
    calendar: any
  }

  today = new Date()

  isMounted = false

  calendar = {
    value: '',
    type: 'month',
    types: [
      { value: 'simple', text: 'Simple' },
      { value: 'month', text: 'Month' },
      { value: 'week', text: 'Week' },
      { value: 'day', text: 'Day' },
      { value: '4day', text: '4-Day' },
    ],
    date: new Date().toISOString().substr(0, 10),
    events: [] as Event[],
    eventsForDate: [] as Event[],
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

  mounted() {
    this.isMounted = true
  }

  get events() {
    return this.$store.getters['events/events']
  }

  get eventsArray() {
    return this.events.map((event: any) => event.start.substr(0, 10))
  }

  get header() {
    if (this.calendar.range.start) {
      return `${months[this.calendar.range.start.month - 1]}, ${
        this.calendar.range.start.year
      }`
    }

    return `${months[this.today.getMonth()]}, ${this.today.getFullYear()}`
  }

  @Watch('calendar.date')
  changeDate(newD: string, old: string) {
    console.log(newD, old)
  }

  formattedDate(date: Date) {
    const d = new Date(date)
    return format(d.setDate(d.getDate() + 1), 'MMMM do')
  }

  getEvents(start: Date, end: Date) {
    return this.$axios.$get('/event', { params: { start, end } })
  }

  setDate(date: string) {
    this.calendar.date = date
    this.calendar.eventsForDate = this.events.filter((event: any) =>
      moment(event.start).isSame(this.calendar.date, 'day')
    )
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
.header {
  font-size: 1.5em;
}

.calendar {
  &--wrapper {
    padding: 0 16px 16px 16px;
  }

  &--header {
    padding: 4px 16px;

    &__title {
      width: 100%;
      text-align: center;
      font-weight: bold;
      padding: 0.5rem;
    }
  }
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
  width: 130px;
}

.add-event {
  font-weight: bold;
  height: 55px !important;
  border-radius: 15px;
}

.filled--bright {
  border-radius: 15px;
  height: 45px !important;
  width: 120px;

  ::v-deep .v-input__slot {
    height: 45px !important;
    padding: 0 15px !important;
  }
}
</style>
