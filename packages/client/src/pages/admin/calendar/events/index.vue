<template>
  <div>
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
        <DialogCreateEvent :date="calendar.date" @event:create="onEventCreated">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" color="primary" v-on="on">Create Event</v-btn>
          </template>
        </DialogCreateEvent>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <Calendar
          ref="calendarRef"
          v-model="calendar.date"
          :type.sync="calendar.type"
          click-redirect-base="/admin/calendar/events"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- TODO: Investigate SSR hydration warning. -->
        <client-only>
          <v-data-table-paginated
            v-model="events"
            :items="eventsForDate"
            no-data-text="No Events for Date"
            :headers="headers"
          >
            <template #[`item.id`]="{ item }">
              # <link-copy :text="item.id"></link-copy>
            </template>

            <template #[`item.start`]="{ item }">
              {{ format(item.dtstart, 'EEE, MMM do, yyyy') }}
            </template>

            <template #[`item.end`]="{ item }">
              {{ format(item.dtend, 'EEE, MMM do, yyyy') }}
            </template>

            <template #[`item.edit`]="{ item }">
              <v-btn icon :to="`/admin/calendar/events/${item.id}`">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-data-table-paginated>
        </client-only>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Calendar from '@/components/Calendar.vue'
import {
  defineComponent,
  toRefs,
  reactive,
  computed,
} from '@nuxtjs/composition-api'
import { useEvents } from '@/stores'
import { useTemplateRef, useDates } from '@/composables'

type CalendarComponent = InstanceType<typeof Calendar>

export default defineComponent({
  layout: 'admin',
  transition: 'admin',
  setup() {
    const calendarRef = useTemplateRef<CalendarComponent>('calendarRef')

    const headers = [
      { text: 'Id', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Description', value: 'description' },
      { text: 'Start', value: 'start' },
      { text: 'End', value: 'end' },
      { text: 'Edit', value: 'edit' },
    ]

    const state = reactive({
      calendar: {
        type: 'simple',
        events: [] as number[],
        types: [
          { value: 'simple', text: 'Simple' },
          { value: 'month', text: 'Month' },
          { value: 'week', text: 'Week' },
          { value: 'day', text: 'Day' },
          { value: '4day', text: '4-Day' },
        ],
        date: new Date().toISOString().substr(0, 10),
      },
    })

    const eventStore = useEvents()
    const dateUtil = useDates()

    const dateNative = computed(() => dateUtil.toDate(state.calendar.date))
    const events = computed(() => eventStore.calendarEvents)
    const eventsForDate = computed(() =>
      events.value.filter((e) =>
        dateUtil.isSameDay(dateNative.value, dateUtil.toDate(e.dtstart))
      )
    )

    const onEventCreated = async () => await calendarRef.value.onLoadRange()

    return {
      ...toRefs(state),
      headers,
      dateNative,
      events,
      format: dateUtil.format,
      eventsForDate,
      onEventCreated,
    }
  },
})
</script>
