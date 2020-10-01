<template>
  <div>
    <!-- Simple Date-Picker Calendar -->
    <!-- :allowed-dates="(date) => dates.includes(date)" -->
    <v-date-picker
      v-if="type === 'simple'"
      v-model="date"
      :events="dates"
      :event-color="
        (date) =>
          date[9] % 3 ? '#44d9e6' : date[9] % 2 ? '#ff4299' : '#fee266'
      "
      full-width
      no-title
      elevation="2"
    />

    <!-- Regular, Full-Size Calendar -->
    <v-card v-else>
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

      <v-sheet class="calendar--wrapper" height="500px">
        <v-calendar
          ref="calendar"
          v-model="date"
          class="calendar"
          :type="type"
          :events="events"
          :loading="$store.getters['events/isLoading']"
          :short-weekdays="false"
          @change="onChange"
        >
        </v-calendar>
      </v-sheet>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue'
import {
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns'
import { CalendarEvent, CalendarTimestamp } from 'vuetify'
import { VCalendar } from 'vuetify/src/components/VCalendar'
import { CalendarType, VCalendarChange } from '../interfaces/calendar.interface'
import { months } from '../utils/constants'

export type ComponentRefs = VueConstructor<
  Vue & {
    $refs: {
      calendar: InstanceType<typeof VCalendar>
    }
  }
>

export default (Vue as ComponentRefs).extend({
  props: {
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<CalendarType>,
      default: 'simple',
    },
  },
  async fetch() {
    const date = parseISO(this.value)
    let start: Date, end: Date

    switch (this.type) {
      case 'week':
        start = startOfWeek(date)
        end = endOfWeek(date)
        break
      case 'simple':
      case 'month':
      default:
        start = startOfMonth(date)
        end = endOfMonth(date)
        break
    }

    await this.$store.dispatch('events/fetchEvents', { start, end })
  },
  data() {
    return {
      today: new Date(),
      range: {
        start: null as CalendarTimestamp | null,
        end: null as CalendarTimestamp | null,
        moved: false,
      },
    }
  },
  computed: {
    date: {
      get(): string {
        return this.value
      },
      set(value: string) {
        this.$emit('input', value)
      },
    },
    view: {
      get(): string {
        return this.type
      },
      set(type: string) {
        this.$emit('update:type', type)
      },
    },
    events(): CalendarEvent[] {
      return this.$store.getters['events/events']
    },
    dates(): string[] {
      return this.events.map((event) => event.start.substr(0, 10))
    },
    dateNative(): Date {
      return parseISO(this.date)
    },
    eventsForDate(): CalendarEvent[] {
      return this.events.filter((event) =>
        isSameDay(this.dateNative, parseISO(event.start))
      )
    },
    header(): string {
      if (this.range.start) {
        return `${months[this.range.start.month - 1]}, ${this.range.start.year}`
      }

      return `${months[this.today.getMonth()]}, ${this.today.getFullYear()}`
    },
  },
  methods: {
    onPickerChange(date: any) {
      console.log(date)
    },
    async onChange({ start, end }: VCalendarChange) {
      this.range.start = start
      this.range.end = end

      // The first change occurs on initialization,
      // don't retieve data twice (from fetch)
      if (!this.range.moved) {
        this.range.moved = true
        return
      }

      await this.$store.dispatch('events/fetchEvents', {
        start: parseISO(start.date),
        end: parseISO(end.date),
      })
    },
  },
})
</script>

<style lang="scss" scoped>
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
</style>
