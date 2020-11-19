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
                <time-picker
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
                ></time-picker>
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
                <time-picker
                  v-model="times.end.time"
                  vid="endtime"
                  label="End Time"
                  outlined
                ></time-picker>
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
              <v-col cols="6">
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
                    <v-chip v-if="index < gradeRanges.length" ripple>
                      {{ gradeRanges[index] }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="meta.permissions.sexes"
                  :items="sexes"
                  label="Sex"
                  outlined
                  multiple
                  hide-details="auto"
                  chips
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
                <recurrence-dialog
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
              <v-col>
                <v-text-field
                  v-model="meta.location"
                  label="Location"
                  hide-details="auto"
                  outlined
                ></v-text-field>
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
                <auto-complete-project v-model="project" outlined />
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
                  :project="project"
                  outlined
                />
              </v-col>

              <v-col cols="auto">
                <dialog-select-course v-model="course" :project="project" />
              </v-col>

              <v-col cols="auto">
                <dialog-create-course
                  :project="project"
                  @create:course="onCourseCreated"
                />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

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
import { Grade } from '../../../backend/src/user/enums/grade.enum'
import { Sex } from '../../../backend/src/user/enums/sex.enum'
import { CreateEventDto } from '../../../backend/src/event/dtos/create-event.dto'
import { Project } from '../../../backend/src/project/project.entity'
import RecurrenceDialog from '../events/RecurrenceDialog.vue'
import { Uploads } from '../../interfaces/uploads.interface'
import DialogForm from './DialogForm.vue'
import { EventRecurrenceDto } from '~/interfaces/events/event-recurrence.interface'
import { addTime, isValidDate, roundDate, toDate } from '~/utils/utilities'
import { Course } from '~/../backend/src/course/course.entity'
import Calendar from '~/components/Calendar.vue'

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

  sexes = [
    { text: 'Male', value: 'male' },
    { text: 'Female', value: 'female' },
  ]

  grades = [
    { text: 'Kindergarten', short: 'K', value: Grade.KINDERGARTEN },
    { text: '1st Grade', short: '1st', value: Grade.FIRST },
    { text: '2nd Grade', short: '2nd', value: Grade.SECOND },
    { text: '3rd Grade', short: '3rd', value: Grade.THIRD },
    { text: '4th Grade', short: '4th', value: Grade.FOURTH },
    { text: '5th Grade', short: '5th', value: Grade.FIFTH },
    { text: '6th Grade', short: '6th', value: Grade.SIXTH },
    { text: '7th Grade', short: '7th', value: Grade.SEVENTH },
    { text: '8th Grade', short: '8th', value: Grade.EIGHTH },
    { text: '9th Grade', short: '9th', value: Grade.NINTH },
    { text: '10th Grade', short: '10th', value: Grade.TENTH },
    { text: '11th Grade', short: '11th', value: Grade.ELEVENTH },
    { text: '12th Grade', short: '12th', value: Grade.TWELFTH },
  ]

  rrule = null as EventRecurrenceDto | null

  meta = {
    name: '',
    description: '',
    location: '',
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
      sexes: [Sex.MALE, Sex.FEMALE],
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

  get gradeRanges() {
    const levels = [...this.meta.permissions.grades].sort((a, b) => a - b)

    const ranges: number[][] = []

    for (let i = 0, j = 0; i < levels.length; i++) {
      if (!ranges[j]) {
        ranges[j] = [levels[i]]
      } else if (levels[i] === levels[i - 1] + 1) {
        ranges[j].push(levels[i])
      } else {
        ranges[++j] = [levels[i]]
      }
    }

    const chips = []

    for (const range of ranges) {
      switch (range.length) {
        case 0:
          break
        case 1:
          chips.push(this.grades[range[0]].text)
          break
        default:
          chips.push(
            `${this.grades[range[0]].short} - ${
              this.grades[range[range.length - 1]].text
            }`
          )
          break
      }
    }

    return chips
  }

  async onSubmit() {
    // Type asserted as this is not multi-file upload.
    const url = (await this.$accessor.files.filesToURL(this.files)) as
      | string
      | null

    if (this.$accessor.files.error) {
      console.error(this.$accessor.files.error)
    }

    const createEventDto: CreateEventDto = Object.assign(
      {
        dtend: toDate(
          this.dates.end.date,
          this.dates.allday ? '23:59' : this.times.end.time
        ),
        rrule: this.rrule || undefined,
        project: this.project || undefined,
        course: this.course || undefined,
        ...this.meta,
      },
      !this.rrule && {
        dtstart: toDate(this.dates.start.date, this.times.start.time),
      },
      url && { picture: url }
    )

    await this.$accessor.events.create(createEventDto)

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
</style>
