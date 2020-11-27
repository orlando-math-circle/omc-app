<template>
  <div>
    <v-row no-gutters class="mb-6">
      <v-col>
        <v-row>
          <v-col>
            <h1>Edit Event — {{ event.name }}</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pt-0">
            <breadcrumbs class="pa-0" :items="breadcrumbs" large></breadcrumbs>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Edit Event</v-card-title>

          <v-form-validated>
            <v-card-text>
              <v-row>
                <!-- Title -->
                <v-col cols="12">
                  <v-text-field-validated
                    v-model="meta.name"
                    label="Title"
                    hide-details="auto"
                    name="name"
                    rules="required"
                    outlined
                  ></v-text-field-validated>
                </v-col>

                <!-- Date-Times -->
                <v-col cols="8">
                  <v-menu v-model="dates.start.menu" offset-y min-width="290px">
                    <template #activator="{ on, attrs }">
                      <v-text-field-validated
                        :value="format(dates.start.date)"
                        label="Start Date"
                        hide-details="auto"
                        vid="startdate"
                        :rules="{
                          required: true,
                          startdate: { target: '@enddate' },
                        }"
                        outlined
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>

                    <v-date-picker
                      v-model="dates.start.date"
                      @input="dates.start.menu = false"
                    />
                  </v-menu>
                </v-col>

                <v-col cols="4">
                  <time-picker
                    v-model="times.start.time"
                    vid="starttime"
                    :rules="{
                      required: true,
                      starttime: !isSameDay(dates.start.date, dates.end.date)
                        ? false
                        : { time: '@endtime' },
                    }"
                    label="Start Time"
                    outlined
                  ></time-picker>
                </v-col>

                <v-col cols="8">
                  <v-menu v-model="dates.end.menu" offset-y min-width="290px">
                    <template #activator="{ on, attrs }">
                      <v-text-field-validated
                        :value="format(dates.end.date)"
                        rules="required"
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

                <v-col cols="4">
                  <time-picker
                    v-model="times.end.time"
                    vid="endtime"
                    label="End Time"
                    outlined
                  ></time-picker>
                </v-col>

                <!-- Permissions -->
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
                    v-model="meta.permissions.sexes"
                    :items="sexes"
                    label="Sex"
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

                <!-- Recurrence -->
                <v-col>
                  <recurrence-dialog
                    v-model="rrule"
                    :date-string="dates.start.date"
                  />
                </v-col>

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

                <v-col cols="12">
                  <v-textarea
                    v-model="meta.description"
                    label="Description"
                    rows="1"
                    auto-grow
                    hide-details="auto"
                    outlined
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-row>
                    <v-col>
                      <auto-complete-project v-model="project" outlined />
                    </v-col>
                    <v-col cols="auto" class="align-self-center">
                      <dialog-select-project v-model="project" />
                    </v-col>
                    <v-col cols="auto" class="align-self-center">
                      <dialog-create-project
                        @create:project="onProjectCreated"
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-row>
                    <v-col>
                      <auto-complete-course
                        v-model="course"
                        :project="project"
                        outlined
                      />
                    </v-col>

                    <v-col cols="auto" class="align-self-center">
                      <dialog-select-course
                        v-model="course"
                        :project="project"
                      />
                    </v-col>

                    <v-col cols="auto" class="align-self-center">
                      <dialog-create-course
                        :project="project"
                        @create:course="onCourseCreated"
                      />
                    </v-col>
                  </v-row>
                </v-col>

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

              <v-row>
                <v-col cols="8">
                  <file-upload
                    v-model="file"
                    outlined
                    label="Picture (Optional)"
                    hint="Project pictures will be used as a fallback if provided."
                    persistent-hint
                  />
                </v-col>

                <v-col cols="4">
                  <div class="d-flex">
                    <h3>Image Preview</h3>
                  </div>
                  <v-img
                    :src="background"
                    class="rounded"
                    max-height="200"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-slide-x-transition>
                <v-btn
                  v-show="Object.keys(changes).length"
                  text
                  @click="onReset"
                >
                  Reset
                </v-btn>
              </v-slide-x-transition>

              <v-btn
                :disabled="!Object.keys(changes).length"
                :loading="$accessor.users.isLoading"
                color="primary"
                @click="onSubmit"
              >
                Save Changes
              </v-btn>
            </v-card-actions>
          </v-form-validated>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { format, isSameDay } from 'date-fns'
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import RRule, { Options, RRuleSet, rrulestr } from 'rrule'
import {
  contiguousGradeRanges,
  gradeGroups,
  grades,
} from '../../../../utils/events'
import { isValidDate, shallowDiff } from '../../../../utils/utilities'
import { EventTimeThreshold } from '../../../../../backend/src/event/enums/event-time-threshold.enum'
import { Grade } from '../../../../../backend/src/user/enums/grade.enum'
import { Sex } from '../../../../../backend/src/user/enums/sex.enum'
import { FeeType } from '../../../../../backend/src/event/enums/fee-type.enum'
import { Project } from '../../../../../backend/src/project/project.entity'
import { Course } from '../../../../../backend/src/course/course.entity'
import { UpdateEventDto } from '../../../../../backend/src/event/dto/update-event.dto'
// import { EventRecurrenceDto } from '../../../../../backend/src/event/dto/event-recurrence.dto'
import { DTO } from '../../../../interfaces/date-to-string.interface'
import { toDate } from '~/utils/utilities'
import { DTOEvent } from '~/store/events'

@Component({
  head: {
    title: 'Edit Event',
  },
  fetch({ app: { $accessor }, route }) {
    $accessor.events.findOne(route.params.id)
  },
})
export default class AdminEventEditPage extends Vue {
  breadcrumbs = [
    {
      text: 'Dashboard',
      href: '/admin/',
    },
    {
      text: 'Events',
      href: '/admin/calendar/events',
    },
    {
      text: 'Edit Event',
    },
  ]

