<template>
  <v-row>
    <v-col>
      <h2 class="headline">Upcoming Events</h2>

      <v-slide-group v-if="events.length" class="mb-4">
        <v-slide-item
          v-for="event in events"
          :key="`event_${event.id}`"
          class="padded-block"
        >
          <div>
            <EventBlock
              :event="event"
              :link="`/events/${event.id}`"
              class="mr-4"
            />
          </div>
        </v-slide-item>
      </v-slide-group>

      <div class="my-3">
        <span>No upcoming events.</span>
      </div>

      <h2 class="headline">Latest News</h2>

      <v-card
        v-for="tweet in tweets"
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

            <v-card-text>{{ tweet.text }}</v-card-text>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useTwitter, useEvents } from '@/stores'
import { useDates } from '@/composables'

export default defineComponent({
  setup() {
    const twitterStore = useTwitter()
    const eventStore = useEvents()
    const dateUtils = useDates()

    const tweets = computed(() =>
      twitterStore.tweets.filter((t) => !t.in_reply_to_status_id)
    )

    const format = (date: string) =>
      dateUtils.format(new Date(date), 'MMMM do, yyyy')
    const events = computed(() => eventStore.events.slice(0, 10))

    return {
      format,
      tweets,
      events,
    }
  },
  async asyncData({ $pinia }) {
    const twitterStore = useTwitter($pinia)
    const eventStore = useEvents($pinia)
    const dateUtils = useDates()
    const now = new Date()

    await Promise.all([
      twitterStore.findAll(),
      eventStore.findAll({ start: now, end: dateUtils.addDays(now, 30) }),
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
