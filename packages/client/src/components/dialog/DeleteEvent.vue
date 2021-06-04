<template>
  <v-dialog v-model="dialog" max-width="350">
    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Delete recurring event</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-radio-group v-model="mode">
          <v-radio label="This event" value="single" />
          <v-radio label="This and following events" value="future" />
          <v-radio label="All events" value="all" />
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn text @click="dialog = false">Close</v-btn>
        <v-btn @click="confirm">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(_, { emit }) {
    const state = reactive({
      dialog: false,
      mode: 'single' as 'single' | 'future' | 'all',
    })

    const open = () => {
      state.dialog = true
    }

    const confirm = () => {
      emit('delete:confirm', state.mode)
    }

    return { ...toRefs(state), open, confirm }
  },
})
</script>
