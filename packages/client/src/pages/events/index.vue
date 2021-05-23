<template>
  <div>
    <v-row>
      <v-col cols="5" md="3">
        <v-select
          v-model="type"
          class="filled--bright type-selector elevation-2"
          :items="calendarTypes"
          append-icon="mdi-chevron-down"
          solo
          flat
          dense
          hide-details
          :menu-props="{ offsetY: true }"
        />
      </v-col>

      <v-col cols="auto" class="ml-auto">
        <v-btn @click="onResetDate">Today</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <Calendar
          ref="calendar"
          v-model="date"
          :type.sync="type"
          :projects="projectFilterIds"
        />
      </v-col>
    </v-row>

    <!-- Chip Project Filters -->
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

    <!-- Event Slots -->
    <v-row>
      <v-col>
        <h2 class="mb-3">{{ header }}</h2>

        <div v-if="!eventsForDate.length" class="subheader">
          No events scheduled
        </div>

        <EventSpread
          v-for="event in eventsForDate"
          :key="event.id + '_spread'"
          :event="event"
          class="mb-3"
        />
      </v-col>
    </v-row>

    <!-- Calendar View Events -->
    <v-row v-if="type">
      <v-col>
        <h2 class="mb-3">{{ typeDescription }}</h2>

        <v-slide-group class="mb-4">
          <v-slide-item
            v-for="event in events"
            :key="event.id + '_block'"
            class="padded-block"
          >
            <EventBlock class="mr-4" :event="event" />
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  useFetch,
} from '@nuxtjs/composition-api'
import { format, isSameDay, parseISO } from 'date-fns'
import Calendar from '@/components/Calendar.vue'
import { useProjects, useEvents } from '@/stores'
import { calendarTypes } from '@/utils/constants'

export default defineComponent({
  setup() {
    const refs = {
      calendar: ref<InstanceType<typeof Calendar>>(),
    }

    const projectStore = useProjects()
    const eventStore = useEvents()

    useFetch(async () => {
      await projectStore.findAll()
    })

    const state = reactive({
      type: 'simple',
      date: new Date().toISOString().substr(0, 10),
      projectFilter: [],
      projectFilterIds: [] as number[],
    })

    const nativeDate = computed(() => parseISO(state.date))
    const header = computed(() => format(nativeDate.value, 'EEEE, LLLL do'))
    const events = computed(() => eventStore.events)
    const eventsForDate = computed(() =>
      eventStore.events.filter((event) =>
        isSameDay(nativeDate.value, parseISO(event.dtstart))
      )
    )
    const projects = computed(() => projectStore.projects)

    const typeDescription = computed(() => {
      switch (state.type) {
        case 'simple':
        case 'month':
          return 'Events this month'
        case 'week':
          return 'Events this week'
        case '4-day':
          return 'Events in the next 4 days'
      }
    })

    const onFilterChange = (indices: number[]) => {
      state.projectFilterIds = indices.map((i) => projects.value[i].id)
    }

    const onResetDate = () => {
      state.date = new Date().toISOString().substr(0, 10)
    }

    return {
      ...refs,
      ...toRefs(state),
      calendarTypes,
      header,
      events,
      eventsForDate,
      projects,
      typeDescription,
      onFilterChange,
      onResetDate,
    }
  },
  head: {
    title: 'Events',
  },
})
</script>

<style lang="scss" scoped>
// Fixes mobile scrolling issue
// https://github.com/vuetifyjs/vuetify/issues/10673#issuecomment-674203098
::v-deep .v-slide-group__wrapper {
  touch-action: auto !important;
}

.padded-block {
  margin: 15px 0;
}

.subheader {
  font-size: 1.2rem;
  font-weight: 500;
}
</style>
