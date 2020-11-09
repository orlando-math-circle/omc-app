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

    <v-text-field-validated
      :value="friendlyTime"
      v-bind="$attrs"
      hide-details="auto"
      @click="dialog = true"
    ></v-text-field-validated>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { friendlyTime } from '~/utils/utilities'

export type Meridiem = 'AM' | 'PM'

@Component
export default class PickerTime extends Vue {
  @Prop({ required: true }) value!: string

  dialog = false
  manual = false
  referenceTime = this.value

  get friendlyTime(): string {
    return friendlyTime(this.time)
  }

  get time() {
    return this.value
  }

  set time(value: string) {
    this.$emit('input', value)
  }

  get hours() {
    return +this.value.substring(2, 0)
  }

  set hours(hours: number) {
    const hourString = hours.toString().padStart(2, '0')

    this.$emit('input', `${hourString}:${this.minutes}`)
  }

  get minutes() {
    return +this.value.substring(3, 5)
  }

  set minutes(minutes: number) {
    const minuteString = minutes.toString().padStart(2, '0')

    this.$emit('input', `${this.hours}:${minuteString}`)
  }

  get meridiem() {
    const hourString = this.value.substring(2, 0)
    const hours = +hourString

    return hours < 12 ? 'AM' : 'PM'
  }

  set meridiem(meridiem: Meridiem) {
    const current = this.meridiem

    if (current === meridiem) return

    if (meridiem === 'AM') {
      this.hours -= 12
    } else {
      this.hours += 12
    }
  }
}
</script>
