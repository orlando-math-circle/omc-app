<template>
  <v-card :to="`/events/${value.id}`">
    <v-card-title>{{ value.name }}</v-card-title>
    <v-card-subtitle>{{ value.description }}</v-card-subtitle>

    <v-list-item>
      <v-list-item-content>
        <v-row no-gutters class="mb-2">
          <v-col cols="auto">
            <v-icon>mdi-clock-outline</v-icon>
          </v-col>

          <v-col class="pl-5">{{ start }}</v-col>
        </v-row>

        <v-row no-gutters class="mb-2">
          <v-col cols="auto">
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-col>

          <v-col class="pl-5">
            {{ value.author.first }} {{ value.author.last }}
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="auto">
            <v-icon>{{
              value.isOnline ? 'mdi-web' : 'mdi-map-marker-outline'
            }}</v-icon>
          </v-col>

          <v-col class="pl-5">
            {{ value.isOnline ? 'Online' : value.location }}
          </v-col>
        </v-row>
      </v-list-item-content>

      <v-list-item-avatar rounded size="100">
        <v-img :src="require('~/assets/images/programmer.jpg')"></v-img>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-text>
      <v-row no-gutters>
        <v-col>{{ value.description }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import moment from 'moment'
// import { Event } from '~/../backend/src/event/event.entity'

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  computed: {
    start() {
      if (!this.value) return ''

      return moment(this.value.start).format('ddd, MMM Do, YYYY')
    },
  },
})
</script>
