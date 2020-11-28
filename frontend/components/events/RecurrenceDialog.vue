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
                          ref="dateDialog"
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
                            <v-btn
                              text
                              @click="datePickerDialog.save(options.until)"
                            >
                              Ok
                            </v-btn>
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
                          @click="occurrences.focus()"
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
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator'
import { Frequency, ByWeekday, Options } from 'rrule'
import { format, parseISO } from 'date-fns'
import {
  EventRecurrenceDto,
  EventRecurrenceOptions,
} from '../../interfaces/events/event-recurrence.interface'

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

@Component
export default class RecurrenceDialog extends Vue {
  @Ref('occurrences') readonly occurrences!: HTMLFormElement
  @Ref('dateDialog') readonly datePickerDialog!: { save: (value: any) => void }
  @Prop({ required: true }) value!: null | Partial<Options>
  @Prop({ required: true }) dateString!: string

  dialog = false
  dateDialog = false
  pristine = true

  frequencies = [
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

  rule = {
    labels: [
      { text: 'Does not repeat', value: RecurrenceSelections.NONREPEATING },
      { text: 'Custom...', value: RecurrenceSelections.CUSTOM },
    ],
    selected: RecurrenceSelections.NONREPEATING,
    prevSelected: null as RecurrenceSelections | null,
  }

  occurance = ['first', 'second', 'third', 'fourth', 'fifth']
  weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  weekdays: Weekday[] = [
    { text: 'S', value: 6, short: 'Sun' },
    { text: 'M', value: 0, short: 'Mon' },
    { text: 'T', value: 1, short: 'Tue' },
    { text: 'W', value: 2, short: 'Wed' },
    { text: 'T', value: 3, short: 'Thu' },
    { text: 'F', value: 4, short: 'Fri' },
    { text: 'S', value: 5, short: 'Sat' },
  ]

  type: RecurrenceTerminator = RecurrenceTerminator.UNTIL

  freq = {
    monthType: MonthType.ABSOLUTE,
  }

  options: EventRecurrenceOptions = {
    interval: 1,
    freq: Frequency.DAILY,
    dtstart: '',
    until: '',
    count: 10,
    byweekday: [],
    bysetpos: 1,
    bymonthday: 1,
  }

  get date() {
    return parseISO(this.dateString)
  }

  // The v-date-picker component will not accept time.
  // Warning: This is also changed to a local date!
  get until() {
    return format(new Date(this.options.until), 'yyyy-MM-dd')
  }

  set until(date: string) {
    this.options.until = parseISO(date).toISOString()
  }

  get formattedUntilDate() {
    if (!this.options.until) return ''

    return format(new Date(this.options.until), 'LLL do, yyyy')
  }

  get monthTypes() {
    return [
      {
        text: `Monthly on day ${this.date.getDate()}`,
        value: MonthType.ABSOLUTE,
      },
      {
        text: `Monthly on the ${
          this.occurance[(this.options.bysetpos as number) - 1]
        } ${this.weekday[this.date.getDay()]}`,
      },
    ]
  }

  get selections() {
    if (this.pristine) return this.rule.labels

    return [
      {
        text: this.customRuleToText(this.options),
        value: RecurrenceSelections.DEFINED,
      },
      ...this.rule.labels,
    ]
  }

  /**
   * Initializes the RRule data and copies any
   * provided data over.
   */
  beforeMount() {
    const now = new Date()
    const month = now.getMonth()

    const nextMonth =
      month === 11
        ? new Date(now.getFullYear() + 1, 0, 1)
        : new Date(now.getFullYear(), month + 1, 1)

    this.options.until = nextMonth.toISOString()

    const weekday = this.weekdays[this.date.getDay()].value

    // Set the byweekday value to the selected day
    this.options.byweekday = [weekday]

    // Set bymonthday and bysetpos for month-based intervals.
    this.options.bysetpos = this.getWeekdayOccurance(this.date)
    this.options.bymonthday = this.date.getDate()

    if (this.value) {
      Object.assign(this.options, this.value)

      if (this.value.until) {
        this.type = RecurrenceTerminator.UNTIL
      } else if (this.value.count) {
        this.type = RecurrenceTerminator.COUNT
      }

      this.rule.selected = RecurrenceSelections.DEFINED
      this.pristine = false
    }
  }

  @Watch('rule.selected')
  onSelect(type: RecurrenceSelections, old: RecurrenceSelections) {
    switch (type) {
      case RecurrenceSelections.NONREPEATING:
        this.$emit('input', null)
        this.$emit('change:rule')
        break
      case RecurrenceSelections.CUSTOM:
        this.dialog = true
        break
      case RecurrenceSelections.DEFINED:
        this.onSetRule()
        break
      default:
        break
    }

    this.rule.prevSelected = old
  }

  customRuleToText(rule: EventRecurrenceOptions) {
    const retval = ['Repeats']
    const freq = this.frequencies.find((f) => f.value === rule.freq)

    if (rule.interval !== 1) {
      retval.push(`every ${rule.interval} ${freq!.plural}`)
    } else {
      retval.push(freq!.relative)
    }

    if (rule.byweekday && rule.freq === Frequency.WEEKLY) {
      const days: string[] = []

      for (let i = 0; i < this.weekdays.length; i++) {
        for (let j = 0; j < rule.byweekday.length; j++) {
          if (this.weekdays[i].value === rule.byweekday[j]) {
            days.push(this.weekdays[i].short)
          }
        }
      }

      retval.push(`on ${days.join(', ')}`)
    }

    if (this.type === RecurrenceTerminator.UNTIL && rule.until) {
      retval.push(`until ${format(new Date(rule.until), 'LLL do, yyyy')}`)
    } else if (this.type === RecurrenceTerminator.COUNT && rule.count) {
      retval.push(`${rule.count} times`)
    }

    return retval.join(' ')
  }

  /**
   * Calculates the occurrance of a weekday given a date.
   * For example, Thanksgiving is always the 4th Thursday of November.
   */
  getWeekdayOccurance(dateOrString: Date | string) {
    const date =
      typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString

    return Math.ceil(date.getDate() / 7)
  }

  onSetRule() {
    let dto: EventRecurrenceDto

    switch (this.type) {
      case RecurrenceTerminator.UNTIL:
        dto = {
          freq: this.options.freq,
          dtstart: this.date.toISOString(),
          until: this.options.until,
        }
        break
      case RecurrenceTerminator.COUNT:
        dto = {
          freq: this.options.freq,
          dtstart: this.date.toISOString(),
          count: this.options.count,
        }

        break
      default:
        throw new Error('Unexpected recurrence terminating behavior')
    }

    if (this.options.interval > 1) {
      dto.interval = this.options.interval
    }

    // Weekly
    if (this.options.freq === 2) {
      dto.byweekday = this.options.byweekday
    }

    // Monthly
    if (this.options.freq === 1) {
      if (this.freq.monthType === MonthType.ABSOLUTE) {
        dto.bymonthday = this.options.bymonthday
      } else {
        dto.bysetpos = this.options.bysetpos
        dto.byweekday = this.options.byweekday
      }
    }

    this.pristine = false
    this.rule.selected = RecurrenceSelections.DEFINED

    this.$emit('input', dto)
    this.$emit('change:rule')

    this.dialog = false
  }

  close() {
    this.dialog = false

    if (this.rule.selected === RecurrenceSelections.CUSTOM) {
      if (this.rule.prevSelected !== null) {
        this.rule.selected = this.rule.prevSelected
      } else {
        this.rule.selected = RecurrenceSelections.NONREPEATING
      }
    }
  }
}
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
