<template>
  <v-row>
    <v-col>
      <h2 class="headline">Registered Events</h2>

      <v-card>
        <v-card-title>Event Title</v-card-title>
        <v-card-subtitle>Event description</v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text>Go to Event</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head: {
    title: 'Home',
  },
})
</script>
