<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-select
          v-model="rule.selected"
          :items="rule.labels"
          class="discrete"
          hide-details
          filled
          dense
          @change="onChange"
        ></v-select>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="abort()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Custom recurrence</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn text @click="setCustomRRule()">Done</v-btn>
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
                    v-model="options.interval"
                    class="discrete"
                    type="number"
                    filled
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>

                <v-col>
                  <v-select
                    v-model="options.freq"
                    class="discrete"
                    :items="frequencies"
                    :item-text="options.interval > 1 ? 'plural' : 'singular'"
                    filled
                    hide-details
                    dense
                  />
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

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
                class="discrete"
                hide-details
                filled
                dense
              />
            </v-list-item-content>
          </v-list-item>

          <v-divider v-if="options.frequency !== 3" />

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Ends</v-list-item-title>

              <v-radio-group v-model="type">
                <v-radio value="never">
                  <template #label>
                    <span class="inline-height">Never</span>
                  </template>
                </v-radio>
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
                              class="discrete"
                              hide-details
                              filled
                              readonly
                              dense
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>

                          <v-date-picker v-model="untilISO" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text @click="dateDialog = false"
                              >Cancel</v-btn
                            >
                            <v-btn text @click="$refs.dateDialog.save(untilISO)"
                              >Ok</v-btn
                            >
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
                          v-model="options.count"
                          class="discrete occurrence-field"
                          type="number"
                          hide-details
                          filled
                          dense
                        />
                        <span
                          class="fake-input"
                          @click="$refs.occurrences.focus()"
                          v-text="`occurrence${options.count > 1 ? 's' : ''}`"
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
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Frequency, ByWeekday } from 'rrule'
import moment from 'moment'

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

export interface Weekdays {
  text: string
  value: ByWeekday
  short: string
}

export enum RecurrenceTerminator {
  NEVER = 'never',
  UNTIL = 'until',
  COUNT = 'count',
}

export enum MonthType {
  ABSOLUTE = 'absolute',
  RELATIVE = 'relative',
}

@Component
export default class RecurrenceDialog extends Vue {
  @Prop() value?: any
  @Prop({ type: Date, required: true }) date!: Date

  dialog = false
  dateDialog = false

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
    selected: null as number | null,
    labels: [
      { text: 'Does not repeat', value: null },
      { text: 'Every day', value: Frequency.DAILY },
      { text: 'Every week', value: Frequency.WEEKLY },
      { text: 'Every month', value: Frequency.MONTHLY },
      { text: 'Every year', value: Frequency.YEARLY },
      { text: 'Custom...', value: -1 },
    ],
    options: null as Partial<RecurrenceOpts> | null,
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

  weekdays = [
    { text: 'S', value: 'SU', short: 'Sun' },
    { text: 'M', value: 'MO', short: 'Mon' },
    { text: 'T', value: 'TU', short: 'Tue' },
    { text: 'W', value: 'WE', short: 'Wed' },
    { text: 'T', value: 'TH', short: 'Thu' },
    { text: 'F', value: 'FR', short: 'Fri' },
    { text: 'S', value: 'SA', short: 'Sat' },
  ] as Weekdays[]

  type: RecurrenceTerminator = RecurrenceTerminator.NEVER

  freq = {
    monthType: MonthType.ABSOLUTE,
  }

  options: RecurrenceOpts = {
    interval: 1,
    freq: Frequency.DAILY,
    dtstart: this.date,
    until: null,
    count: 10,
    byweekday: null,
    bysetpos: null,
    bymonthday: null,
  }

  defaults: RecurrenceOpts | null = null

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
          this.occurance[this.options.bysetpos as number]
        } ${this.weekday[this.date.getDay()]}`,
      },
    ]
  }

  onChange(type: number | null) {
    if (type === null) return

    // The user selected "Custom..."
    if (type === -1) {
      this.dialog = true
      return
    }

    // If they didn't select custom,
    // set the rrule preset.
    this.rule.options = {
      freq: type,
      dtstart: this.date,
    }

    if (this.rule.labels[0].value !== null) {
      this.rule.labels.shift()
    }

    this.$emit('input', this.rule.options)
  }

  customRuleToText(rule: Partial<RecurrenceOpts>) {
    console.log(rule)
    const retval = ['Repeats']
    const freq = this.frequencies.find((f) => f.value === rule.freq)

    if (rule.interval) {
      retval.push(`every ${rule.interval} ${freq!.singular}`)
    } else {
      retval.push(freq!.relative)
    }

    if (rule.byweekday && rule.freq === Frequency.WEEKLY) {
      console.log('got here')
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

  beforeMount() {
    // Set initial until date to the next month.
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

    // Copy the default options to reset the component.
    this.defaults = Object.assign({}, this.options)
  }

  getWeekdayOccurance(date: Date) {
    const d = new Date(date.getTime())
    const day = d.getDay()
    const count = 1

    d.setDate(1)

    // Get the first weekday matching the original date.
    while (d.getDay() !== day) {
      d.setDate(d.getDate() + 1)
    }

    // Get all of the matching weekdays.
    while (d.getDate() > date.getDay()) {
      d.setDate(d.getDate() + 7)
    }

    return count
  }

  reset() {
    this.options = Object.assign({}, this.defaults)
  }

  open() {
    this.dialog = true
  }

  setCustomRRule() {
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

    this.rule.selected = -2
    this.rule.options = retval

    // Check if we already have a custom rule defined
    if (this.rule.labels[0].value !== null) {
      this.rule.labels[0].text = this.customRuleToText(retval)
    } else {
      this.rule.labels.unshift({
        text: this.customRuleToText(this.rule.options),
        value: -2,
      })
    }

    this.$emit('input', retval)

    this.dialog = false
  }

  abort() {
    this.dialog = false

    if (this.rule.selected === -1) {
      this.rule.selected = null
    }
  }
}
</script>

<style lang="scss" scoped>
.discrete {
  border-radius: 4px;

  ::v-deep .v-input__slot {
    &::before {
      display: none;
    }
  }
}

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
