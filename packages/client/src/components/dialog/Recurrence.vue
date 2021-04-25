<template>
  <v-dialog v-model="dialog" max-width="440" @click:outside="close">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-select
          v-model="rule.selected"
          :items="selections"
          hide-details
          outlined
        />
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="close()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Custom recurrence</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-list>
          <!-- Option: Interval & Frequency -->
          <v-list-item>
            <v-list-item-content>
              <v-row>
                <v-col cols="auto">
                  <span class="inline-height">Repeat every</span>
                </v-col>

                <v-col>
                  <v-text-field
                    v-model.number="options.interval"
                    type="number"
                    outlined
                    hide-details
                    dense
                  />
                </v-col>

                <v-col>
                  <v-select
                    v-model="options.freq"
                    :items="frequencies"
                    :item-text="options.interval > 1 ? 'plural' : 'singular'"
                    outlined
                    hide-details
                    dense
                  />
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <!-- Option [Weekly]: ByWeekday -->
          <v-list-item v-if="options.freq === 2">
            <v-list-item-content>
              <v-subheader>Repeats On</v-subheader>

              <v-btn-toggle v-model="options.byweekday" multiple>
                <v-btn
                  v-for="weekday in weekdays"
                  :key="weekday.value"
                  :value="weekday.value"
                  v-text="weekday.text"
                />
              </v-btn-toggle>
            </v-list-item-content>
          </v-list-item>

          <!-- Option [Monthly]: ????????????????? -->
          <v-list-item v-if="options.freq === 1">
            <v-list-item-content>
              <v-select
                v-model="freq.monthType"
                :items="monthTypes"
                hide-details
                outlined
                dense
              />
            </v-list-item-content>
          </v-list-item>

          <v-divider v-if="options.freq !== 3" />

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Ends</v-list-item-title>

              <v-radio-group v-model="type" class="pl-2">
                <!-- Infinitely recurring events are disabled -->
                <!-- <v-radio value="never">
                  <template #label>
                    <span class="inline-height">Never</span>
                  </template>
                </v-radio> -->

                <v-radio value="until">
                  <template #label>
                    <v-row>
                      <v-col cols="auto" class="inline-height"> On </v-col>
                      <v-col>
                        <v-dialog
                          v-model="dateDialog"
                          :return-value.sync="options.until"
                          width="290px"
                        >
                          <template #activator="{ on, attrs }">
                            <v-text-field
                              :value="formattedUntilDate"
                              hide-details
                              outlined
                              readonly
                              dense
                              v-bind="attrs"
                              v-on="on"
                            />
                          </template>

                          <v-date-picker v-model="until" scrollable>
                            <v-spacer />

                            <v-btn text @click="dateDialog = false"
                              >Cancel
                            </v-btn>

                            <v-btn text> Ok </v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </template>
                </v-radio>

                <v-radio value="count">
                  <template #label>
                    <v-row>
                      <v-col cols="auto">
                        <span class="inline-height">After</span>
                      </v-col>
                      <v-col class="d-flex">
                        <v-text-field
                          ref="occurrences"
                          v-model.number="options.count"
                          class="occurrence-field"
                          type="number"
                          hide-details
                          outlined
                          dense
                        />
                        <v-sheet
                          class="fake-input outlined"
                          @click="occurrences && occurrences.focus()"
                        >
                          occurrence{{
                            options.count && options.count > 1 ? 's' : ''
                          }}
                        </v-sheet>
                      </v-col>
                    </v-row>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="onSetRule()">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Frequency, ByWeekday, Options } from 'rrule'
import { format, parseISO } from 'date-fns'
import {
  EventRecurrenceDto,
  EventRecurrenceOptions,
} from '@/types/events/event-recurrence.interface'
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'

export interface Weekday {
  text: string
  value: ByWeekday
  short: string
}

export enum RecurrenceTerminator {
  // NEVER = 'never',
  UNTIL = 'until',
  COUNT = 'count',
}

export enum MonthType {
  ABSOLUTE = 'absolute',
  RELATIVE = 'relative',
}

