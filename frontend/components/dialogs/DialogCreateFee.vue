<template>
  <v-dialog v-model="dialog" max-width="550">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Event Fee</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-text-field-validated
          v-model="dto.amount"
          label="Event Fee"
          type="number"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class DialogCreateFee extends Vue {
  dialog = false

  dto = {
    amount: '',
  }
}
</script>
