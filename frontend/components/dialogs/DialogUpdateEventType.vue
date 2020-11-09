<template>
  <v-dialog v-model="dialog" max-width="350">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Edit Recurring Event</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-radio-group v-model="type">
          <v-radio label="This event" value="single"></v-radio>
          <v-radio label="This and future events" value="future"></v-radio>
          <v-radio label="All events" value="all"></v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="dialog = false">Close</v-btn>
        <v-btn text @click="onSubmit">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class DialogUpdateEventType extends Vue {
  dialog = false

  type = 'single'

  onSubmit() {
    this.$emit('submit:type', this.type)
    this.dialog = false
  }

  open() {
    this.dialog = true
  }
}
</script>
