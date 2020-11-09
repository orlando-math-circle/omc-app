<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    max-width="540"
    persistent
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">Add Event</v-btn>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Add New Event</v-toolbar-title>

        <v-btn small absolute right fab icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form-validated @submit:form="onSubmit">
        <v-card-text class="pa-0">
          <v-list dense>
            <v-list-item>
              <!-- Intentionally empty for spacing -->
              <v-list-item-avatar></v-list-item-avatar>

              <v-list-item-content>
                <v-text-field-validated
                  v-model="meta.name"
                  label="Add title"
                  hide-details="auto"
                  vid="title"
                  rules="required"
                >
                </v-text-field-validated>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-clock-outline</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>All-day</v-list-item-content>

              <v-list-item-action>
                <v-switch v-model="dates.allday" />
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <!-- Intentionally empty for spacing -->
              <v-list-item-avatar></v-list-item-avatar>

              <v-list-item-content>
                <v-row>
                  <v-col>
                    <v-menu
                      v-model="dates.start.menu"
                      offset-y
                      min-width="290px"
                    >
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
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field-validated>
                      </template>

                      <v-date-picker
                        v-model="dates.start.date"
                        @input="dates.start.menu = false"
                      />
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
                    ></time-picker>
                  </v-col>
                </v-row>

                <v-expand-transition>
                  <v-row v-if="!dates.allday">
                    <v-col>
                      <v-menu
                        v-model="dates.end.menu"
                        offset-y
                        min-width="290px"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field-validated
                            :value="format(dates.end.date)"
                            :rules="{ required: !dates.allday }"
                            vid="enddate"
                            readonly
                            hide-details="auto"
                            label="End Date"
                            v-bind="attrs"
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
                      ></time-picker>
                    </v-col>
                  </v-row>
                </v-expand-transition>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <!-- Recurrence -->
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-update</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-row>
                  <v-col>
                    <recurrence-dialog
                      ref="recurrenceDialog"
                      v-model="rrule"
                      :date="dates.start.date"
                    ></recurrence-dialog>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <!-- Location -->
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-map-marker</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-text-field
                  v-model="meta.location"
                  label="Location"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <!-- Description -->
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-text-subject</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-textarea
                  v-model="meta.description"
                  label="Description"
                  rows="1"
                  auto-grow
                ></v-textarea>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <!-- Project Management -->
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-puzzle</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-row>
                  <v-col>
                    <auto-complete-project v-model="project.id" />
                  </v-col>
                  <v-col cols="auto">
                    <dialog-select-project v-model="project.id" />
                  </v-col>
                  <v-col cols="auto">
                    <dialog-create-project @create:project="onProjectCreated" />
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <!-- Course Management -->
            <v-list-item v-if="project.id">
              <v-list-item-avatar>
                <v-icon>mdi-school-outline</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-row>
                  <v-col>
                    <auto-complete-course
                      v-model="course.id"
                      :project="project.id"
                    ></auto-complete-course>
                  </v-col>

                  <v-col cols="auto">
                    <dialog-select-course
                      v-model="course.id"
                      :project="project.id"
                    ></dialog-select-course>
                  </v-col>

                  <v-col cols="auto">
                    <dialog-create-course
                      :project="project.id"
                      @create:course="onCourseCreated"
                    ></dialog-create-course>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn text type="submit" :loading="loading">
            <v-scroll-x-transition>
              <v-icon v-if="success" class="mr-2" color="success">
                mdi-check
              </v-icon>
            </v-scroll-x-transition>

            Create Event
          </v-btn>
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { format, isSameDay } from 'date-fns'
import { Options } from 'rrule'
import { CreateEventDto } from '../../../backend/src/event/dtos/create-event.dto'
import { Project } from '../../../backend/src/project/project.entity'
import RecurrenceDialog from '../events/RecurrenceDialog.vue'
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
  @Prop({ default: new Date().toISOString().substr(0, 10) }) date!: string
  @Prop({ default: format(roundDate(new Date(), 30), 'HH:mm') }) time!: string

  $refs!: {
    recurrenceDialog: RecurrenceDialog
    calendar: Calendar
  }

  dialog = false
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

  rrule = null as EventRecurrenceDto | null

  meta = {
    name: '',
    description: '',
    location: '',
  }

  project = {
    id: null as null | number,
  }

  course = {
    id: null as null | number,
  }

  loading = false

  beforeMount() {
    this.dates.start.date = this.date
    this.dates.end.date = this.date
    this.times.start.time = this.time
    this.times.end.time = addTime(this.time, 1, 30)

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

    return format(date, 'EEEE, LLLL do')
  }

  updateRRule(type: number) {
    switch (type) {
      case 4:
        this.$refs.recurrenceDialog.open()
        break
      default:
        break
    }
  }

  async onSubmit() {
    const createEventDto: CreateEventDto = {
      ...this.meta,
      dtstart: this.rrule
        ? undefined
        : toDate(this.dates.start.date, this.times.start.time),
      dtend: this.dates.allday
        ? undefined
        : toDate(this.dates.end.date, this.times.end.time),
      rrule: this.rrule || undefined,
      project: this.project.id || undefined,
      course: this.course.id || undefined,
    }

    try {
      this.loading = true
      await this.$accessor.events.create(createEventDto)

      this.$emit('created')
      this.success = true
      setTimeout(() => (this.dialog = false), 1500)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  }

  onProjectSelect(id: number) {
    this.project.id = id
  }

  onProjectCreated(project: Project) {
    this.project.id = project.id
  }

  onCourseCreated(course: Course) {
    console.log(course)
    this.course.id = course.id
  }
}
</script>

<style lang="scss" scoped>
.v-card__text {
  padding: 16px 0;
}
</style>
