<template>
  <ValidationProvider
    v-slot="{ errors }"
    :rules="{
      positive_age: true,
      min_age: minAge,
      max_age: maxAge,
    }"
    :custom-messages="customMessages"
    :vid="vid"
  >
    <BirthdayPicker
      v-model="data"
      :error="!!errors.length"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <div v-if="!!errors.length" class="v-text-field__details mt-2 mb-3 px-3">
      <div class="v-messages error--text">
        <div class="v-messages__wrapper">
          <div class="v-messages__message">
            {{ errors[0] }}
          </div>
        </div>
      </div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { useVModel } from '@vueuse/core'
import { ValidationProvider } from 'vee-validate'

interface CustomMessages {
  min_age?: string
  max_age?: string
}

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    minAge: {
      type: Number,
      default: 18,
    },
    maxAge: {
      type: Number,
      default: 100,
    },
    customMessages: {
      type: Object as PropType<CustomMessages>,
      required: false,
      default: () => ({}),
    },
    vid: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const data = useVModel(props)

    return {
      data,
    }
  },
})
</script>