  internalData: DTOEvent | null = null
  file: null | File | string = null
  grades = grades

  dates = {
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

  timeThresholds = [
    { text: 'Never', value: EventTimeThreshold.NEVER },
    { text: 'After Event Ends', value: EventTimeThreshold.AFTER_END },
    { text: 'After Event Starts', value: EventTimeThreshold.AFTER_START },
    { text: 'Minutes From Start', value: EventTimeThreshold.OFFSET_START },
    { text: 'Minutes From End', value: EventTimeThreshold.OFFSET_END },
  ]

  feeType = FeeType.FREE
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
    location: '',
    locationTitle: '',
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
      sexes: [Sex.MALE, Sex.FEMALE],
    },
  }

  rrule = null as Partial<Options> | null
  rruleOrSet = null as RRuleSet | RRule | null
  project = null as number | null
  course = null as number | null

  get event(): DTOEvent {
    return this.internalData!
  }

  set event(value: DTOEvent) {
    this.internalData = value
  }

  get eventRef() {
    return this.$accessor.events.event!
  }

  get gradeGroups() {
    return gradeGroups(contiguousGradeRanges(this.meta.permissions.grades))
  }

  get background() {
    const url = this.event.picture

    if (url.startsWith('http')) return url

    return `${this.$config.staticBase}${url}`
  }

  get changes(): DTO<UpdateEventDto> {
    const old = { ...this.eventRef, rrule: this.getRRuleOptions(this.eventRef) }

    const dto: DTO<UpdateEventDto> = {
      name: this.meta.name,
      description: this.meta.description,
      location: this.meta.location,
      locationTitle: this.meta.locationTitle,
      permissions: this.meta.permissions,
      cutoffThreshold: this.meta.cutoffThreshold,
      cutoffOffset: this.meta.cutoffOffset,
      lateThreshold: this.meta.lateThreshold,
      lateOffset: this.meta.lateOffset,
      // picture: this.file || undefined
    }

    // Recurrence Rule
    if (this.rrule) {
      dto.rrule = this.rrule as any
    } else {
      dto.dtstart = toDate(
        this.dates.start.date,
        this.times.start.time
      ).toISOString()!
    }

    // Project
    if ((this.project || null) !== (old.project?.id || null)) {
      dto.project = this.project
    }

    // Course
    if ((this.course || null) !== (old.course?.id || null)) {
      dto.course = this.course
    }

    const diff = shallowDiff(old, dto)

    console.info('Difference: ', Object.keys(diff).length ? diff : 'No changes')

    if (Object.keys(diff).length) {
      console.log(old, dto)
    }

    return dto
  }

  @Watch('eventRef', { immediate: true })
  onEventUpdate(event: DTOEvent) {
    this.event = Object.assign({}, event)
    const start = new Date(this.event.dtstart)
    const end = new Date(this.event.dtend)

    // Copy event date data.
    this.dates.start.date = format(start, 'yyyy-MM-dd')
    this.times.start.time = format(start, 'HH:mm')
    this.dates.end.date = format(end, 'yyyy-MM-dd')
    this.times.end.time = format(end, 'HH:mm')

    // Copy event metadata
    this.meta.name = this.event.name
    this.meta.description = this.event.description || ''
    this.meta.location = this.event.location || ''
    this.meta.locationTitle = this.event.locationTitle
    this.meta.cutoffThreshold = this.event.cutoffThreshold
    this.meta.cutoffOffset = this.event.cutoffOffset
    this.meta.lateThreshold = this.event.lateThreshold
    this.meta.lateOffset = this.event.lateOffset
    this.meta.permissions.grades = this.event.permissions?.grades || []
    this.meta.permissions.sexes = this.event.permissions?.sexes || []

    // Picture url
    if (this.event.picture) {
      this.file = this.event.picture
    }

    // Copy event fee
    const fee = this.event.fee || this.event.course?.fee
    if (fee) {
      this.fee.amount = +fee.amount
      this.fee.lateAmount = fee.lateAmount ? +fee.lateAmount : 0
    }

    // Serialize RRule string to object
    this.rrule = this.getRRuleOptions(this.event)

    this.project = this.event?.project?.id || 0
    this.course = this.event?.course?.id || 0
  }

  getRRuleOptions(event: DTOEvent) {
    if (!event.recurrence) return null

    let options: Partial<Options>

    const rrule = rrulestr(event.recurrence.rrule)

    if (rrule instanceof RRuleSet) {
      options = rrule.rrules()[0].origOptions
    } else {
      options = rrule.origOptions
    }

    return this.cleanRRule(options)
  }

  cleanRRule(object: Record<string, any>) {
    for (const prop in object) {
      if (object[prop] === undefined) {
        delete object[prop]
      } else if (object[prop] instanceof Date) {
        object[prop] = object[prop].toISOString()
      }
    }

    return object
  }

  format(dateString: string) {
    if (dateString === '') return 'Select a Date'

    const [year, month, day] = dateString.split('-')
    const date = new Date(+year, +month - 1, +day)

    if (!isValidDate(date)) return 'Invalid Date'

    return format(date, 'EEE, LLL d, yyyy')
  }

  isSameDay(dateA: string, dateB: string) {
    return isSameDay(new Date(dateA), new Date(dateB))
  }

  onProjectCreated(project: Project) {
    this.project = project.id
  }

  onCourseCreated(course: Course) {
    this.course = course.id
  }

  async onReset() {
    await this.$accessor.events.findOne(this.$route.params.id)
  }

  async onSubmit() {
    await console.log('Submitting')
  }
}
</script>
