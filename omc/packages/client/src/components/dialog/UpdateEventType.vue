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
        <v-spacer />

        <v-btn text @click="dialog = false">Close</v-btn>
        <v-btn text @click="onSubmit">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { EventUpdateModes } from '@/types/events/event-update-modes.interface'

export default defineComponent({
  props: {
    changeset: {
      type: Object as PropType<EventUpdateModes>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const state = reactive({
      dialog: false,

      type: '',
    })

    const open = () => {
      state.dialog = true
    }

    const onSubmit = () => {
      switch (state.type) {
        case 'single':
          emit('submit:type', state.type, props.changeset.single)
          break
        case 'future':
          emit('submit:type', state.type, props.changeset.future)
          break
        case 'all':
          emit('submit:type', state.type, props.changeset.all)
          break
      }

      state.dialog = false
    }

    return { ...toRefs(state), open, onSubmit }
  },
})
</script>
