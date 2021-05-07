<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules">
    <v-checkbox
      v-model="data"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    rules: {
      type: [String, Object],
      required: true,
    },
    value: {
      type: [Boolean],
      required: false,
      default: null,
    },
  },
  setup(props) {
    const data = useVModel(props)

    return { data }
  },
})
</script>
