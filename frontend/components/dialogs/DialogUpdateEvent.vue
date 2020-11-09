<template>
  <dialog-form ref="dialog" @submit:form="onSubmit">
    <template #title>Edit Event</template>

    <template #activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">Edit Event</v-btn>
    </template>

    <v-card-text>
      <v-list dense>
        <v-list-item>
          <v-list-item-avatar></v-list-item-avatar>

          <v-list-item-content>
            <v-text-field-validated
              v-model="data.name"
              label="Name"
              hide-details="auto"
              vid="name"
              rules="required"
              required
            ></v-text-field-validated>
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
              v-model="data.location"
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
              v-model="data.description"
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
                <auto-complete-project v-model="project" />
              </v-col>
              <v-col cols="auto">
                <dialog-select-project v-model="project" />
              </v-col>
              <v-col cols="auto">
                <dialog-create-project @create:project="onProjectCreated" />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <!-- Course Management -->
        <v-list-item v-if="project">
          <v-list-item-avatar>
            <v-icon>mdi-school-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
              <v-col>
                <auto-complete-course
                  v-model="course"
                  :project="project"
                ></auto-complete-course>
              </v-col>

              <v-col cols="auto">
                <dialog-select-course
                  v-model="course"
                  :project="project"
                ></dialog-select-course>
              </v-col>

              <v-col cols="auto">
                <dialog-create-course
                  :project="project"
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

      <v-btn text @click="$refs.dialog.close()">Cancel</v-btn>
      <v-btn text type="submit" :loading="isLoading">
        <v-scroll-x-transition>
          <v-icon v-if="success" class="mr-2" color="success">
            mdi-check
          </v-icon>
        </v-scroll-x-transition>

        Update Event
      </v-btn>
    </v-card-actions>

    <dialog-update-event-type
      ref="typeDialog"
      @submit:type="onSubmitType"
    ></dialog-update-event-type>
  </dialog-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Event } from '@backend/event/event.entity'
import { format, isSameDay } from 'date-fns'
import { UpdateEventDto } from '@backend/event/dtos/update-event.dto'
import { EventRecurrenceDto } from '@backend/event/dtos/event-recurrence.dto'
import RRule, { Options, RRuleSet, rrulestr } from 'rrule'
import { difference, isValidDate, toDate } from '../../utils/utilities'
import DialogForm from './DialogForm.vue'
import DialogUpdateEventType from './DialogUpdateEventType.vue'
import { DTO } from '~/interfaces/date-to-string.interface'

@Component
export default class DialogUpdateEvent extends Vue {
  @Prop() event!: Event

  $refs!: {
    dialog: InstanceType<typeof DialogForm>
    typeDialog: InstanceType<typeof DialogUpdateEventType>
  }

  data = Object.assign({}, this.event)
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

  rrule = null as Options | null
  rruleOrSet = null as RRuleSet | RRule | null
  project = null as number | null
  course = null as number | null

  get isLoading() {
    return this.$accessor.events.isLoading
  }

  isSameDay(dateA: string, dateB: string) {
    return isSameDay(new Date(dateA), new Date(dateB))
  }

  /**
   * Transforms the interpreted event data into the data required
   * for editing the events or events.
   */
  beforeMount() {
    this.dates.start.date = ((this.data.dtstart as unknown) as string).substr(
      0,
      10
    )

    if (this.data.dtend) {
      this.dates.allday = false
      this.dates.end.date = ((this.data.dtend as unknown) as string).substr(
        0,
        10
      )
      this.times.start.time = format(new Date(this.data.dtstart), 'HH:mm')
      this.times.end.time = format(new Date(this.data.dtend), 'HH:mm')
    } else {
      this.dates.allday = true
    }

    // Serialize RRule string to object
    if (this.data.recurrence?.rrule) {
      this.rruleOrSet = rrulestr(this.data.recurrence.rrule)

      if (this.rruleOrSet instanceof RRuleSet) {
        this.rrule = this.rruleOrSet.rrules()[0].origOptions as Options
      } else {
        this.rrule = this.rruleOrSet.options
      }
    }

    this.project = this.data?.project?.id || 0
    this.course = this.data?.course?.id || 0
  }

  format(dateString: string) {
    if (dateString === '') return 'Select a Date'

    const [year, month, day] = dateString.split('-')
    const date = new Date(+year, +month - 1, +day)

    if (!isValidDate(date)) return 'Invalid Date'

    return format(date, 'EEEE, LLLL do')
  }

  onSubmit() {
    this.$refs.typeDialog.open()
  }

  async onSubmitType(type: 'single' | 'future' | 'all') {
    const normalized: DTO<UpdateEventDto> = {
      name: this.data.name,
      description: this.data.description,
      location: this.data.location,
      picture: this.data.picture,
    }

    if (this.rrule) {
      normalized.rrule = this.rrule as EventRecurrenceDto
    } else {
      normalized.dtstart = toDate(
        this.dates.start.date,
        this.times.start.time
      ).toISOString()
    }

    if (this.dates.allday) {
      normalized.dtend = toDate(
        this.dates.end.date,
        this.times.end.time
      ).toISOString()
    }

    if (this.project && this.data.project?.id !== this.project) {
      normalized.project = this.project
    }

    if (this.course && this.data.course?.id === this.course) {
      normalized.course = this.course
    }

    const differences: any = difference(this.event, normalized)

    console.log(type, differences)

    await this.$accessor.events.update({
      id: this.data.id,
      dto: differences,
      type,
    })

    if (this.$accessor.events.error) {
      console.log(this.$accessor.events.error)
    } else {
      this.$emit('event:update')

      this.success = true
      this.$refs.dialog.close(1500)
    }
  }

  onProjectCreated(project: any) {
    console.log(project)
  }

  onCourseCreated(course: any) {
    console.log(course)
  }
}
</script>
