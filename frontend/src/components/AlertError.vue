<template>
  <v-alert
    type="error"
    border="left"
    icon="mdi-fire"
    transition="scale-transition"
    color="secondary"
  >
    {{ message }}
  </v-alert>
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
    return this.error.message
  }
}
</script>
