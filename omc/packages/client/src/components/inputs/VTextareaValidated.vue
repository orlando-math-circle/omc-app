<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules" :vid="vid">
    <v-textarea
      v-model="data"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useVModel } from '@vueuse/core'
import { ValidationProvider } from 'vee-validate'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    rules: {
      type: [String, Object],
      default: '',
    },
    value: {
      type: String,
      required: false,
      default: null,
    },
    vid: {
      type: String,
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
