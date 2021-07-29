<template>
  <v-card ripple :to="'/events/' + event.id">
    <v-row class="px-3">
      <v-col cols="auto relative">
        <v-avatar height="100" width="110" rounded>
          <v-img :src="background" />
        </v-avatar>
      </v-col>

      <v-col class="d-flex align-start flex-column justify-center">
        <div class="title">{{ event.name }}</div>
        <div class="subtitle">{{ time }}</div>
        <v-row no-gutters class="flex-shrink-1 flex-grow-0">
          <v-col
            v-if="fee && status !== 'Closed'"
            cols="auto"
            class="mr-2 align-self-start bullet"
          >
            <v-icon color="secondary" dense>mdi-currency-usd</v-icon>
            <span>{{ fee }}</span>
          </v-col>

          <v-col cols="auto" class="mr-2 align-self-start bullet">
            <v-icon color="secondary" dense>{{
              status === 'Open'
                ? 'mdi-calendar-star'
                : status === 'Late Fee'
                ? 'mdi-calendar-clock'
                : 'mdi-calendar-lock'
            }}</v-icon>
            <span>{{ status }}</span>
          </v-col>

          <v-col cols="auto" class="align-self-start bullet">
            <v-icon color="secondary" dense>mdi-map-marker-outline</v-icon>
            <span>{{ event.locationTitle }}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { format } from 'date-fns'
import { Event } from '@server/event/event.entity'
import {
  computed,
  defineComponent,
  PropType,
  useContext,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    event: {
      type: Object as PropType<Event>,
      required: true,
    },
  },
  setup(props) {
    const { $config } = useContext()

    const background = computed(() => {
      const url = props.event.picture

      if (url.startsWith('http')) return url

      return `${$config.staticBase}${url}`
    })

    const time = computed(() => {
      const date = new Date(props.event.dtstart)
      return `${format(date, 'EEE, LLLL do')} at ${format(date, 'h:mm aaaa')}`
    })

    const status = computed(() => {
      if (props.event.isClosed) return 'Closed'

      if (props.event.isLate) return 'Late Fee'

      return 'Open'
    })

    const fee = computed(() => {
      if (props.event.course?.fee) {
        const isLate = props.event.course.isLate

        if (isLate) {
          return (
            props.event.course.fee.lateAmount || props.event.course.fee.amount
          )
        } else {
          return props.event.course.fee.amount
        }
      }

      if (props.event.fee) {
        const isLate = props.event.isLate

        if (isLate) {
          return props.event.fee.lateAmount || props.event.fee.amount
        } else {
          return props.event.fee.amount
        }
      }
    })

    return { background, time, status, fee }
  },
})
</script>

<style lang="scss" scoped>
.bullet {
  font-size: 0.875rem;
}

.title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.0125em;
  line-height: 1.6rem;
  word-break: break-word;
}

.subtitle {
  opacity: 0.7;
  font-weight: 600;
}
</style>
