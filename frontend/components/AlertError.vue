<template>
  <!-- <v-alert
    type="error"
    border="left"
    icon="mdi-fire"
    transition="scale-transition"
  >
    {{ message }}
  </v-alert> -->
  <span>{{ error }}</span>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'
import { StateError } from '../interfaces/state-error.interface'

@Component
export default class AlertError extends Vue {
  @Prop({ required: true }) error!: StateError

  get status() {
    return this.error.status
  }

  get message(): string {
    switch (this.status) {
      case 404:
        return 'The resource was not found.'
      case 400:
        return 'The request was not accepted by the server, ensure the necessary information was provided and try again, or contact an administrator.'
      default:
        return 'An unexpected error occured, please try again later.'
    }
  }
}
</script>
