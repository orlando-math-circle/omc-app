<template>
  <v-alert
    type="error"
    border="left"
    icon="mdi-fire"
    transition="scale-transition"
  >
    {{ message }}
  </v-alert>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { isNetworkError } from '~/utils/utilities'

export default Vue.extend({
  props: {
    error: {
      type: Error as PropType<any>,
      required: true,
    },
  },
  computed: {
    isNetworkError(): boolean {
      return isNetworkError(this.error)
    },
    status(): number {
      return this.error?.response?.status
    },
    message(): string {
      if (this.isNetworkError) {
        return 'A networking error has occured, try again later or contact an administrator.'
      }

      switch (this.status) {
        case 404:
          return 'The resource was not found.'
        case 400:
          return 'The request was not accepted by the server, ensure the necessary information was provided and try again, or contact an administrator.'
        default:
          return 'An unexpected error occured, please try again later.'
      }
    },
  },
})
</script>
