<template>
  <div class="mb-4">
    <ValidationProvider
      v-slot="{ errors }"
      :rules="{
        positive_age: true,
        min_age: minAge,
        max_age: maxAge,
      }"
      :custom-messages="customMessages"
      name="Birthday"
    >
      <BirthdayPicker
        v-model="date"
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
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
  },
  setup(props, { emit }) {
    const date = computed({
      get() {
        return props.value
      },
      set(value: string) {
        emit('input', value)
      },
    })

    return {
      date,
    }
  },
})
</script>
