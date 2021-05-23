<template>
  <FormDialog ref="dialogRef" @form:submit="onSubmit">
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

              <v-col :cols="meta.cutoffThreshold.includes('offset') ? 8 : 12">
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
                <VAutocompleteValidated
                  v-model="meta.project"
                  :items="projectStore.projects"
                  :loading="projectStore.isLoading"
                  label="Project (Optional)"
                  item-value="id"
                  item-text="name"
                  hide-details="auto"
                  clearable
                  debounce
                  outlined
                  @search="projectStore.findAll()"
                />
              </v-col>
              <v-col cols="auto" class="align-self-center">
                <dialog-select-project v-model="meta.project" />
              </v-col>
              <v-col cols="auto" class="align-self-center">
                <DialogSelectProject
                  @create:project="(project) => (meta.project = project.id)"
                />
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
                <DialogCreateCourse
                  :project="meta.project"
                  @create:course="(course) => (meta.course = course.id)"
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
            <FileUpload
              v-model="upload"
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
      <v-spacer />

      <v-slide-x-transition>
        <v-btn
          v-show="Object.keys(changeset).length"
          text
          @click="$emit('event:refresh', $route.params.id)"
        >
          Reset
        </v-btn>
      </v-slide-x-transition>

      <v-btn
        :disabled="!Object.keys(changeset).length"
        :loading="isLoading"
        color="primary"
        type="submit"
      >
        Save Changes
      </v-btn>
    </v-card-actions>

    <DialogUpdateEventType
      ref="updateTypeRef"
      :changeset="changeset"
      @submit:type="onSubmitType"
    />
  </FormDialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  toRefs,
  watch,
  useRoute,
  nextTick,
} from '@nuxtjs/composition-api'
import { useTemplateRef, useDates, useRRule, useSnackbar } from '@/composables'
import {
  useFiles,
  useEvents,
  useProjects,
  EventEntity,
  EventMode,
} from '@/stores'
import { FeeType } from '@server/event/enums/fee-type.enum'
import { EventTimeThreshold } from '@server/event/enums/event-time-threshold.enum'
import { Grade } from '@server/user/enums/grade.enum'
import { UpdateEventsDto } from '@server/event/dto/update-events.dto'
import { UpdateEventDto } from '@server/event/dto/update-event.dto'
import { Gender } from '@server/user/enums/gender.enum'
import { EventRecurrenceDto } from '@server/event/dto/event-recurrence.dto'
import { CreateEventFeeDto } from '@server/event-fee/dto/create-event-fee.dto'
import DialogForm from '@/components/dialog/Form.vue'
import DialogUpdateEventType from '@/components/dialog/UpdateEventType.vue'
import { isValidDate, shallowDiff, toDate } from '@/utils/utilities'
import { genders } from '@/utils/constants'
import { contiguousGradeRanges, gradeGroups, grades } from '@/utils/events'
import { EntityDTO } from '@server/shared/types/entity-dto'

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

type DialogComponent = InstanceType<typeof DialogForm>
type DialogTypeComponent = InstanceType<typeof DialogUpdateEventType>

