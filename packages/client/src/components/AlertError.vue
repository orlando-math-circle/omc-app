<template>
  <v-alert
    v-if="error"
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
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { StateError } from '@/types/state-error.interface'

export default defineComponent({
  props: {
    error: {
      type: Object as PropType<StateError | null>,
      default: null,
      validator: (prop) => prop === null || typeof prop === 'object',
    },
  },
  setup(props) {
    return {
      status: computed(() => props.error?.status),
      message: computed(() => props.error?.message),
    }
  },
})
</script>
