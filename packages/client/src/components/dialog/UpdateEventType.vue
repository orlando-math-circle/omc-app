<template>
  <v-dialog v-model="dialog" max-width="350">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Edit Recurring Event</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-radio-group v-model="type">
          <v-radio v-if="changeset.single" label="This event" value="single" />
          <v-radio
            v-if="changeset.future"
            label="This and future events"
            value="future"
          />
          <v-radio v-if="changeset.all" label="All events" value="all" />
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
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { EventUpdateModes } from '~/types/events/event-update-modes.interface'

@Component
export default class DialogUpdateEventType extends Vue {
  @Prop({ required: true }) readonly changeset!: EventUpdateModes

  dialog = false
  type = ''

  onSubmit() {
    switch (this.type) {
      case 'single':
        this.$emit('submit:type', this.type, this.changeset.single)
        break
      case 'future':
        this.$emit('submit:type', this.type, this.changeset.future)
        break
      case 'all':
        this.$emit('submit:type', this.type, this.changeset.all)
        break
    }

    this.dialog = false
  }

  open() {
    this.dialog = true
  }
}
</script>
