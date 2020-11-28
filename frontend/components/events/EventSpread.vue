<template>
  <v-card ripple :to="'/events/' + event.id">
    <v-row class="px-3">
      <v-col cols="auto relative">
        <v-avatar height="100" width="110" rounded>
          <v-img :src="background"></v-img>
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
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Event } from '../../../backend/src/event/event.entity'

@Component
export default class EventSpread extends Vue {
  @Prop({ required: true }) readonly event!: Event

  get background() {
    const url = this.event.picture

    if (url.startsWith('http')) return url

    return `${this.$config.staticBase}${url}`
  }

  get time() {
    const date = new Date(this.event.dtstart)
    return `${format(date, 'EEE, LLLL do')} at ${format(date, 'h:mm aaaa')}`
  }

  get status() {
    if (this.event.isClosed) return 'Closed'

    if (this.event.isLate) return 'Late Fee'

    return 'Open'
  }

  get fee() {
    if (this.event.course?.fee) {
      const isLate = this.event.course.isLate

      if (isLate) {
        return this.event.course.fee.lateAmount || this.event.course.fee.amount
      } else {
        return this.event.course.fee.amount
      }
    }

    if (this.event.fee) {
      const isLate = this.event.isLate

      if (isLate) {
        return this.event.fee.lateAmount || this.event.fee.amount
      } else {
        return this.event.fee.amount
      }
    }
  }
}
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
