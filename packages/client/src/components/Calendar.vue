<template>
  <div>
    <!-- Simple Date-Picker Calendar -->
    <v-date-picker
      v-if="type === 'simple'"
      v-model="date"
      :events="dates"
      event-color="#ff4299"
      full-width
      no-title
      elevation="2"
      @update:picker-date="setRangeByMonth"
    />

    <!-- Regular, Full-Size Calendar -->
    <v-card v-else>
      <div class="calendar--header d-flex justify-center align-center">
        <v-btn icon @click="calendar && calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <div class="calendar--header__title">
          {{ title }}
        </div>

        <v-btn icon @click="calendar && calendar.next()">
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
          :event-color="calendarColor"
          :loading="isLoading"
          :short-weekdays="false"
          @click:event="(e) => onClickEvent(e.event.id)"
          @change="(range) => setRange(range.start, range.end)"
        />
      </v-sheet>
    </v-card>
  </div>
</template>

<script lang="ts">
import { VCalendar } from 'vuetify/src/components/VCalendar'
import { Event } from '@server/event/event.entity'
import { CalendarType, months } from '@/utils/constants'
import { useDates } from '@/composables/useDates'
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  toRef,
  toRefs,
  useFetch,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import { useEvents } from '@/store/useEvents'
import { CalendarTimestamp } from 'vuetify'

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<CalendarType>,
      default: 'simple',
    },
    projects: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    clickRedirectBase: {
      type: String,
      default: '/events',
    },
  },
  setup(props, { emit }) {
    const calendar = ref<InstanceType<typeof VCalendar>>()

    const router = useRouter()
    const dateUtil = useDates()
    const eventStore = useEvents()

    const date = computed({
      get() {
        return props.value
      },
      set(value: string) {
        emit('input', value)
      },
    })

    const nativeDate = computed(() => dateUtil.toDate(date.value))

    const rangeFromType = (type: CalendarType) => {
      switch (type) {
        case 'week':
          return {
            start: dateUtil.startOfWeek(nativeDate.value),
            end: dateUtil.endOfWeek(nativeDate.value),
          }
        case 'simple':
        case 'month':
          return {
            start: dateUtil.startOfMonth(nativeDate.value),
            end: dateUtil.endOfMonth(nativeDate.value),
          }
        case 'day':
          return {
            start: dateUtil.startOfDay(nativeDate.value),
            end: dateUtil.endOfDay(nativeDate.value),
          }
        case '4day':
          return {
            start: dateUtil.startOfDay(nativeDate.value),
            end: dateUtil.addDays(dateUtil.startOfDay(nativeDate.value), 4),
          }
      }
    }

    const state = reactive({
      range: {
        ...rangeFromType(props.type),
      },
    })

    const projects = toRef(props, 'projects')
    const events = computed(() => eventStore.calendarEvents)
    const dates = computed(() => eventStore.dates)
    const title = computed(() => {
      if (!state.range.start) return ''

      return `${
        months[state.range.start.getMonth()]
      } ${state.range.start.getFullYear()}`
    })
    const colors = computed(() =>
      events.value.reduce(
        (ret, event) => ({
          ...ret,
          [event.dtstart.substr(0, 10)]: event.color || '#000000',
        }),
        {}
      )
    )

    /**
     * Moves the calendar window range using an ISO
     * string only up to the month, e.g. `2020-05` by
     * using the start and end dates of that month.
     *
     * Used by the VDatePicker component.
     */
    const setRangeByMonth = (month: string) => {
      const nativeDate = dateUtil.toDate((month += '-01'))

      state.range.start = dateUtil.startOfMonth(nativeDate)
      state.range.end = dateUtil.endOfMonth(nativeDate)
    }

    /**
     * Moves the calendar window range using ISO
     * strings representing the dates, e.g. `2020-05-01`.
     *
     * Used by the VCalendar component.
     */
    const setRange = (start: CalendarTimestamp, end: CalendarTimestamp) => {
      state.range.start = dateUtil.toDate(start.date)
      state.range.end = dateUtil.endOfDay(end.date)
    }

    const onClickEvent = (id: number) => {
      router.push(`${props.clickRedirectBase}/${id}`)
    }

    const calendarColor = (date: Event) => date.color || '#000000'

    const onLoadRange = async () => {
      await eventStore.findAll({
        start: state.range.start!,
        end: state.range.end!,
        projects: projects.value ? projects.value : undefined,
      })
    }

    /**
     * Fetch the initial range and again if the range
     * or project filters are modified.
     */
    useFetch(async () => await onLoadRange())
    watch(() => state.range, onLoadRange, { deep: true })
    watch(projects, onLoadRange)

    return {
      date,
      calendar,
      ...toRefs(state),
      isLoading: computed(() => eventStore.isLoading),
      calendarColor,
      events,
      dates,
      title,
      colors,
      onClickEvent,
      setRangeByMonth,
      setRange,
    }
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
