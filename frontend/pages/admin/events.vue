<template>
  <div>
    <v-row>
      <v-col cols="auto"
        ><v-select
          v-model="type"
          :items="calendar.types"
          hide-details
          solo
        ></v-select
      ></v-col>

      <!-- Range Buttons -->
      <v-col>
        <v-btn icon @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>

      <!-- Event adder -->
      <v-col>
        <create-event-dialog @created="onCreated">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">Add Event</v-btn>
          </template>
        </create-event-dialog>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-calendar
          ref="calendar"
          v-model="calendar.date"
          :events="events"
          :type="type"
          @change="getEvents"
        ></v-calendar>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  endOfDay,
  startOfDay,
} from 'date-fns'
import { COOKIE_CALENDAR_TYPE } from '~/utils/constants'

export type ComponentRefs = VueConstructor<
  Vue & {
    $refs: {
      calendar: {
        prev: () => void
        next: () => void
      }
    }
  }
>

export default (Vue as ComponentRefs).extend({
  layout: 'admin',

  data() {
    return {
      calendar: {
        date: new Date().toString().substr(0, 10),
        types: [
          { text: 'Month', value: 'month' },
          { text: 'Week', value: 'week' },
          { text: 'Day', value: 'day' },
          { text: '4 Days', value: '4day' },
        ],
      },
    }
  },
  computed: {
    type: {
      get() {
        return this.$store.state.auth.settings.calendarType
      },
      set(calendarType: string) {
        this.$store.commit('auth/SET_SETTINGS', { calendarType })
        this.$cookies.set(COOKIE_CALENDAR_TYPE, calendarType)
      },
    },
    events() {
      return this.$store.getters['events/events']
    },
  },
  methods: {
    getRange() {
      const now = new Date()

      if (this.type === 'month') {
        return { start: startOfMonth(now), end: endOfMonth(now) }
      } else if (this.type === 'week') {
        return { start: startOfWeek(now), end: endOfWeek(now) }
      } else if (this.type === 'day') {
        return { start: startOfDay(now), end: endOfDay(now) }
      }
    },
    async getEvents({ start, end }: any) {
      await this.$store.dispatch('events/fetchEvents', {
        start: new Date(start.year, start.month - 1, start.day).toISOString(),
        end: new Date(end.year, end.month - 1, end.day).toISOString(),
      })
    },
    async onCreated() {
      const range = this.getRange()

      if (!range) return

      await this.$store.dispatch('events/fetchEvents', {
        start: range.start.toISOString(),
        end: range.end.toISOString(),
      })
    },
  },
})
</script>
