<template>
  <dialog-form ref="refDialog" @submit:form="onSubmit">
    <template #title>Edit Event</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">Edit Event</v-btn>
      </slot>
    </template>

    <v-card-text>
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
              vid="name"
              rules="required"
              outlined
            />
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- All-Day Selector -->
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-clock-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>All-day</v-list-item-content>

          <v-list-item-action>
            <v-switch v-model="dates.allday" color="secondary" />
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
                  v-model="meta.project"
                  item-value="id"
                  outlined
                />
              </v-col>
              <v-col cols="auto" class="align-self-center">
                <dialog-select-project v-model="meta.project" />
              </v-col>
              <v-col cols="auto" class="align-self-center">
                <dialog-select-project @create:project="onProjectCreated" />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <!-- Course Management -->
        <v-list-item v-if="meta.project" class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-school-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col>
                <auto-complete-course
                  v-model="meta.course"
                  :project="meta.project"
                  item-value="id"
                  outlined
                />
              </v-col>

              <v-col cols="auto" class="align-self-center">
                <dialog-select-course
                  v-model="meta.course"
                  :project="meta.project"
                  item-value="id"
                />
              </v-col>

              <v-col cols="auto" class="align-self-center">
                <dialog-create-course
                  :project="meta.project"
                  @create:course="onCourseCreated"
                />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="meta.project" />

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
                  :rules="{
                    required: true,
                    has_course: { course: meta.course },
                  }"
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
              v-model="meta.picture"
              outlined
              label="Picture (Optional)"
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
      <v-spacer></v-spacer>

      <v-slide-x-transition>
        <v-btn v-show="Object.keys(changeset).length" text @click="onReset">
          Reset
        </v-btn>
      </v-slide-x-transition>

      <v-btn
        :disabled="!Object.keys(changeset).length"
        :loading="$accessor.events.isLoading"
        color="primary"
        type="submit"
      >
        Save Changes
      </v-btn>
    </v-card-actions>

    <dialog-update-event-type
      ref="typeDialog"
      :changeset="changeset"
      @submit:type="onSubmitType"
    />
  </dialog-form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'nuxt-property-decorator'
import { Event } from '@omc/server/event/event.entity'
import { format, isSameDay } from 'date-fns'
import RRule, { Frequency, Options, RRuleSet, rrulestr } from 'rrule'
import { FeeType } from '@omc/server/event/enums/fee-type.enum'
import { EventTimeThreshold } from '@omc/server/event/enums/event-time-threshold.enum'
import { Grade } from '@omc/server/user/enums/grade.enum'
import { UpdateEventsDto } from '@omc/server/event/dto/update-events.dto'
import { UpdateEventDto } from '@omc/server/event/dto/update-event.dto'
import { Project } from '@omc/server/project/project.entity'
import { Course } from '@omc/server/course/course.entity'
import { Gender } from '@omc/server/user/enums/gender.enum'
import { EventRecurrenceDto } from '@omc/server//event/dto/event-recurrence.dto'
import { File as FileEntity } from '@omc/server/file/file.entity'
import { CreateEventFeeDto } from '@omc/server/event-fee/dto/create-event-fee.dto'
import DialogUpdateEventType from './UpdateEventType.vue'
import DialogForm from './Form.vue'
import { isValidDate, shallowDiff, toDate } from '~/utils/utilities'
import { DTOEvent } from '~/store/events'
import {
  AddFile,
  EventUpdateModesAndFile,
} from '~/types/events/event-update-modes.interface'
import { RRuleOptions } from '~/types/events/event-recurrence.interface'
import { genders } from '~/utils/constants'
import { contiguousGradeRanges, gradeGroups, grades } from '~/utils/events'
import { DTO } from '~/types/date-to-string.interface'

@Component
export default class DialogUpdateEvent extends Vue {
  @Ref('refDialog') readonly dialog!: DialogForm
  @Ref('typeDialog') readonly typeDialog!: DialogUpdateEventType
  @Prop() event!: Event

  internalData: DTOEvent | null = null
  grades = grades
  genders = genders
  colorMenu = false
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

