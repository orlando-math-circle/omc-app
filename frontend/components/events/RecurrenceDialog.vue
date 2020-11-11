<template>
  <v-dialog v-model="dialog" max-width="440" @click:outside="close">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-select
          v-model="rule.selected"
          :items="selections"
          hide-details
          filled
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
                <!-- Infinitely recurring events is disabled -->
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
                          :return-value.sync="untilISO"
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

                          <v-date-picker v-model="untilISO" scrollable>
                            <v-spacer />

                            <v-btn text @click="dateDialog = false"
                              >Cancel
                            </v-btn>
                            <v-btn
                              text
                              @click="datePickerDialog.save(untilISO)"
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
                          class="fake-input"
                          @click="occurrences.focus()"
                          v-text="
                            `occurrence${
                              options.count && options.count > 1 ? 's' : ''
                            }`
                          "
                        />
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
import moment from 'moment'
import { parseISO } from 'date-fns'

export interface RecurrenceOpts {
  interval: number
  freq: Frequency
  dtstart: Date | null
  until: Date | null
  count: number | null
  byweekday: ByWeekday | ByWeekday[] | null
  bysetpos: number | null
  bymonthday: number | number[] | null
}

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

  options: RecurrenceOpts = {
    interval: 1,
    freq: Frequency.DAILY,
    dtstart: parseISO(this.dateString),
    until: null,
    count: 10,
    byweekday: null,
    bysetpos: null,
    bymonthday: null,
  }

  get date() {
    return parseISO(this.dateString)
  }

  get untilISO(): string {
    return this.options.until!.toISOString().substring(0, 10)
  }

  set untilISO(iso: string) {
    this.options.until = new Date(iso)
  }

  get formattedUntilDate() {
    return this.options.until
      ? moment(this.options.until).format('dddd, MMMM D')
      : ''
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

    this.options.until = nextMonth

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

  customRuleToText(rule: Partial<RecurrenceOpts>) {
    const retval = ['Repeats']
    const freq = this.frequencies.find((f) => f.value === rule.freq)

    if (rule.interval) {
      retval.push(`every ${rule.interval} ${freq!.singular}`)
    } else {
      retval.push(freq!.relative)
    }

    if (rule.byweekday && rule.freq === Frequency.WEEKLY) {
      // This is super dangerous code with possible undefined stuff everywhere.
      const days = Array.isArray(rule.byweekday)
        ? rule.byweekday.map(
            (w) => this.weekdays.find((wo) => wo.value === w)!.short
          )
        : typeof rule.byweekday === 'string'
        ? [this.weekdays.find((wd) => wd.value === rule.byweekday)]
        : []

      retval.push(`on ${days.join(', ')}`)
    }

    if (rule.until) {
      retval.push(`until ${rule.until.toDateString()}`)
    } else if (rule.count) {
      retval.push(`for ${rule.count} times`)
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
    const retval: Partial<RecurrenceOpts> = {
      freq: this.options.freq,
      dtstart: this.date,
    }

    if (this.type === RecurrenceTerminator.UNTIL) {
      retval.until = this.options.until
    } else if (this.type === RecurrenceTerminator.COUNT) {
      retval.count = this.options.count
    }

    if (this.options.interval > 1) {
      retval.interval = this.options.interval
    }

    // Weekly
    if (this.options.freq === 2) {
      retval.byweekday = this.options.byweekday
    }

    // Monthly
    if (this.options.freq === 1) {
      if (this.freq.monthType === MonthType.ABSOLUTE) {
        retval.bymonthday = this.options.bymonthday
      } else {
        retval.bysetpos = this.options.bysetpos
        retval.byweekday = this.options.byweekday
      }
    }

    this.pristine = false
    this.rule.selected = RecurrenceSelections.DEFINED

    this.$emit('input', retval)

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
  border-radius: 4px 0 0 4px;
}

.fake-input {
  background-color: #f0f0f0;
  border-radius: 0 4px 4px 0;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  padding: 0 16px 0 8px;
}
</style>
