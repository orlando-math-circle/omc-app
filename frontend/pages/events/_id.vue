<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-img max-height="300" :src="picture">
          <v-toolbar flat class="picture--toolbar">
            <v-btn icon @click="$router.back()">
              <v-sheet class="pa-2 rounded">
                <v-icon>mdi-arrow-left</v-icon>
              </v-sheet>
            </v-btn>

            <v-spacer />

            <dialog-lightbox :image="picture">
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-sheet class="pa-2 rounded">
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-sheet>
                </v-btn>
              </template>
            </dialog-lightbox>
          </v-toolbar>
        </v-img>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card>
        <v-card-title class="event--heading">{{ event.name }}</v-card-title>

        <v-card-text>
          <v-list dense>
            <v-list-item class="pl-0">
              <v-list-item-avatar class="icon--bg rounded">
                <v-icon color="primary">mdi-calendar-clock</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ date }}</v-list-item-title>
                <v-list-item-subtitle>{{ times }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item class="pl-0">
              <v-list-item-avatar class="icon--bg rounded">
                <v-icon color="primary">mdi-compass</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ event.location }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="fee" class="pl-0">
              <v-list-item-avatar class="icon--bg rounded">
                <v-icon color="primary">mdi-currency-usd</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>Event Fees</v-list-item-content>
              <v-list-item-subtitle>${{ fee }} Per Person</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-title class="event--heading">Description</v-card-title>

        <v-card-text>{{ event.description }}</v-card-text>

        <v-card-actions class="pa-3">
          <v-btn v-if="isOpen" color="primary" rounded block>Register</v-btn>

          <v-btn v-else disabled rounded block>Registrations Closed</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { isAfter } from 'date-fns'
import { formatDate } from '~/utils/utilities'

@Component({
  head: {
    title: 'Event Details',
  },
  async asyncData({ app: { $accessor }, route }) {
    await Promise.all([
      $accessor.events.findOne(route.params.id),
      $accessor.registrations.getStatuses(route.params.id),
    ])
  },
})
export default class EventPage extends Vue {
  get event() {
    return this.$accessor.events.event!
  }

  get picture() {
    const url = this.event.picture ?? this.event?.project?.picture

    if (!url) return this.$accessor.events.defaultPicture

    if (url.startsWith('http')) return url

    return `${this.$config.staticBase}${url}`
  }

  get date() {
    return this.format(this.event.dtstart, 'EEE, LLL d, yyyy')
  }

  get times() {
    return `${this.format(this.event.dtstart, 'h:mm a')} - ${this.format(
      this.event.dtend,
      'h:mm a'
    )}`
  }

  get fee(): string | undefined {
    if (this.event.course?.fee) {
      return this.event.course.fee
    } else if (this.event.fee) {
      return this.event.fee
    }
  }

  /**
   * Determines if the event is open to new registrations.
   * TODO: Implement override functionality.
   */
  get isOpen() {
    // The event has already started.
    if (isAfter(new Date(), new Date(this.event.dtstart))) {
      return false
    }

    return true
  }

  format(date: string | Date, formatString: string) {
    return formatDate(date, formatString)
  }
}
</script>

<style lang="scss">
.icon--bg {
  background-color: rgba(0, 0, 0, 0.1);
}

.event--heading {
  font-weight: 700;
  font-size: 1.35rem;
}

.picture--toolbar {
  background-color: transparent !important;
}
</style>
