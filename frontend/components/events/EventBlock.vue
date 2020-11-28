<template>
  <v-card width="270" :to="'/events/' + event.id">
    <v-img class="align-end" height="150px" :src="background"></v-img>

    <div class="card--bottom">
      <v-card-title class="card--title mr-15">{{ event.name }}</v-card-title>

      <v-card-text class="card--text">
        <v-row>
          <v-col>
            <v-icon color="secondary">{{
              event.location === 'Online' ? 'mdi-web' : 'mdi-map-marker-outline'
            }}</v-icon>

            {{ event.locationTitle }}
          </v-col>

          <v-col>
            <v-icon color="secondary">mdi-calendar-clock</v-icon>

            {{ date.time }}
          </v-col>
        </v-row>
      </v-card-text>

      <div class="d-flex card--date flex-column">
        <div class="d-flex flex-shrink card--date__day">{{ date.day }}</div>
        <div class="d-flex card--date__month">{{ date.month }}</div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Event } from '../../../backend/src/event/event.entity'
import { formatDate } from '~/utils/utilities'

@Component
export default class EventBlock extends Vue {
  @Prop() event!: Event

  get date() {
    const d = formatDate(this.event.dtstart, 'd-MMM-h:mm aaaa')

    const [day, month, time] = d.split('-')

    return { day, month, time }
  }

  get background() {
    const url = this.event.picture

    if (url.startsWith('http')) return url

    return `${this.$config.staticBase}${url}`
  }
}
</script>

<style lang="scss" scoped>
.card--title {
  font-weight: 700;
  padding: 10px 16px;
}

.card--text {
  padding: 0 10px 10px 10px;
}

.card--date {
  position: absolute;
  right: 10px;
  bottom: 32%;
  width: 55px;
  height: 55px;
  color: #fff;
  background: #ff4299;
  border-radius: 6px;
  z-index: 2;

  &::after {
    position: absolute;
    top: 10px;
    right: 10px;
    bottom: 0;
    left: 10px;
    content: '';
    box-shadow: 0 0 15px 0 #ff4299;
  }

  &__day {
    height: 22px;
    font-weight: 700;
    font-size: 1.3rem;
    justify-content: center;
  }

  &__month {
    font-weight: 600;
    justify-content: center;
  }
}
</style>
