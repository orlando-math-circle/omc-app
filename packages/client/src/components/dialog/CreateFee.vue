<template>
  <v-dialog v-model="dialog" max-width="550">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Event Fee</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <VTextFieldValidated
          v-model="dto.amount"
          label="Event Fee"
          type="number"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { toRefs } from '@vueuse/core'

export default defineComponent({
  setup() {
    const state = reactive({
      dialog: false,
      dto: {
        amount: '',
      },
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>
