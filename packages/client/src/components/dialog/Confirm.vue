<template>
  <v-dialog v-model="dialog" max-width="440px">
    <template #activator="activator">
      <slot name="activator" v-bind="activator"></slot>
    </template>

    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn color="secondary" @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: 'Are you sure?',
    },
  },
  setup(_, { emit }) {
    const state = reactive({
      dialog: false,
      value: null as any,
    })

    const open = (value: any) => {
      state.value = value
      state.dialog = true
    }

    const confirm = () => {
      emit('confirm', state.value)
      state.dialog = false
    }

    return {
      dialog: state.dialog,
      open,
      confirm,
    }
  },
})
</script>