  timeThresholds = [
    { text: 'Never', value: EventTimeThreshold.NEVER },
    { text: 'After Event Ends', value: EventTimeThreshold.AFTER_END },
    { text: 'After Event Starts', value: EventTimeThreshold.AFTER_START },
    { text: 'Minutes From Start', value: EventTimeThreshold.OFFSET_START },
    { text: 'Minutes From End', value: EventTimeThreshold.OFFSET_END },
  ]

  fee = {
    amount: null as number | null,
    lateAmount: null as number | null,
  }

  feeType = FeeType.FREE
  feeTypes = [
    { text: 'Free', value: FeeType.FREE },
    { text: 'Pay Per Event', value: FeeType.EVENT },
    { text: 'Pay Per Course', value: FeeType.COURSE },
  ]

  meta = {
    name: '',
    description: '',
    location: '',
    color: '',
    locationTitle: '',
    picture: '' as File | string,
    cutoffThreshold: EventTimeThreshold.AFTER_END,
    cutoffOffset: 0,
    lateThreshold: EventTimeThreshold.AFTER_START,
    lateOffset: 0,
    project: null as number | null,
    course: null as number | null,
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

  rrule: DTO<EventRecurrenceDto> | null = null
  rruleOrSet: RRuleSet | RRule | null = null
  originalRRule: null | DTO<EventRecurrenceDto> = null

  get intEvent(): DTOEvent {
    return this.internalData!
  }

  set intEvent(value: DTOEvent) {
    this.internalData = value
  }

  get isLoading() {
    return this.$accessor.events.isLoading
  }

  get error() {
    if (this.$accessor.events.isErrored) {
      return this.$accessor.events.error!
    } else if (this.$accessor.files.isErrored) {
      return this.$accessor.files.error!
    }

    return false
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

  get gradeGroups() {
    return gradeGroups(contiguousGradeRanges(this.meta.permissions.grades))
  }

  get feeDTO(): CreateEventFeeDto {
    return {
      amount: (this.fee.amount || 0).toPrecision(2),
      lateAmount: (this.fee.lateAmount || 0).toPrecision(2),
    }
  }

  get eventFeeType() {
    if (this.event.fee) {
      return FeeType.EVENT
    } else if (this.event.course?.fee) {
      return FeeType.COURSE
    }

    return FeeType.FREE
  }

  /**
   * Determines the meta changes made to an event.
   */
  get metaChanges() {
    const dto: DTO<UpdateEventDto> = {
      name: this.meta.name,
      description: this.meta.description || null,
      color: this.meta.color,
      picture: this.meta.picture as any, // No ideal way to make it like Files
      location: this.meta.location || null,
      locationTitle: this.meta.locationTitle,
      permissions: this.meta.permissions,
      cutoffThreshold: this.meta.cutoffThreshold,
      cutoffOffset: this.meta.cutoffOffset,
      lateThreshold: this.meta.lateThreshold,
      lateOffset: this.meta.lateOffset,
    }

    if (this.dates.allday) {
      dto.dtstart = toDate(this.dates.start.date, '00:00').toISOString()
      dto.dtend = toDate(this.dates.start.date, '23:59').toISOString()
    } else {
      dto.dtstart = toDate(
        this.dates.start.date,
        this.times.start.time
      ).toISOString()
      dto.dtend = toDate(this.dates.end.date, this.times.end.time).toISOString()
    }

    // Project
    if ((this.meta.project || null) !== (this.event.project?.id || null)) {
      dto.project = this.meta.project
    }

    // Course
    if ((this.meta.course || null) !== (this.event.course?.id || null)) {
      dto.course = this.meta.course
    }

    return shallowDiff(this.event, dto)
  }

  /**
   * Mastermind that determines the appropriate update actions
   * based on changes made to the event metadata, dates, or rrule.
   */
  get changeset(): EventUpdateModesAndFile {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dtstart, ...rule } = this.rruleChanges
    const rruleOptsChanged = Object.keys(rule).length !== 0
    const changedStart = this.metaChanges.dtstart
    const meta: AddFile<DTO<UpdateEventDto>> = {
      ...this.meta,
      dtend: this.metaChanges.dtend,
    }
    const rrule = this.rrule!

    // If the fee type of values have changed, replace the fee.
    const origFee = this.event.fee || this.event.course?.fee
    const feeTypeChanged = this.eventFeeType !== this.feeType
    if (
      feeTypeChanged ||
      (origFee &&
        (origFee.amount !== this.feeDTO.amount ||
          origFee.lateAmount !== this.feeDTO.lateAmount))
    ) {
      meta.fee = this.feeDTO
      meta.feeType = this.feeType
    }

    // Changing the date of an event eliminates the "all" option, and
    // changing the rrule options eliminates "single", so force a future update.
    if (rruleOptsChanged && changedStart) {
      return {
        future: Object.assign({}, meta, { rrule }),
      }
    }

    // If the rrule options where changed this re-writes the rrule.
    // Since the rrule is now different, single-event updates are not allowed.
    if (rruleOptsChanged) {
      return {
        future: Object.assign({}, meta, { rrule }),
        all: Object.assign({}, meta, {
          rrule: {
            ...rrule,
            dtstart: this.originalRRule?.dtstart || this.event.dtstart,
          },
        }),
      }
    }

    // Changing just the dtstart of the event eliminates the "all" option.
    if (changedStart) {
      return {
        single: Object.assign({}, meta, {
          dtstart: this.metaChanges.dtstart,
        }),
        future: Object.assign({}, meta, {
          rrule: { ...rrule, dtstart: changedStart },
        }),
      }
    }

    if (!Object.keys(meta).length) return {}

    return {
      single: meta,
      future: meta,
      all: meta,
    }
  }

  isSameDay(dateA: string, dateB: string) {
    return isSameDay(new Date(dateA), new Date(dateB))
  }

  /**
   * @returns The properties in the rrule that have been modified.
   */
  get rruleChanges() {
    if (!this.rrule || !this.originalRRule) return {}

    return shallowDiff(this.originalRRule, this.rrule)
  }

  /**
   * If the project is removed then the course should be too.
   * This could actually be changed with some minor backend tweaks
   * due to a late refactoring of how payments work.
   */
  @Watch('meta.project')
  onProjectChange(project: number | null) {
    if (project === null) {
      this.meta.course = null
    }
  }

  /**
   * Transforms the interpreted event data into the data required
   * for editing the events or events.
   */
  @Watch('event', { immediate: true, deep: true })
  onEventUpdate(event: DTOEvent) {
    this.intEvent = Object.assign({}, event)
    const start = new Date(this.intEvent.dtstart)
    const end = new Date(this.intEvent.dtend)

    // Copy event date data.
    this.dates.start.date = format(start, 'yyyy-MM-dd')
    this.times.start.time = format(start, 'HH:mm')
    this.dates.end.date = format(end, 'yyyy-MM-dd')
    this.times.end.time = format(end, 'HH:mm')

    // Copy event metadata
    this.meta.name = this.intEvent.name
    this.meta.description = this.intEvent.description || ''
    this.meta.location = this.intEvent.location || ''
    this.meta.color = this.intEvent.color || '#000000'
    this.meta.locationTitle = this.intEvent.locationTitle
    this.meta.cutoffThreshold = this.intEvent.cutoffThreshold
    this.meta.cutoffOffset = this.intEvent.cutoffOffset
    this.meta.lateThreshold = this.intEvent.lateThreshold
    this.meta.lateOffset = this.intEvent.lateOffset
    this.meta.permissions.grades = this.intEvent.permissions?.grades || []
    this.meta.permissions.genders = this.intEvent.permissions?.genders || []
    this.meta.project = this.intEvent.project?.id || null
    this.meta.course = this.intEvent.course?.id || null
    this.meta.picture = this.intEvent.picture

    // Event Fee
    if (this.intEvent.fee) {
      const fee = this.intEvent.fee

      this.feeType = FeeType.EVENT
      this.fee.amount = +fee.amount
      this.fee.lateAmount = fee.lateAmount ? +fee.lateAmount : 0
    } else if (this.intEvent.course?.fee) {
      const fee = this.intEvent.course.fee

      this.feeType = FeeType.COURSE
      this.fee.amount = +fee.amount
      this.fee.lateAmount = fee.lateAmount ? +fee.lateAmount : 0
    } else {
      this.feeType = FeeType.FREE
    }

    // Serialize RRule string to object
    this.rrule = this.getRRuleOptions(this.intEvent)
    this.originalRRule = Object.assign({}, this.rrule)
  }

  /**
   * Hydrates an rrule from a string into its dto options form
   */
  getRRuleOptions(event: DTOEvent) {
    if (!event.recurrence) return null

    let options: Partial<Options>

    const rrule = rrulestr(event.recurrence.rrule)

    if (rrule instanceof RRuleSet) {
      options = rrule.rrules()[0].origOptions
    } else {
      options = rrule.origOptions
    }

    return (this.cleanRRule(options) as unknown) as DTO<EventRecurrenceDto>
  }

  /**
   * Removes undefined properties from the rrule object
   * and converts any dates into ISO strings.
   */
  cleanRRule(object: RRuleOptions) {
    for (const prop in object) {
      if (object[prop] === undefined) {
        delete object[prop]
      } else if (object[prop] instanceof Date) {
        object[prop] = object[prop].toISOString()
      }
    }

    return (object as unknown) as EventRecurrenceDto
  }

  /**
   * Consumes a hydrated RRule and rebuilds the options
   * structure while removing any superflous properties.
   *
   * This is done for diffing purposes.
   */
  parseRRule(options: Partial<Options>) {
    const retval: Partial<Options> = {
      freq: options.freq,
      dtstart: options.dtstart,
    }

    switch (options.freq) {
      case Frequency.WEEKLY:
        if (options.byweekday) {
          retval.byweekday = options.byweekday
        }
        break
      case Frequency.MONTHLY:
        // Absolute month day.
        if (options.bymonthday) {
          retval.bymonthday = options.bymonthday
          // Relative month weekday.
        } else if (options.bysetpos) {
          retval.bysetpos = options.bysetpos
          retval.byweekday = options.byweekday
        }
        break
    }

    if (options.interval && options.interval !== 1) {
      retval.interval = options.interval
    }

    // Sets the terminating condition.
    if (options.until) {
      retval.until = options.until
    } else if (options.count) {
      retval.count = options.count
    }

    return retval
  }

  format(dateString: string) {
    if (dateString === '') return 'Select a Date'

    const [year, month, day] = dateString.split('-')
    const date = new Date(+year, +month - 1, +day)

    if (!isValidDate(date)) return 'Invalid Date'

    return format(date, 'EEE, LLL d, yyyy')
  }

  onProjectCreated(project: Project) {
    this.meta.project = project.id
  }

  onCourseCreated(course: Course) {
    this.meta.course = course.id
  }

  /**
   * Resetting causes the event being looked into to be refreshed.
   * This must be handled by the parent component.
   */
  onReset() {
    this.$emit('event:refresh', this.$route.params.id)
  }

  /**
   * The "save changes" button was pushed and the form has no errors.
   */
  async onSubmit() {
    if (this.meta.picture instanceof File) {
      const file = (await this.$accessor.files.uploadFile(
        this.meta.picture
      )) as FileEntity

      if (this.error) {
        return this.$accessor.snackbar.show({ text: this.error.message })
      }

      this.meta.picture = file.root
    }

    // Let the computed properties update.
    await this.$nextTick()

    const numChangesets = Object.keys(this.changeset).length

    if (numChangesets > 1) {
      return this.typeDialog.open()
    }

    if (this.changeset.future) {
      // If we got here we removed any files.
      await this.update('future', this.changeset.future as DTO<UpdateEventsDto>)
    }
  }

  /**
   * Callback method for the update event type popup.
   */
  async onSubmitType(
    type: 'single' | 'future' | 'all',
    changeset: DTO<UpdateEventDto> | DTO<UpdateEventsDto>
  ) {
    await this.update(type, changeset)
  }

  /**
   * Submits the changes for an event update.
   */
  async update(
    type: 'single' | 'future' | 'all',
    changeset: DTO<UpdateEventDto> | DTO<UpdateEventsDto>
  ) {
    await this.$accessor.events.update({
      id: this.$route.params.id,
      dto: changeset,
      type,
    })

    if (this.error) {
      this.$accessor.snackbar.show({
        text: this.error.message,
      })
    } else {
      this.$emit('event:update', this.$route.params.id)
      this.$accessor.snackbar.show({
        text: 'Event successfully updated',
      })
      this.dialog.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.preview {
  text-shadow: 0 0 0 #000;
  height: 100%;
  font-weight: 700;
  font-size: 1.3rem;
}

.shrink-append {
  ::v-deep .v-input__append-inner {
    margin-top: 8px !important;
  }
}
</style>
