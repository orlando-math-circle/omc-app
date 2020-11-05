<template>
  <v-row>
    <v-col>
      <h2 class="headline">Upcoming Events</h2>

      <v-row>
        <v-col>
          <v-slide-group class="mb-4">
            <v-slide-item v-for="event in events.slice(0, 10)" :key="event.id">
              <event-block
                :event="event"
                :link="`/events/${event.id}`"
                class="mr-4"
              ></event-block>
            </v-slide-item>
          </v-slide-group>
        </v-col>
      </v-row>

      <v-snackbar v-model="registeredMessage">
        Thank you for registering!

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" icon v-bind="attrs" @click="snackbar = false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

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
              <v-icon large left color="accent">mdi-twitter</v-icon>
              <span>{{ tweet.user.name }}</span>
            </v-card-title>
            <v-card-subtitle>{{
              formatDate(tweet.created_at)
            }}</v-card-subtitle>

            <v-card-text>
              {{ tweet.text }}
            </v-card-text>
          </div>

          <v-avatar rounded size="80" class="mb-0 pt-2 pr-2">
            <v-img
              :src="tweet.user.profile_image_url_https.replace('_normal', '')"
            ></v-img>
          </v-avatar>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { addDays, format } from 'date-fns'
import { Event } from '@backend/event/event.entity'

@Component({
  head() {
    return {
      title: 'Home',
    }
  },
})
export default class HomePage extends Vue {
  tweets: any[] = []
  registeredMessage = false
  events: Event[] = []

  async fetch() {
    this.tweets = await this.$axios.$get('/twitter')
    this.events = await this.$accessor.events.findAll({
      start: new Date(),
      end: addDays(new Date(), 30),
    })
  }

  get nonReplyTweets() {
    return this.tweets.filter((tweet: any) => !tweet.in_reply_to_status_id)
  }

  formatDate(dateString: string) {
    const date = new Date(dateString)

    return format(date, 'MMMM do, yyyy')
  }

  mounted() {
    if (this.$accessor.auth.justRegistered) {
      this.registeredMessage = true
      this.$accessor.auth.setJustRegistered(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.headline {
  font-weight: 700 !important;
}
</style>
