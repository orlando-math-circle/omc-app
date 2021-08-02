<template>
  <DialogForm ref="dialog" expands @form:submit="onSubmit">
    <template #title>Create Event</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">Add Event</v-btn>
      </slot>
    </template>

    <v-card-text>
      <AlertError v-if="error" class="mx-4" :error="error" />

      <v-list dense>
        <!-- Name -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon>mdi-text</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <VTextFieldValidated
              v-model="meta.name"
              label="Title"
              hide-details="auto"
              vid="title"
              rules="required"
              outlined
            />
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
            <v-switch v-model="dates.allday" color="secondary" />
          </v-list-item-action>
        </v-list-item>

        <!-- Dates and Times -->
        <v-list-item class="pl-2">
          <v-list-item-avatar class="mr-2" />

          <v-list-item-content>
            <v-row wrap>
              <v-col :cols="dates.allday ? 12 : 8">
                <v-menu offset-y min-width="290px">
                  <template #activator="{ on, attrs }">
                    <!-- TODO: Investigate why using VTextFieldValidated
                    causes the menu to not render properly -->
                    <VTextFieldValidated
                      :value="format(dates.start.date)"
                      :label="dates.allday ? 'Date' : 'Start Date'"
                      :rules="{
                        required: true,
                        startdate: dates.allday
                          ? false
                          : { target: '@enddate' },
                      }"
                      vid="startdate"
                      hide-details="auto"
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>

                  <v-date-picker v-model="dates.start.date" />
                </v-menu>
              </v-col>

              <v-col v-show="!dates.allday" cols="4">
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

              <v-col v-show="!dates.allday" cols="8">
                <v-menu offset-y min-width="290px">
                  <template #activator="{ on, attrs }">
                    <VTextFieldValidated
                      :value="format(dates.end.date)"
                      :rules="{ required: !dates.allday }"
                      vid="enddate"
                      readonly
                      hide-details="auto"
                      label="End Date"
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>

                  <v-date-picker v-model="dates.end.date" />
                </v-menu>
              </v-col>

              <v-col v-show="!dates.allday" cols="4">
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
          <v-list-item-content>Members Only</v-list-item-content>
          <v-list-item-action>
            <v-switch v-model="meta.permissions.membershipStatus" color="secondary" />
          </v-list-item-action>
        </v-list-item>
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
                <VTextFieldValidated
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
                <VTextFieldValidated
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
                <VComboboxValidated
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
                />
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
                <VAutocompleteValidated
                  v-model="project"
                  :items="projectStore.projects"
                  :loading="projectStore.isLoading"
                  label="Project (Optional)"
                  hide-details="auto"
                  item-value="id"
                  item-text="name"
                  clearable
                  outlined
                  debounce
                  @search="projectStore.findAll()"
                />
              </v-col>

              <v-col cols="auto" class="align-self-center">
                <DialogSelectProject v-model="project" />
              </v-col>

              <v-col cols="auto" class="align-self-center">
                <DialogCreateProject
                  @create:project="(proj) => (project = proj.id)"
                />
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
                <VAutoCompleteValidated
                  v-model="course"
                  label="Course"
                  item-text="name"
                  item-value="id"
                  placeholder="Search for a course"
                  @search="onCourseSearch"
                />
                <AutoCompleteCourse
                  v-model="course"
                  item-value="id"
                  :project="project"
                  outlined
                />
              </v-col>

              <v-col cols="auto" class="align-self-center">
                <DialogSelectCourse v-model="course" :project="project" />
              </v-col>

              <v-col cols="auto" class="align-self-center">
                <DialogCreateCourse
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
                <VSelectValidated
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
                  <VTextFieldValidated
                    v-model.number="fee.amount"
                    rules="required"
                    label="Event Fee"
                    type="number"
                    hide-details="auto"
                    outlined
                  />
                </v-col>

                <v-col cols="6">
                  <VTextFieldValidated
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
            <FileUpload
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
            <VTextFieldValidated
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
                    <div :style="swatch" v-on="on" />
                  </template>

                  <v-card>
                    <v-card-text class="pa-0">
                      <v-color-picker v-model="meta.color" flat />
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </VTextFieldValidated>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>

    <template #actions>
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
    </template>
  </DialogForm>
</template>

<script lang="ts">
import { addDays, format, isBefore, parse, parseISO } from 'date-fns'
import { Options } from 'rrule'
import { Course } from '@server/course/course.entity'
import { Grade } from '@server/user/enums/grade.enum'
import { FeeType } from '@server/event/enums/fee-type.enum'
import { Gender } from '@server/user/enums/gender.enum'
import { EventTimeThreshold } from '@server/event/enums/event-time-threshold.enum'
import { gradeGroups, contiguousGradeRanges, grades } from '@/utils/events'
import { genders } from '@/utils/constants'
import { EventRecurrenceDto } from '@/types/events/event-recurrence.interface'
import { addTime, isValidDate, roundDate, toDate } from '@/utils/utilities'
import Calendar from '@/components/Calendar.vue'
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  onBeforeMount,
} from '@nuxtjs/composition-api'
import { useEvents, useFiles, useProjects } from '@/stores'
import { useSnackbar, useDates, useTemplateRef } from '@/composables'
import RecurrenceDialog from '@/components/dialog/Recurrence.vue'
import DialogForm from '@/components/dialog/Form.vue'

export type RRuleOptions = Partial<Options>

