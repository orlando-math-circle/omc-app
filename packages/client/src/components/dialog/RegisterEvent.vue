<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title></v-card-title>

      <v-card-text> </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {
      dialog: ref(false),
    }
  },
})
</script>
