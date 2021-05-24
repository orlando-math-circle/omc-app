<template>
  <v-dialog max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }" />
    </template>

    <v-card>
      <v-card-title>Color picker</v-card-title>

      <v-card-text>
        <v-color-picker
          :value="value"
          hide-mode-switch
          mode="hexa"
          @input="$emit('input', $event || null)"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn>Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup() {
    const dialog = ref(false)

    const open = () => (dialog.value = true)

    return { dialog, open }
  },
})
</script>