export enum RecurrenceSelections {
  NONREPEATING = -1,
  CUSTOM = 0,
  DEFINED = 1,
}

const frequencies = [
  {
    singular: 'day',
    plural: 'days',
    relative: 'daily',
    value: Frequency.DAILY,
  },
  {
    singular: 'week',
    plural: 'weeks',
    relative: 'weekly',
    value: Frequency.WEEKLY,
  },
  {
    singular: 'month',
    plural: 'months',
    relative: 'monthly',
    value: Frequency.MONTHLY,
  },
  {
    singular: 'year',
    plural: 'years',
    relative: 'yearly',
    value: Frequency.YEARLY,
  },
]

const occurance = ['first', 'second', 'third', 'fourth', 'fifth']
const weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const weekdays: Weekday[] = [
  { text: 'S', value: 6, short: 'Sun' },
  { text: 'M', value: 0, short: 'Mon' },
  { text: 'T', value: 1, short: 'Tue' },
  { text: 'W', value: 2, short: 'Wed' },
  { text: 'T', value: 3, short: 'Thu' },
  { text: 'F', value: 4, short: 'Fri' },
  { text: 'S', value: 5, short: 'Sat' },
]

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<Options | null>,
      required: false,
      default: null,
    },
    dateString: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const refs = {
      occurrences: ref<InstanceType<typeof HTMLFormElement>>(),
    }

    const state = reactive({
      dialog: false,
      dateDialog: false,
      pristine: true,
      rule: {
        labels: [
          { text: 'Does not repeat', value: RecurrenceSelections.NONREPEATING },
          { text: 'Custom...', value: RecurrenceSelections.CUSTOM },
        ],
        selected: RecurrenceSelections.NONREPEATING,
        prevSelected: null as RecurrenceSelections | null,
      },
      type: RecurrenceTerminator.UNTIL,
      freq: {
        monthType: MonthType.ABSOLUTE,
      },
      options: {
        interval: 1,
        freq: Frequency.DAILY,
        dtstart: '',
        until: '',
        count: 10,
        byweekday: [],
        bysetpos: 1,
        bymonthday: 1,
      } as EventRecurrenceOptions,
    })

    const date = computed(() => parseISO(props.dateString))

    // The v-date-picker component will not accept time.
    // Warning: This is also changed to a local date!
    const until = computed({
      get() {
        return format(new Date(state.options.until), 'yyyy-MM-dd')
      },
      set(date: string) {
        state.options.until = parseISO(date).toISOString()
      },
    })

    const formattedUntilDate = computed(() => {
      if (!state.options.until) return ''

      return format(new Date(state.options.until), 'LLL do, yyyy')
    })

    const monthTypes = computed(() => [
      {
        text: `Monthly on day ${date.value.getDate()}`,
        value: MonthType.ABSOLUTE,
      },
      {
        text: `Monthly on the ${
          occurance[(state.options.bysetpos as number) - 1]
        } ${weekday[date.value.getDay()]}`,
      },
    ])

    const customRuleToText = (rule: EventRecurrenceOptions) => {
      const retval = ['Repeats']
      const freq = frequencies.find((f) => f.value === rule.freq)

      if (rule.interval !== 1) {
        retval.push(`every ${rule.interval} ${freq!.plural}`)
      } else {
        retval.push(freq!.relative)
      }

      if (rule.byweekday && rule.freq === Frequency.WEEKLY) {
        const days: string[] = []

        for (let i = 0; i < weekdays.length; i++) {
          for (let j = 0; j < rule.byweekday.length; j++) {
            if (weekdays[i].value === rule.byweekday[j]) {
              days.push(weekdays[i].short)
            }
          }
        }

        retval.push(`on ${days.join(', ')}`)
      }

      if (state.type === RecurrenceTerminator.UNTIL && rule.until) {
        retval.push(`until ${format(new Date(rule.until), 'LLL do, yyyy')}`)
      } else if (state.type === RecurrenceTerminator.COUNT && rule.count) {
        retval.push(`${rule.count} times`)
      }

      return retval.join(' ')
    }

    const selections = computed(() => {
      if (state.pristine) return state.rule.labels

      return [
        {
          text: customRuleToText(state.options),
          value: RecurrenceSelections.DEFINED,
        },
        ...state.rule.labels,
      ]
    })

    /**
     * Calculates the occurrance of a weekday given a date.
     * For example, Thanksgiving is always the 4th Thursday of November.
     */
    const getWeekdayOccurance = (dateOrString: Date | string) => {
      const date =
        typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString

      return Math.ceil(date.getDate() / 7)
    }

    /**
     * Initializes the RRule data and copies any
     * provided data over.
     */
    onBeforeMount(() => {
      const now = new Date()
      const month = now.getMonth()

      const nextMonth =
        month === 11
          ? new Date(now.getFullYear() + 1, 0, 1)
          : new Date(now.getFullYear(), month + 1, 1)

      state.options.until = nextMonth.toISOString()

      const weekday = weekdays[date.value.getDay()].value

      // Set the byweekday value to the selected day
      state.options.byweekday = [weekday]

      // Set bymonthday and bysetpos for month-based intervals.
      state.options.bysetpos = getWeekdayOccurance(date.value)
      state.options.bymonthday = date.value.getDate()

      if (props.value) {
        Object.assign(state.options, props.value)

        if (props.value.until) {
          state.type = RecurrenceTerminator.UNTIL
        } else if (props.value.count) {
          state.type = RecurrenceTerminator.COUNT
        }

        state.rule.selected = RecurrenceSelections.DEFINED
        state.pristine = false
      }
    })

    const onSetRule = () => {
      let dto: EventRecurrenceDto

      switch (state.type) {
        case RecurrenceTerminator.UNTIL:
          dto = {
            freq: state.options.freq,
            dtstart: date.value.toISOString(),
            until: state.options.until,
          }
          break
        case RecurrenceTerminator.COUNT:
          dto = {
            freq: state.options.freq,
            dtstart: date.value.toISOString(),
            count: state.options.count,
          }

          break
        default:
          throw new Error('Unexpected recurrence terminating behavior')
      }

      if (state.options.interval > 1) {
        dto.interval = state.options.interval
      }

      // Weekly
      if (state.options.freq === 2) {
        dto.byweekday = state.options.byweekday
      }

      // Monthly
      if (state.options.freq === 1) {
        if (state.freq.monthType === MonthType.ABSOLUTE) {
          dto.bymonthday = state.options.bymonthday
        } else {
          dto.bysetpos = state.options.bysetpos
          dto.byweekday = state.options.byweekday
        }
      }

      state.pristine = false
      state.rule.selected = RecurrenceSelections.DEFINED

      emit('input', dto)
      emit('change:rule')

      state.dialog = false
    }

    const onSelect = (
      type: RecurrenceSelections,
      old: RecurrenceSelections
    ) => {
      switch (type) {
        case RecurrenceSelections.NONREPEATING:
          emit('input', null)
          emit('change:rule')
          break
        case RecurrenceSelections.CUSTOM:
          state.dialog = true
          break
        case RecurrenceSelections.DEFINED:
          onSetRule()
          break
        default:
          break
      }

      state.rule.prevSelected = old
    }

    const close = () => {
      state.dialog = false

      if (state.rule.selected === RecurrenceSelections.CUSTOM) {
        if (state.rule.prevSelected !== null) {
          state.rule.selected = state.rule.prevSelected
        } else {
          state.rule.selected = RecurrenceSelections.NONREPEATING
        }
      }
    }

    watch(() => state.rule.selected, onSelect, { deep: true })

    return {
      ...refs,
      ...toRefs(state),
      date,
      until,
      weekdays,
      formattedUntilDate,
      monthTypes,
      frequencies,
      selections,
      onSetRule,
      close,
      onSelect,
    }
  },
})
</script>

<style lang="scss" scoped>
.inline-height {
  line-height: 40px;
}

.occurrence-field {
  display: inline-block;
  width: 65px;
}

.fake-input {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  padding: 0 16px 0 8px;
}
</style>
