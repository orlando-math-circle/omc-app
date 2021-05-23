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
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { addDays } from 'date-fns'
import { formatDate } from '@/utils/utilities'
import { useTwitter, useEvents } from '@/stores'

export default defineComponent({
  setup() {
    const twitterStore = useTwitter()
    const eventStore = useEvents()

    const nonReplyTweets = computed(() =>
      twitterStore.tweets.filter((tweet) => !tweet.in_reply_to_status_id)
    )

    const format = (date: string) => formatDate(date, 'MMMM do, yyyy')

    return {
      format,
      nonReplyTweets,
      events: computed(() => eventStore.events),
    }
  },
  async asyncData({ pinia }) {
    const twitterStore = useTwitter(pinia)
    const eventStore = useEvents(pinia)
    const now = new Date()

    await Promise.all([
      twitterStore.findAll(),
      eventStore.findAll({ start: now, end: addDays(now, 30) }),
    ])
  },
  head: {
    title: 'Home',
  },
})
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
