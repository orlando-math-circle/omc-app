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
    </v-row>

    <v-row>
      <v-col>
        <v-calendar :events="events" :type="calendar.type"></v-calendar>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { COOKIE_CALENDAR_TYPE } from '~/utils/constants'

export default Vue.extend({
  layout: 'admin',
  data() {
    return {
      calendar: {
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
})
</script>
