<template>
  <div>
    <v-row>
      <v-col cols="4">
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

      <!-- Admin Quick Management -->
      <v-col v-if="$store.getters['auth/loggedIn']">
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">Admin</v-btn>
          </template>

          <v-list>
            <dialog-create-event lazy>
              <template #activator="{ on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                  <v-list-item-title>Create Event</v-list-item-title>
                </v-list-item>
              </template>
            </dialog-create-event>
          </v-list>
        </v-menu>
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
        <h2>{{ header }}</h2>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { format, parseISO } from 'date-fns'

export default Vue.extend({
  data() {
    return {
      calendar: {
        type: 'simple',
        types: [
          { value: 'simple', text: 'Simple' },
          { value: 'month', text: 'Month' },
          { value: 'week', text: 'Week' },
          { value: 'day', text: 'Day' },
          { value: '4day', text: '4-Day' },
        ],
        date: new Date().toISOString().substr(0, 10),
      },
    }
  },
  computed: {
    dateNative(): Date {
      return parseISO(this.calendar.date)
    },
    header(): string {
      return `Events on ${format(this.dateNative, 'EEEE, LLLL do')}`
    },
  },
})
</script>
