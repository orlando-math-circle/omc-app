<template>
  <div>
    <v-dialog ref="dialog" v-model="dialog" max-width="300px">
      <v-card>
        <template v-if="manual">
          <v-card-title>Set Time</v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="hours"
                  single-line
                  type="number"
                  help-text="Hour"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="minutes"
                  single-line
                  type="number"
                  help-text="Minute"
                />
              </v-col>
              <v-col cols="4">
                <v-select v-model="meridiem" :items="['AM', 'PM']" />
              </v-col>
            </v-row>
          </v-card-text>
        </template>

        <template v-else>
          <v-time-picker v-model="time" full-width />
        </template>

        <v-card-actions>
          <v-btn icon @click="manual = !manual">
            <v-icon
              v-text="manual ? 'mdi-clock-time-four-outline' : 'mdi-keyboard'"
            />
          </v-btn>

          <v-spacer />

          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-text-field
      :value="friendlyTime"
      :error-messages="errors"
      v-bind="$attrs"
      hide-details="auto"
      @click="dialog = true"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { friendlyTime } from '~/utils/utilities'

export type Meridiem = 'AM' | 'PM'

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
    },
    errors: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      dialog: false,
      manual: false,
      referenceTime: this.value,
    }
  },
  computed: {
    friendlyTime(): string {
      return friendlyTime(this.time)
    },
    time: {
      get(): string {
        return this.value
      },
      set(value: string) {
        this.$emit('input', value)
      },
    },
    hours: {
      get(): number {
        return +this.value.substring(2, 0)
      },
      set(hours: number) {
        const hourString = hours.toString().padStart(2, '0')

        this.$emit('input', `${hourString}:${this.minutes}`)
      },
    },
    minutes: {
      get(): number {
        return +this.value.substring(3, 5)
      },
      set(minutes: number) {
        const minuteString = minutes.toString().padStart(2, '0')

        this.$emit('input', `${this.hours}:${minuteString}`)
      },
    },
    meridiem: {
      get(): Meridiem {
        const hourString = this.value.substring(2, 0)
        const hours = +hourString

        return hours < 12 ? 'AM' : 'PM'
      },
      set(meridiem: Meridiem) {
        const current = this.meridiem

        if (current === meridiem) return

        if (meridiem === 'AM') {
          this.hours -= 12
        } else {
          this.hours += 12
        }
      },
    },
  },
})
</script>
