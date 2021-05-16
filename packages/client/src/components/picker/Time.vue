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

    <VTextFieldValidated
      :value="friendlyTime"
      v-bind="$attrs"
      hide-details="auto"
      @click="dialog = true"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { friendlyTime as friendlyTimeUtil } from '~/utils/utilities'

export type Meridiem = 'AM' | 'PM'

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      dialog: false,
      manual: false,
      referenceTime: props.value,
    })

    const friendlyTime = () => friendlyTimeUtil(time.value)

    const time = computed({
      get() {
        return props.value
      },
      set(value: string) {
        emit('input', value)
      },
    })

    const hours = computed({
      get() {
        return +props.value.substring(2, 0)
      },
      set(hours: number) {
        const hourString = hours.toString().padStart(2, '0')

        emit('input', `${hourString}:${minutes.value}`)
      },
    })

    const minutes = computed({
      get() {
        return +props.value.substring(3, 5)
      },
      set(minutes: number) {
        const minuteString = minutes.toString().padStart(2, '0')

        emit('input', `${hours.value}:${minuteString}`)
      },
    })

    const meridiem = computed({
      get() {
        const hourString = props.value.substring(2, 0)
        const hours = +hourString

        return hours < 12 ? 'AM' : 'PM'
      },
      set(value: Meridiem) {
        const current = meridiem.value

        if (current === value) return

        if (value === 'AM') {
          hours.value -= 12
        } else {
          hours.value += 12
        }
      },
    })

    return { ...toRefs(state), friendlyTime, time, minutes, hours, meridiem }
  },
})
</script>
