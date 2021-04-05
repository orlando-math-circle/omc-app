<template>
  <dialog-form ref="refDialog" @submit:form="onSubmit">
    <template #title>Create Event</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">Add Event</v-btn>
      </slot>
    </template>

    <v-card-text>
      <alert-error v-if="error" class="mx-4" :error="error" />

      <v-list dense>
        <!-- Name -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-text</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-text-field-validated
              v-model="meta.name"
              label="Title"
              hide-details="auto"
              vid="title"
              rules="required"
              outlined
            >
            </v-text-field-validated>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- All-Day Selector -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-clock-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>All-day</v-list-item-content>

          <v-list-item-action>
            <v-switch v-model="dates.allday" color="secondary"></v-switch>
          </v-list-item-action>
        </v-list-item>

        <!-- Dates and Times -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2" />

          <v-list-item-content>
            <v-row wrap>
              <v-col :cols="dates.allday ? 12 : 8">
                <v-menu v-model="dates.start.menu" offset-y min-width="290px">
                  <template #activator="{ on, attrs }">
                    <v-text-field-validated
                      :value="format(dates.start.date)"
                      :label="dates.allday ? 'Date' : 'Start Date'"
                      hide-details="auto"
                      vid="startdate"
                      :rules="{
                        required: true,
                        startdate: dates.allday
                          ? false
                          : { target: '@enddate' },
                      }"
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field-validated>
                  </template>

                  <v-date-picker
                    v-model="dates.start.date"
                    @input="dates.start.menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col v-if="!dates.allday" cols="4">
                <PickerTime
                  v-model="times.start.time"
                  vid="starttime"
                  :rules="{
                    required: dates.allday,
                    starttime:
                      dates.allday ||
                      !isSameDay(dates.start.date, dates.end.date)
                        ? false
                        : { time: '@endtime' },
                  }"
                  label="Start Time"
                  outlined
                />
              </v-col>

              <v-col v-if="!dates.allday" cols="8">
                <v-menu v-model="dates.end.menu" offset-y min-width="290px">
                  <template #activator="{ on, attrs }">
                    <v-text-field-validated
                      :value="format(dates.end.date)"
                      :rules="{ required: !dates.allday }"
                      vid="enddate"
                      readonly
                      hide-details="auto"
                      label="End Date"
                      v-bind="attrs"
                      outlined
                      v-on="on"
                    >
                    </v-text-field-validated>
                  </template>
                  <v-date-picker
                    v-model="dates.end.date"
                    @input="dates.end.menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col v-if="!dates.allday" cols="4">
                <PickerTime
                  v-model="times.end.time"
                  vid="endtime"
                  label="End Time"
                  outlined
                />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Permissions -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-key-chain-variant</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="meta.permissions.grades"
                  :items="grades"
                  label="Grades"
                  outlined
                  multiple
                  hide-details="auto"
                  chips
                >
                  <template #selection="{ index }">
                    <v-chip v-if="index < gradeGroups.length" ripple>
                      {{ gradeGroups[index] }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="meta.permissions.genders"
                  :items="genders"
                  label="Gender"
                  outlined
                  multiple
                  hide-details="auto"
                  chips
                />
              </v-col>

              <v-col cols="meta.cutoffThreshold.includes('offset') ? 8 : 12">
                <v-select
                  v-model="meta.lateThreshold"
                  :items="timeThresholds"
                  label="Late Threshold"
                  hint="The point in which a registration is late, for payment purposes."
                  hide-details="auto"
                  outlined
                />
              </v-col>

              <v-col v-if="meta.lateThreshold.includes('offset')" cols="4">
                <v-text-field-validated
                  v-model.number="meta.lateOffset"
                  label="Minute Offset"
                  type="number"
                  hide-details="auto"
                  outlined
                />
              </v-col>

              <v-col :cols="meta.cutoffThreshold.includes('offset') ? 8 : 12">
                <v-select
                  v-model="meta.cutoffThreshold"
                  :items="timeThresholds"
                  label="Cutoff Threshold"
                  hint="The point in which further registrations will not be allowed."
                  hide-details="auto"
                  outlined
                />
              </v-col>

              <v-col v-if="meta.cutoffThreshold.includes('offset')" cols="4">
                <v-text-field-validated
                  v-model.number="meta.cutoffOffset"
                  label="Minute Offset"
                  type="number"
                  hide-details="auto"
                  outlined
                />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Recurrence -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-update</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col>
                <DialogRecurrence
                  ref="recurrenceDialog"
                  v-model="rrule"
                  :date-string="dates.start.date"
                />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Location -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-map-marker</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col cols="12">
                <v-combobox-validated
                  v-model="meta.locationTitle"
                  rules="required"
                  :items="['Online', 'Zoom', 'In-Person']"
                  label="Location Short"
                  hide-details="auto"
                  outlined
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="meta.location"
                  label="Location (Optional)"
                  hide-details="auto"
                  outlined
                />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Description -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-text-subject</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="meta.description"
                  label="Description"
                  rows="1"
                  auto-grow
                  hide-details="auto"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Project Management -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-puzzle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col>
                <auto-complete-project
                  v-model="project"
                  label="Project (Optional)"
                  item-value="id"
                  outlined
                />
              </v-col>
              <v-col cols="auto" class="align-self-center">
                <dialog-select-project v-model="project" />
              </v-col>
              <v-col cols="auto" class="align-self-center">
                <dialog-create-project @create:project="onProjectCreated" />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Course Management -->
        <v-list-item v-if="project" class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-school-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col>
                <auto-complete-course
                  v-model="course"
                  item-value="id"
                  :project="project"
                  outlined
                />
              </v-col>

              <v-col cols="auto" class="align-self-center">
                <dialog-select-course v-model="course" :project="project" />
              </v-col>

              <v-col cols="auto" class="align-self-center">
                <dialog-create-course
                  :project="project"
                  @create:course="onCourseCreated"
                />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <!-- Fee Management -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-currency-usd</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col cols="12">
                <v-select-validated
                  v-model="feeType"
                  :items="feeTypes"
                  :rules="{ required: true, has_course: { course } }"
                  label="Payment Mode"
                  hide-details="auto"
                  outlined
                />
              </v-col>

              <template v-if="feeType !== 'free'">
                <v-col cols="6">
                  <v-text-field-validated
                    v-model.number="fee.amount"
                    rules="required"
                    label="Event Fee"
                    type="number"
                    hide-details="auto"
                    outlined
                  />
                </v-col>

                <v-col cols="6">
                  <v-text-field-validated
                    v-model.number="fee.lateAmount"
                    label="Late Fee (Optional)"
                    type="number"
                    hide-details="auto"
                    outlined
                  />
                </v-col>
              </template>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Picture -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-image-plus</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <file-upload
              v-model="files"
              outlined
              label="Picture (Optional)"
              hint="Project pictures will be used as a fallback if provided."
              persistent-hint
            />
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Color Picker -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-palette-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-text-field-validated
              :value="meta.color"
              class="ma-0 pa-0 shrink-append"
              mask="'#XXXXXXXX'"
              hide-details="auto"
              label="Color (Optional)"
              outlined
            >
              <template #append>
                <v-menu
                  v-model="colorMenu"
                  top
                  nudge-bottom="105"
                  nudge-left="16"
                  :close-on-content-click="false"
                >
                  <template #activator="{ on }">
                    <div :style="swatch" v-on="on"></div>
                  </template>

                  <v-card>
                    <v-card-text class="pa-0">
                      <v-color-picker
                        v-model="meta.color"
                        flat
                      ></v-color-picker>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </v-text-field-validated>
          </v-list-item-content>
        </v-list-item>

        <v-divider />
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn text @click="dialog.close()">Cancel</v-btn>
      <v-btn type="submit" :loading="isLoading" color="primary">
        <v-scroll-x-transition>
          <v-icon v-if="success" class="mr-2" color="success">
            mdi-check
          </v-icon>
        </v-scroll-x-transition>

        Create Event
      </v-btn>
    </v-card-actions>
  </dialog-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'nuxt-property-decorator'
import { addDays, format, isBefore, isSameDay, parse, parseISO } from 'date-fns'
import { Options } from 'rrule'
import { Course } from '@omc/server/course/course.entity'
import { Grade } from '@omc/server/user/enums/grade.enum'
import { Project } from '@omc/server/project/project.entity'
import { FeeType } from '@omc/server/event/enums/fee-type.enum'
import { Gender } from '@omc/server/user/enums/gender.enum'
import { EventTimeThreshold } from '@omc/server/event/enums/event-time-threshold.enum'
import RecurrenceDialog from '../dialog/Recurrence.vue'
import { Uploads } from '../../interfaces/uploads.interface'
import DialogForm from './Form.vue'
import { gradeGroups, contiguousGradeRanges, grades } from '~/utils/events'
import { EventRecurrenceDto } from '~/interfaces/events/event-recurrence.interface'
import { addTime, isValidDate, roundDate, toDate } from '~/utils/utilities'
import Calendar from '~/components/Calendar.vue'
import { genders } from '~/utils/constants'

export type RRuleOptions = Partial<Options>

export type RepeatingTypes = {
  label: string
  rrule?: RRuleOptions
}

@Component
export default class DialogCreateEvent extends Vue {
  @Ref('recurrenceDialog') readonly recurrenceDialog!: RecurrenceDialog
  @Ref('calendar') readonly calendar!: Calendar
  @Ref('refDialog') readonly dialog!: DialogForm
  @Prop({ default: new Date().toISOString().substr(0, 10) }) date!: string
  @Prop({ default: format(roundDate(new Date(), 30), 'HH:mm') }) time!: string

  success = false
  grades = grades
  colorMenu = false

  dates = {
    allday: false,
    start: {
      menu: false,
      date: '',
    },
    end: {
      menu: false,
      date: '',
    },
  }

  times = {
    start: {
      menu: false,
      time: '',
    },
    end: {
      menu: false,
      time: '',
    },
    times: [] as string[],
  }

  genders = genders

  rrule = null as EventRecurrenceDto | null

  timeThresholds = [
    { text: 'Never', value: EventTimeThreshold.NEVER },
    { text: 'After Event Ends', value: EventTimeThreshold.AFTER_END },
    { text: 'After Event Starts', value: EventTimeThreshold.AFTER_START },
    { text: 'Minutes From Start', value: EventTimeThreshold.OFFSET_START },
    { text: 'Minutes From End', value: EventTimeThreshold.OFFSET_END },
  ]

  feeType: FeeType = FeeType.FREE
  feeTypes = [
    { text: 'Free', value: FeeType.FREE },
    { text: 'Pay Per Event', value: FeeType.EVENT },
    { text: 'Pay Per Course', value: FeeType.COURSE },
  ]

  fee = {
    amount: 0,
    lateAmount: 0,
  }

  meta = {
    name: '',
    description: '',
    color: '#000000',
    location: '',
    locationTitle: 'Online',
    cutoffThreshold: EventTimeThreshold.AFTER_END,
    cutoffOffset: 0,
    lateThreshold: EventTimeThreshold.AFTER_START,
    lateOffset: 0,
    permissions: {
      grades: [
        Grade.KINDERGARTEN,
        Grade.FIRST,
        Grade.SECOND,
        Grade.THIRD,
        Grade.FOURTH,
        Grade.FIFTH,
        Grade.SIXTH,
        Grade.SEVENTH,
        Grade.EIGHTH,
        Grade.NINTH,
        Grade.TENTH,
        Grade.ELEVENTH,
        Grade.TWELFTH,
      ],
      genders: [Gender.MALE, Gender.FEMALE],
    },
  }

  project: null | number = null
  course: null | number = null
  files: Uploads = null

  get error() {
    return this.$accessor.events.error || this.$accessor.files.error
  }

  get isLoading() {
    return this.$accessor.events.isLoading
  }

  get gradeGroups() {
    return gradeGroups(contiguousGradeRanges(this.meta.permissions.grades))
  }

  get swatch() {
    return {
      height: '40px',
      width: '40px',
      backgroundColor: this.meta.color,
      cursor: 'pointer',
      borderRadius: this.colorMenu ? '50%' : '4px',
      transition: 'border-radius 200ms ease-in-out',
    }
  }

  beforeMount() {
    const now = new Date()
    this.dates.start.date = this.date
    this.dates.end.date = this.date
    this.times.start.time = this.time
    this.times.end.time = addTime(this.time, 1, 30)

    // If the end time loops around to being before
    // the starting time, increment the day.
    if (
      isBefore(
        parse(this.times.end.time, 'HH:mm', now),
        parse(this.times.start.time, 'HH:mm', now)
      )
    ) {
      this.dates.end.date = addDays(parseISO(this.date), 1)
        .toISOString()
        .substr(0, 10)
    }

    const hours = [
      '12',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
    ]
    const minutes = ['00', '15', '30', '45']
    const times: string[] = []

    for (let i = 0; i <= 23; i++) {
      for (let j = 0; j < minutes.length; j++) {
        times.push(`${hours[i % 12]}:${minutes[j]}${i < 12 ? 'am' : 'pm'}`)
      }
    }

    this.times.times = times
  }

  isSameDay(dateA: string, dateB: string) {
    return isSameDay(new Date(dateA), new Date(dateB))
  }

  format(dateString: string) {
    if (dateString === '') return 'Select a Date'

    const [year, month, day] = dateString.split('-')
    const date = new Date(+year, +month - 1, +day)

    if (!isValidDate(date)) return 'Invalid Date'

    return format(date, 'EEE, LLL d, yyyy')
  }

  async onSubmit() {
    // Type asserted as this is not multi-file upload.
    const url = (await this.$accessor.files.filesToURL(this.files)) as
      | string
      | null

    if (this.$accessor.files.error) {
      console.error(this.$accessor.files.error)
    }

    const dto = Object.assign(
      {
        rrule: this.rrule || undefined,
        project: this.project || undefined,
        course: this.course || undefined,
        ...this.meta,
      },
      this.dates.allday
        ? { dtend: toDate(this.dates.start.date, '23:59').toISOString() }
        : {
            dtend: toDate(
              this.dates.end.date,
              this.times.end.time
            ).toISOString(),
          },
      !this.rrule && {
        dtstart: toDate(
          this.dates.start.date,
          this.times.start.time
        ).toISOString(),
      },
      this.feeType !== 'free' && {
        feeType: this.feeType,
        fee: {
          amount: this.fee.amount.toFixed(2),
          lateAmount: this.fee.lateAmount?.toFixed(2),
        },
      },
      url && { picture: url }
    )

    if (this.dates.allday) {
      // Incomplete, allday is not accurate
    }

    await this.$accessor.events.create(dto)

    if (this.$accessor.events.error) {
      console.error(this.$accessor.events.error)
    } else {
      this.$emit('event:create')

      this.success = true
      this.dialog.close(1500)
    }
  }

  onProjectSelect(id: number) {
    this.project = id
  }

  onProjectCreated(project: Project) {
    this.project = project.id
  }

  onCourseCreated(course: Course) {
    this.course = course.id
  }
}
</script>

<style lang="scss" scoped>
.v-card__text {
  padding: 16px 0;
}

.shrink-append {
  ::v-deep .v-input__append-inner {
    margin-top: 8px !important;
  }
}
</style>
