<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title></v-card-title>

      <v-card-text> </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class DialogRegisterEvent extends Vue {
  dialog = false
}
</script>
