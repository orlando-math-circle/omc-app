<template>
  <div>
    <!-- Simple Date-Picker Calendar -->
    <!-- :allowed-dates="(date) => dates.includes(date)" -->
    <v-date-picker
      v-if="internalType === 'simple'"
      v-model="date"
      :events="dates"
      :event-color="
        (date) =>
          date[9] % 3 ? '#44d9e6' : date[9] % 2 ? '#ff4299' : '#fee266'
      "
      full-width
      no-title
      elevation="2"
      @update:picker-date="onPickerChange"
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
          :type="internalType"
          :events="events"
          :loading="$store.getters['events/isLoading']"
          :short-weekdays="false"
          @click:event="onClickEvent"
          @change="onChange"
        >
        </v-calendar>
      </v-sheet>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'nuxt-property-decorator'
import {
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns'
import { VCalendar } from 'vuetify/src/components/VCalendar'
import { VCalendarChange } from '../interfaces/calendar.interface'
import { months } from '../utils/constants'
import { Event } from '../../backend/src/event/event.entity'

@Component
export default class Calendar extends Vue {
  @Prop({ required: true }) value!: string
  @PropSync('type', { default: 'simple' }) internalType!: string
  @Prop() projectFilterIds?: number[]

  $refs!: {
    calendar: InstanceType<typeof VCalendar>
  }

  today = new Date()
  range = {
    start: null as Date | null,
    end: null as Date | null,
    moved: false,
  }

  get date() {
    return this.value
  }

  set date(value: string) {
    this.$emit('input', value)
  }

  get events() {
    return this.$accessor.events.events
  }

  get dates() {
    return this.$accessor.events.dates
  }

  get header() {
    if (this.range.start) {
      return `${
        months[this.range.start.getMonth()]
      }, ${this.range.start.getFullYear()}`
    }

    return `${months[this.today.getMonth()]}, ${this.today.getFullYear()}`
  }

  @Watch('projectFilterIds')
  async onChangeProjectFilterIds() {
    await this.$fetch()
  }

  /**
   * Setup the calendar start and end date ranges before the
   * calendar is completely initialized.
   */
  created() {
    const date = parseISO(this.value)

    switch (this.internalType) {
      case 'week':
        this.range.start = startOfWeek(date)
        this.range.end = endOfWeek(date)
        break
      case 'simple':
      case 'month':
        this.range.start = startOfMonth(date)
        this.range.end = endOfMonth(date)
        break
    }
  }

  async fetch() {
    await this.$accessor.events.findAll({
      start: this.range.start as Date,
      end: this.range!.end as Date,
      projects: this.projectFilterIds?.length
        ? this.projectFilterIds
        : undefined,
    })
  }

  onClickEvent({ event }: { event: Event }) {
    this.$router.push(`/events/${event.id}`)
  }

  async onChange({ start, end }: VCalendarChange) {
    this.range.start = parseISO(start.date)
    this.range.end = parseISO(end.date)

    // The first change occurs on initialization,
    // don't retieve data twice (from fetch)
    if (!this.range.moved) {
      this.range.moved = true
      return
    }

    await this.$fetch()
  }

  async onPickerChange(dateString: string) {
    const now = new Date()
    const date = parseISO(dateString)

    let newDate: string

    if (now.getUTCMonth() === date.getUTCMonth()) {
      newDate = now.toISOString().substr(0, 10)
    } else {
      newDate = date.toISOString().substr(0, 10)
    }

    if (this.date === newDate) return

    this.date = newDate

    await this.$accessor.events.findAll({
      start: startOfMonth(date),
      end: endOfMonth(date),
    })
  }

  async refresh() {
    if (this.internalType === 'simple') {
      const now = new Date()

      await this.$accessor.events.findAll({
        start: startOfMonth(now),
        end: endOfMonth(now),
      })
    }
  }
}
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
