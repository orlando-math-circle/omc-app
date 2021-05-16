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
          ref="calendar"
          v-model="calendar.date"
          click-redirect-base="/admin/calendar/events"
          :type.sync="calendar.type"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table-paginated :items="eventsForDate" :headers="headers">
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
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Calendar from '@/components/Calendar.vue'
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  computed,
} from '@nuxtjs/composition-api'
import { formatDate } from '@/utils/utilities'
import { useEvents } from '@/store/useEvents'
import { useDates } from '../../../../composables/useDates'

export default defineComponent({
  layout: 'admin',
  transition: 'admin',
  setup() {
    const refs = {
      calendar: ref<InstanceType<typeof Calendar>>(),
    }

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
    const header = computed(() => {
      const date = format(dateNative.value, 'EEEE, LLLL do')

      if (!eventsForDate.value.length) {
        return `Nothing scheduled for ${date}`
      }

      return `Events on ${date}`
    })

    const format = (date: Date | string, formatString: string) =>
      formatDate(date, formatString)

    const onEventCreated = async () => await refs.calendar.value!.onLoadRange()

    return {
      ...refs,
      ...toRefs(state),
      headers,
      dateNative,
      events,
      eventsForDate,
      header,
      onEventCreated,
    }
  },
})
</script>
