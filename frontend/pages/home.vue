<template>
  <v-row>
    <v-col>
      <h2 class="headline">Upcoming Events</h2>

      <v-row>
        <v-col v-if="events.length" class="py-0">
          <v-slide-group class="mb-4">
            <v-slide-item
              v-for="event in events.slice(0, 10)"
              :key="event.id"
              class="padded-block"
            >
              <event-block
                :event="event"
                :link="`/events/${event.id}`"
                class="mr-4"
              ></event-block>
            </v-slide-item>
          </v-slide-group>
        </v-col>

        <v-col v-else class="pb-4">
          <span>No upcoming events.</span>
        </v-col>
      </v-row>

      <h2 class="headline">Latest News</h2>

      <v-card
        v-for="tweet in nonReplyTweets"
        :key="tweet.id"
        class="mt-3"
        :href="`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`"
        target="_blank"
        rel="noreferrer"
      >
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title>
              <v-icon large left color="primary">mdi-twitter</v-icon>
              <span>{{ tweet.user.name }}</span>
            </v-card-title>
            <v-card-subtitle>{{ format(tweet.created_at) }}</v-card-subtitle>

            <v-card-text>
              {{ tweet.text }}
            </v-card-text>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { addDays } from 'date-fns'
import { formatDate } from '../utils/utilities'

@Component({
  head: {
    title: 'Home',
  },
})
export default class HomePage extends Vue {
  async fetch() {
    const now = new Date()

    await Promise.all([
      this.$accessor.twitter.findAll(),
      this.$accessor.events.findAll({
        start: now,
        end: addDays(now, 30),
      }),
    ])
  }

  get tweets() {
    return this.$accessor.twitter.tweets
  }

  get events() {
    return this.$accessor.events.events
  }

  get nonReplyTweets() {
    return this.tweets.filter((tweet: any) => !tweet.in_reply_to_status_id)
  }

  format(date: string) {
    return formatDate(date, 'MMMM do, yyyy')
  }

  mounted() {
    if (this.$accessor.auth.justRegistered) {
      this.$accessor.snackbar.show({
        text: 'Thank you for registering!',
        timeout: 5000,
      })
      this.$accessor.auth.setJustRegistered(false)
    }
  }
}
</script>

<style lang="scss" scoped>
// Fixes mobile scrolling issue
// https://github.com/vuetifyjs/vuetify/issues/10673#issuecomment-674203098
::v-deep .v-slide-group__wrapper {
  touch-action: auto !important;
}

.padded-block {
  margin: 15px 0;
}

.headline {
  font-weight: 700 !important;
}
</style>
