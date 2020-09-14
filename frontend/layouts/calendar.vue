<template>
  <v-app>
    <v-app-bar fixed app flat :clipped-left="$vuetify.breakpoint.lgAndUp">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="ml-0">Orlando Math Circle</v-toolbar-title>

      <v-tooltip bottom>
        <v-btn slot="activator" depressed :icon="$vuetify.breakpoint.smAndDown">
          <span v-if="$vuetify.breakpoint.mdAndUp">Today</span>
          <v-icon v-else>{{ labels.todayIcon }}</v-icon>
        </v-btn>
        <span>{{ todaysDate }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <v-btn slot="activator" icon depressed @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span>{{ prevLabel }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <v-btn slot="activator" icon depressed @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <span>{{ nextLabel }}</span>
      </v-tooltip>

      <h1 class="title">{{ summary }}</h1>

      <v-spacer></v-spacer>

      <v-select
        v-model="types[0]"
        :items="types"
        item-text="label"
        return-object
        rounded
        class="ma-2"
      ></v-select>
    </v-app-bar>

    <v-main>
      <v-container fluid fill-height>
        <v-calendar ref="calendar" :type="type" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import moment from 'moment'
import Vue from 'vue'

interface CalendarView {
  type: string
  label: string
}

export default Vue.extend({
  data() {
    return {
      drawer: false,
      labels: {
        todayIcon: 'mdi-calendar-today',
      },
      type: 'month',
      types: [
        { type: 'month', label: 'Month' },
        { type: 'week', label: 'Week' },
        { type: 'day', label: 'Day' },
      ],
    }
  },
  computed: {
    currentView: {
      get(): CalendarView {
        return (
          this.types.find((type) => type.type === this.type) || this.types[0]
        )
      },
    },
    prevLabel(): string {
      return `Previous ${this.currentView.label}`
    },
    nextLabel(): string {
      return `Next ${this.currentView.label}`
    },
    summary(): string {
      return 'Calendar'
    },
  },
  methods: {
    todaysDate() {
      return moment().format('dddd, MMMM Do')
    },
  },
})
</script>
