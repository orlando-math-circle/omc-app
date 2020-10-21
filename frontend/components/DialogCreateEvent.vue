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

        <v-btn small absolute right fab icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <ValidationObserver v-slot="{ passes }" ref="form">
        <v-form @submit.prevent="passes(onSubmit)">
          <v-card-text class="pa-0">
            <v-list dense>
              <v-list-item>
                <!-- Intentionally empty for spacing -->
                <v-list-item-avatar />

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
                <v-list-item-avatar />

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
                      <ValidationProvider
                        v-slot="{ errors }"
                        vid="starttime"
                        :rules="
                          dates.allday
                            ? undefined
                            : {
                                required: true,
                                starttime: { time: '@endtime' },
                              }
                        "
                      >
                        <time-picker
                          v-model="times.start.time"
                          :errors="errors"
                          label="Start Time"
                        />
                      </ValidationProvider>
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
                            <ValidationProvider
                              v-slot="{ errors }"
                              vid="enddate"
                              :rules="{ required: !dates.allday }"
                            >
                              <v-text-field
                                :value="format(dates.end.date)"
                                :error-messages="errors"
                                readonly
                                hide-details="auto"
                                label="End Date"
                                v-bind="attrs"
                                v-on="on"
                              >
                              </v-text-field>
                            </ValidationProvider>
                          </template>
                          <v-date-picker
                            v-model="dates.end.date"
                            @input="dates.end.menu = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="4">
                        <ValidationProvider v-slot="{ errors }" vid="endtime">
                          <time-picker
                            v-model="times.end.time"
                            :error-messages="errors"
                            label="End Time"
                          />
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </v-expand-transition>
                </v-list-item-content>
              </v-list-item>

              <v-divider />

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-update</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <!-- <recurrence-dialog
                    ref="recurrenceDialog"
                    v-model="rrule"
                    :date="dates.start.date"
                  /> -->
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-map-marker</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-text-field label="Location" />
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

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
                      <dialog-create-project
                        @create:project="onProjectCreated"
                      />
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item v-if="project.id">
                <v-list-item-avatar>
                  <v-icon>mdi-school-outline</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <auto-complete-course v-model="course.id" />
                    </v-col>

                    <v-col cols="auto">
                      <dialog-select-course v-model="course.id" />
                    </v-col>

                    <v-col cols="auto">
                      <dialog-create-course
                        :project="project.id"
                        @create:course="onCourseCreated"
                      />
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="close()">Cancel</v-btn>
            <v-btn text type="submit" :loading="loading"> Create Event </v-btn>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { format } from 'date-fns'
import { Options } from 'rrule'
import { CreateEventDto } from '../../backend/src/event/dtos/create-event.dto'
import { Project } from '../../backend/src/project/project.entity'
import RecurrenceDialog from './events/RecurrenceDialog.vue'
import { EventRecurrenceDto } from '~/interfaces/events/event-recurrence.interface'
import { addTime, isValidDate, roundDate, toDate } from '~/utils/utilities'
import { Course } from '~/../backend/src/course/course.entity'

export type RRuleOptions = Partial<Options>

export type RepeatingTypes = {
  label: string
  rrule?: RRuleOptions
}

export type ComponentRefs = VueConstructor<
  Vue & {
    $refs: {
      recurrenceDialog: RecurrenceDialog
      calendar: {
        prev: () => void
        next: () => void
      }
      form: InstanceType<typeof ValidationObserver>
    }
  }
>

export default (Vue as ComponentRefs).extend({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    date: {
      type: String,
      default: new Date().toISOString().substr(0, 10),
    },
    time: {
      type: String,
      default: format(roundDate(new Date(), 30), 'HH:mm'),
    },
  },
  data() {
    return {
      dialog: false,
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
      meta: {
        name: '',
        description: '',
      },
      project: {
        id: 0,
      },
      course: {
        id: 0,
      },
      loading: false,
    }
  },
  beforeMount() {
    // Sets the starting date and time

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
  },
  methods: {
    close() {
      this.dialog = false
    },
    format(dateString: string) {
      if (dateString === '') return 'Select a Date'

      const [year, month, day] = dateString.split('-')
      const date = new Date(+year, +month - 1, +day)

      if (!isValidDate(date)) return 'Invalid Date'

      return format(date, 'EEEE, LLLL do')
    },
    updateRRule(type: number) {
      switch (type) {
        case 4:
          this.$refs.recurrenceDialog.open()
          break
        default:
          break
      }
    },
    async onSubmit() {
      // this.validate()

      const createEventDto: CreateEventDto = {
        ...this.meta,
        dtstart: this.rrule
          ? undefined
          : toDate(this.dates.start.date, this.times.start.time),
        dtend: this.dates.allday
          ? undefined
          : toDate(this.dates.end.date, this.times.end.time),
        rrule: this.rrule || undefined,
        isOnline: false, // TODO: Temporary
        project: this.project?.id,
        course: this.course?.id,
      }

      try {
        this.loading = true
        await this.$accessor.events.create(createEventDto)

        this.$emit('created')
        this.close()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    onProjectSelect(id: number) {
      this.project.id = id
    },
    onProjectCreated(project: Project) {
      console.log('PROJECT CREATED')
      this.project.id = project.id
    },
    onCourseCreated(course: Course) {
      this.course.id = course.id
    },
  },
})
</script>

<style lang="scss" scoped>
.v-card__text {
  padding: 16px 0;
}
</style>
