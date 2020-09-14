<template>
  <div>
    <v-dialog ref="dialog" v-model="show" max-width="300px">
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

          <v-btn text @click="show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-text-field :value="value" v-bind="$attrs" @click="show = true" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

export type Meridiem = 'AM' | 'PM'

@Component
export default class TimePicker extends Vue {
  @Prop() value!: string

  show = false
  manual = false
  referenceTime = this.value

  get time() {
    return this.value
  }

  set time(time: string) {
    this.$emit('input', time)
  }

  get hours(): number {
    return parseInt(this.value.substring(2, 0), 10)
  }

  set hours(hour: number) {
    const hourString = hour < 10 ? `0${hour}` : `${hour}`

    this.$emit('input', `${hourString}:${this.minutes}`)
  }

  get minutes() {
    return parseInt(this.value.substring(3, 5), 10)
  }

  set minutes(minute: number) {
    const minuteString = minute < 10 ? `0${minute}` : `${minute}`

    this.$emit('input', `${this.hours}:${minuteString}`)
  }

  get meridiem(): Meridiem {
    const hoursString = this.value.substring(2, 0)
    const hours = parseInt(hoursString, 10)

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
