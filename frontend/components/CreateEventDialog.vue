<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    max-width="540"
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

      <v-card-text>
        <v-list dense>
          <v-list-item class="pa-0">
            <!-- Intentionally empty for spacing -->
            <v-list-item-avatar />

            <v-list-item-content>
              <v-text-field
                v-model="meta.name"
                label="Add title"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item class="pa-0">
            <v-list-item-avatar>
              <v-icon>mdi-clock-outline</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>All-day</v-list-item-content>

            <v-list-item-action>
              <v-switch v-model="pickers.allday" />
            </v-list-item-action>
          </v-list-item>

          <v-list-item class="pa-0">
            <!-- Intentionally empty for spacing -->
            <v-list-item-avatar />

            <v-list-item-content>
              <v-row>
                <v-col>
                  <v-menu v-model="pickers.end.open" offset-y min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formattedStartDate"
                        readonly
                        :label="pickers.allday ? 'Date' : 'Start Date'"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="pickers.end.date"
                      @input="pickers.start.open = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col v-if="!pickers.allday" cols="4">
                  <time-picker v-model="timepicker.start" label="Start Time" />
                </v-col>
              </v-row>
              <v-expand-transition>
                <v-row v-if="!pickers.allday">
                  <v-col>
                    <v-menu
                      v-model="pickers.start.open"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="formattedEndDate"
                          readonly
                          label="End Date"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="pickers.end.date"
                        @input="pickers.end.open = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="4">
                    <time-picker v-model="timepicker.end" label="End Time" />
                  </v-col>
                </v-row>
              </v-expand-transition>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-list-item class="pa-0">
            <v-list-item-avatar>
              <v-icon>mdi-update</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-row>
                <v-col>
                  <recurrence-dialog
                    ref="recurrenceDialog"
                    v-model="rrule"
                    :date="pickers.start.date"
                  />
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item class="pa-0">
            <v-list-item-avatar>
              <v-icon>mdi-map-marker</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-text-field label="Location" />
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item class="pa-0">
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
        </v-list>

        <v-divider></v-divider>

        <v-list-item class="pa-0">
          <v-list-item-avatar>
            <v-icon>mdi-school-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row no-gutters>
              <v-col cols="auto">
                <v-select label="Select Project (Optional)"></v-select>
              </v-col>
              <v-col>
                <v-btn text class="ma-3">Add Project</v-btn>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close()">Cancel</v-btn>
        <v-btn text @click="createEvent()">Create Event</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Options } from 'rrule'
import moment from 'moment'
import RecurrenceDialog from './events/RecurrenceDialog.vue'
import { CreateEventDto } from '~/interfaces/events/create-event.interface'
import { EventRecurrenceDto } from '~/interfaces/events/event-recurrence.interface'

export type RRuleOptions = Partial<Options>

export type RepeatingTypes = {
  label: string
  rrule?: RRuleOptions
}

@Component
export default class CreateEventDialog extends Vue {
  $refs!: {
    recurrenceDialog: RecurrenceDialog
  }

  dialog = false

  pickers = {
    allday: false,
    start: {
      open: false,
      date: new Date(),
    },
    end: {
      open: false,
      date: new Date(),
    },
  }

  rrule: EventRecurrenceDto | null = null

  timepicker = {
    start: '12:24',
    end: '',
    startDialog: false,
    endDialog: false,
    times: [] as string[],
  }

  meta = {
    name: '',
    description: '',
  }

  get formattedStartDate() {
    return this.pickers.start.date
      ? moment(this.pickers.start.date).format('dddd, MMMM D')
      : ''
  }

  get formattedEndDate() {
    return this.pickers.end.date
      ? moment(this.pickers.end.date).format('dddd, MMMM D')
      : ''
  }

  beforeMount() {
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

    this.timepicker.times = times
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

  async createEvent() {
    const createEventDto: CreateEventDto = {
      ...this.meta,
      dtstart: this.rrule ? undefined : this.pickers.start.date,
      dtend: this.pickers.allday ? undefined : this.pickers.end.date,
      rrule: this.rrule || undefined,
    }

    try {
      await this.$store.dispatch('events/createEvent', createEventDto)

      this.$emit('created')
      this.close()
    } catch (error) {
      console.error(error)
    }
  }

  close() {
    this.dialog = false
  }
}
</script>

<style lang="scss" scoped>
.v-card__text {
  padding: 16px 0;
}
</style>