export default defineComponent({
  props: {
    event: {
      type: Object as PropType<EventEntity>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const dialog = useTemplateRef<DialogComponent>('dialogRef')
    const updateTypeRef = useTemplateRef<DialogTypeComponent>('updateTypeRef')

    const snackbar = useSnackbar()
    const route = useRoute()
    const eventStore = useEvents()
    const dateUtils = useDates()
    const rruleUtils = useRRule()
    const fileStore = useFiles()
    const projectStore = useProjects()

    const state = reactive({
      success: false,
      colorMenu: false,
      internalEvent: null as EventEntity | null,
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
      fee: {
        amount: null as number | null,
        lateAmount: null as number | null,
      },
      feeType: FeeType.FREE,
      upload: null as File | string | null,
      meta: {
        name: '',
        description: '',
        location: '',
        color: '',
        locationTitle: '',
        picture: '',
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
      },
      rrule: null as EntityDTO<EventRecurrenceDto> | null,
      originalRRule: null as null | EntityDTO<EventRecurrenceDto>,
    })

    const isLoading = computed(() => eventStore.isLoading)

    const feeDTO = computed(
      (): CreateEventFeeDto => ({
        amount: (state.fee.amount || 0).toPrecision(2),
        lateAmount: (state.fee.lateAmount || 0).toPrecision(2),
      })
    )

    const internalGradeGroups = computed(() =>
      gradeGroups(contiguousGradeRanges(state.meta.permissions.grades))
    )

    const eventFeeType = computed(() => {
      if (props.event.fee) {
        return FeeType.EVENT
      } else if (props.event.course?.fee) {
        return FeeType.COURSE
      }

      return FeeType.FREE
    })
    const swatch = computed(() => ({
      height: '40px',
      width: '40px',
      backgroundColor: state.meta.color,
      cursor: 'pointer',
      borderRadius: state.colorMenu ? '50%' : '4px',
      transition: 'border-radius 200ms ease-in-out',
    }))

    /**
     * @returns The properties in the rrule that have been modified.
     */
    const rruleChanges = computed(() => {
      if (!state.rrule || !state.originalRRule) return {}

      return shallowDiff(state.originalRRule, state.rrule)
    })

    /**
     * Determines the meta changes made to an event.
     */
    const metaChanges = computed(() => {
      const dto: EntityDTO<UpdateEventDto> = {
        name: state.meta.name,
        description: state.meta.description || null,
        color: state.meta.color,
        picture: state.meta.picture as any, // No ideal way to make it like Files
        location: state.meta.location || null,
        locationTitle: state.meta.locationTitle,
        permissions: state.meta.permissions,
        cutoffThreshold: state.meta.cutoffThreshold,
        cutoffOffset: state.meta.cutoffOffset,
        lateThreshold: state.meta.lateThreshold,
        lateOffset: state.meta.lateOffset,
      }

      if (state.dates.allday) {
        dto.dtstart = toDate(state.dates.start.date, '00:00').toISOString()
        dto.dtend = toDate(state.dates.start.date, '23:59').toISOString()
      } else {
        dto.dtstart = toDate(
          state.dates.start.date,
          state.times.start.time
        ).toISOString()
        dto.dtend = toDate(
          state.dates.end.date,
          state.times.end.time
        ).toISOString()
      }

      // Project
      if ((state.meta.project || null) !== (props.event.project?.id || null)) {
        dto.project = state.meta.project
      }

      // Course
      if ((state.meta.course || null) !== (props.event.course?.id || null)) {
        dto.course = state.meta.course
      }

      return shallowDiff(props.event, dto)
    })

    /**
     * Mastermind that determines the appropriate update actions
     * based on changes made to the event metadata, dates, or rrule.
     */
    const changeset = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dtstart, ...rule } = rruleChanges.value
      const rruleOptsChanged = Object.keys(rule).length !== 0
      const changedStart = metaChanges.value.dtstart
      const meta: EntityDTO<UpdateEventDto> = {
        ...state.meta,
        dtend: metaChanges.value.dtend,
      }
      const rrule = state.rrule!

      // If the fee type of values have changed, replace the fee.
      const origFee = props.event.fee || props.event.course?.fee
      const feeTypeChanged = eventFeeType.value !== state.feeType
      if (
        feeTypeChanged ||
        (origFee &&
          (origFee.amount !== feeDTO.value.amount ||
            origFee.lateAmount !== feeDTO.value.lateAmount))
      ) {
        meta.fee = feeDTO.value
        meta.feeType = state.feeType
      }

      // Changing the date of an event eliminates the "all" option, and
      // changing the rrule options eliminates "single", so force a future update.
      if (rruleOptsChanged && changedStart) {
        return {
          future: { ...meta, rrule },
        }
      }

      // If the rrule options where changed this re-writes the rrule.
      // Since the rrule is now different, single-event updates are not allowed.
      if (rruleOptsChanged) {
        return {
          future: { ...meta, rrule },
          all: {
            ...meta,
            rrule: {
              ...rrule,
              dtstart: state.originalRRule?.dtstart || props.event.dtstart,
            },
          },
        }
      }

      // Changing just the dtstart of the event eliminates the "all" option.
      if (changedStart) {
        return {
          single: { ...meta, dtstart: metaChanges.value.dtstart },
          future: { ...meta, rrule: { ...rrule, dtstart: changedStart } },
        }
      }

      if (!Object.keys(meta).length) return {}

      return {
        single: meta,
        future: meta,
        all: meta,
      }
    })

    /**
     * If the project is removed then the course should be too.
     */
    watch(
      () => state.meta.project,
      (id: number | null) => {
        if (!id) {
          state.meta.course = null
        }
      }
    )

    /**
     * Hydrates an rrule from a string into its dto options form
     */
    const getRRuleOptions = (event: EventEntity) => {
      if (!event.recurrence) return null

      return rruleUtils.getDeserialized(event.recurrence.rrule)
    }

    /**
     * Transforms the interpreted event data into the data required
     * for editing the events or events.
     */
    watch(
      () => props.event,
      (event) => {
        state.internalEvent = { ...event }
        const start = new Date(state.internalEvent.dtstart)
        const end = new Date(state.internalEvent.dtend)

        // Copy event date data.
        state.dates.start.date = dateUtils.format(start, 'yyyy-MM-dd')
        state.times.start.time = dateUtils.format(start, 'HH:mm')
        state.dates.end.date = dateUtils.format(end, 'yyyy-MM-dd')
        state.times.end.time = dateUtils.format(end, 'HH:mm')

        // Copy event metadata
        state.meta.name = state.internalEvent.name
        state.meta.description = state.internalEvent.description || ''
        state.meta.location = state.internalEvent.location || ''
        state.meta.color = state.internalEvent.color || '#000000'
        state.meta.locationTitle = state.internalEvent.locationTitle
        state.meta.cutoffThreshold = state.internalEvent.cutoffThreshold
        state.meta.cutoffOffset = state.internalEvent.cutoffOffset
        state.meta.lateThreshold = state.internalEvent.lateThreshold
        state.meta.lateOffset = state.internalEvent.lateOffset
        state.meta.permissions.grades =
          state.internalEvent.permissions?.grades || []
        state.meta.permissions.genders =
          state.internalEvent.permissions?.genders || []
        state.meta.project = state.internalEvent.project?.id || null
        state.meta.course = state.internalEvent.course?.id || null
        state.meta.picture = state.internalEvent.picture

        // Event Fee
        if (state.internalEvent.fee) {
          const fee = state.internalEvent.fee

          state.feeType = FeeType.EVENT
          state.fee.amount = +fee.amount
          state.fee.lateAmount = fee.lateAmount ? +fee.lateAmount : 0
        } else if (state.internalEvent.course?.fee) {
          const fee = state.internalEvent.course.fee

          state.feeType = FeeType.COURSE
          state.fee.amount = +fee.amount
          state.fee.lateAmount = fee.lateAmount ? +fee.lateAmount : 0
        } else {
          state.feeType = FeeType.FREE
        }

        // Serialize RRule string to object
        // TODO: Fix types
        state.rrule = getRRuleOptions(
          state.internalEvent as EventEntity
        ) as EntityDTO<EventRecurrenceDto>
        state.originalRRule = { ...state.rrule! }
      },
      { immediate: true, deep: true }
    )

    const format = (dateString: string) => {
      if (dateString === '') return 'Select a Date'

      const [year, month, day] = dateString.split('-')
      const date = new Date(+year, +month - 1, +day)

      if (!isValidDate(date)) return 'Invalid Date'

      return dateUtils.format(date, 'EEE, LLL d, yyyy')
    }

    /**
     * Submits the changes for an event update.
     */
    const update = async (
      type: EventMode,
      changeset: EntityDTO<UpdateEventDto> | EntityDTO<UpdateEventsDto>
    ) => {
      await eventStore.update(+route.value.params.id, changeset, type)

      if (eventStore.error) {
        snackbar.error(eventStore.error.message)
      } else {
        emit('event:update', +route.value.params.id)
        snackbar.success('Event successfully updated')
        dialog.value.close()
      }
    }

    /**
     * The "save changes" button was pushed and the form has no errors.
     */
    const onSubmit = async () => {
      if (state.upload instanceof File) {
        const file = await fileStore.create(state.upload)

        if (fileStore.error) {
          return snackbar.error(fileStore.error.message)
        }

        state.meta.picture = file.root
      } else if (typeof state.upload === 'string') {
        state.meta.picture = state.upload
      }

      // Let the computed properties update.
      // This is not ideal.
      await nextTick()

      const numChangesets = Object.keys(changeset.value).length

      if (numChangesets > 1) {
        return updateTypeRef.value.open()
      }

      if (changeset.value.future) {
        // If we got here we removed any files.
        await update('future', changeset.value.future)
      }
    }

    /**
     * Callback method for the update event type popup.
     */
    const onSubmitType = async (
      type: EventMode,
      changeset: EntityDTO<UpdateEventDto> | EntityDTO<UpdateEventsDto>
    ) => {
      await update(type, changeset)
    }

    return {
      ...toRefs(state),
      isLoading,
      grades,
      genders,
      swatch,
      timeThresholds,
      feeTypes,
      format,
      onSubmitType,
      onSubmit,
      changeset,
      gradeGroups: internalGradeGroups,
      isSameDay: dateUtils.isSameDay,
      projectStore,
    }
  },
})
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