export type RepeatingTypes = {
  label: string
  rrule?: RRuleOptions
}

export type DialogComponent = InstanceType<typeof DialogForm>

const timeThresholds = [
  { text: 'Never', value: EventTimeThreshold.NEVER },
  { text: 'After Event Ends', value: EventTimeThreshold.AFTER_END },
  { text: 'After Event Starts', value: EventTimeThreshold.AFTER_START },
  { text: 'Minutes From Start', value: EventTimeThreshold.OFFSET_START },
  { text: 'Minutes From End', value: EventTimeThreshold.OFFSET_END },
]

const feeTypes = [
  { text: 'Free', value: FeeType.FREE },
  { text: 'Pay Per Event', value: FeeType.EVENT },
  { text: 'Pay Per Course', value: FeeType.COURSE },
]

export default defineComponent({
  props: {
    date: {
      type: String,
      default: () => new Date().toISOString().substring(0, 10),
    },
    time: {
      type: String,
      default: () => format(roundDate(new Date(), 30), 'HH:mm'),
    },
  },
  setup(props, { emit }) {
    const refs = {
      recurrenceDialog: ref<InstanceType<typeof RecurrenceDialog>>(),
      calendar: ref<InstanceType<typeof Calendar>>(),
      dialog: useTemplateRef<DialogComponent>('dialog'),
    }

    const state = reactive({
      success: false,
      colorMenu: false,
      dates: {
        allday: false,
        start: {
          menu: false,
          date: '',
        },
        end: {
          menu: false,
          date: '',
        },
      },
      times: {
        start: {
          menu: false,
          time: '',
        },
        end: {
          menu: false,
          time: '',
        },
        times: [] as string[],
      },
      rrule: null as EventRecurrenceDto | null,
      feeType: FeeType.FREE,
      fee: {
        amount: 0,
        lateAmount: 0,
      },
      meta: {
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
          membershipStatus:false
        },
      },
      project: null as number | null,
      course: null as number | null,
      files: null as File | null,
    })

    const eventStore = useEvents()
    const fileStore = useFiles()
    const snackbar = useSnackbar()
    const dateUtils = useDates()
    const projectStore = useProjects()

    const error = computed(() => eventStore.error || fileStore.error)
    const isLoading = computed(() => eventStore.isLoading)
    const intGradeGroups = computed(() =>
      gradeGroups(contiguousGradeRanges(state.meta.permissions.grades))
    )
    const swatch = computed(() => ({
      height: '40px',
      width: '40px',
      backgroundColor: state.meta.color,
      cursor: 'pointer',
      borderRadius: state.colorMenu ? '50%' : '4px',
      transition: 'border-radius 200ms ease-in-out',
    }))

    onBeforeMount(() => {
      const now = new Date()
      state.dates.start.date = props.date
      state.dates.end.date = props.date
      state.times.start.time = props.time
      state.times.end.time = addTime(props.time, 1, 30)

      // If the end time loops around to being before
      // the starting time, increment the day.
      if (
        isBefore(
          parse(state.times.end.time, 'HH:mm', now),
          parse(state.times.start.time, 'HH:mm', now)
        )
      ) {
        state.dates.end.date = addDays(parseISO(props.date), 1)
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

      state.times.times = times
    })

    const isSameDay = (dateA: string, dateB: string): boolean =>
      dateUtils.isSameDay(new Date(dateA), new Date(dateB))

    const format = (dateString: string) => {
      if (dateString === '') return 'Select a Date'

      const [year, month, day] = dateString.split('-')
      const date = new Date(+year, +month - 1, +day)

      if (!isValidDate(date)) return 'Invalid Date'

      return dateUtils.format(date, 'EEE, LLL d, yyyy')
    }

    const onSubmit = async () => {
      let file = null

      if (state.files) {
        file = await fileStore.create(state.files!)

        if (fileStore.error) {
          snackbar.error(fileStore.error.message)
        }
      }

      const dto = Object.assign(
        {
          rrule: state.rrule || undefined,
          project: state.project || undefined,
          course: state.course || undefined,
          ...state.meta,
        },
        state.dates.allday
          ? { dtend: toDate(state.dates.start.date, '23:59').toISOString() }
          : {
              dtend: toDate(
                state.dates.end.date,
                state.times.end.time
              ).toISOString(),
            },
        !state.rrule && {
          dtstart: toDate(
            state.dates.start.date,
            state.times.start.time
          ).toISOString(),
        },
        state.feeType !== 'free' && {
          feeType: state.feeType,
          fee: {
            amount: state.fee.amount.toFixed(2),
            lateAmount: state.fee.lateAmount?.toFixed(2),
          },
        },
        file && { picture: file.root }
      )

      if (state.dates.allday) {
        // Incomplete, allday is not accurate
      }

      await eventStore.create(dto)

      if (eventStore.error) {
        snackbar.error(eventStore.error.message)
      } else {
        emit('event:create')

        state.success = true
        refs.dialog.value!.close(1500)
      }
    }

    const onCourseCreated = (course: Course) => {
      state.course = course.id
    }

    return {
      ...refs,
      ...toRefs(state),
      grades,
      genders,
      timeThresholds,
      projectStore,
      error,
      isLoading,
      feeTypes,
      gradeGroups: intGradeGroups,
      swatch,
      isSameDay,
      format,
      onSubmit,
      onCourseCreated,
    }
  },
})
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
