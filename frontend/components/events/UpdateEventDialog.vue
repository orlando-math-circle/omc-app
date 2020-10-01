<template>
  <v-dialog>
    <v-card-title>Edit Event</v-card-title>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Event } from '~/../backend/src/event/event.entity'

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<Event>,
      required: true,
    },
  },
})
</script>
