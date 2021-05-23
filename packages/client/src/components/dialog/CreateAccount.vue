<template>
  <FormDialog ref="dialog">
    <template #title>Create Account</template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>

    <template #form>
      <v-row>
        <v-col cols="6">
          <v-text-field-validated
            v-model="first"
            label="First Name"
            rules="required"
            required
          />
        </v-col>

        <v-col cols="6">
          <v-text-field-validated
            v-model="last"
            label="Last Name"
            rules="required"
            required
          />
        </v-col>

        <v-col cols="12">
          <BirthdayPickerValidated
            v-model="dob"
            :min-age="18"
            :custom-messages="{
              min_age: 'Primary account users must be 18 years old.',
            }"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field-validated
            v-model="email"
            label="Email"
            rules="required|email"
            required
          />
        </v-col>
      </v-row>
    </template>
  </FormDialog>
</template>

<script lang="ts">
import { defineComponent, toRefs } from '@nuxtjs/composition-api'
import { useStateReset } from '@/composables/useStateReset'
import BirthdayPickerValidated from '@/components/inputs/BirthdayPickerValidated.vue'

export default defineComponent({
  components: { BirthdayPickerValidated },
  setup() {
    const { state, reset } = useStateReset({
      first: '',
      last: '',
      email: '',
      dob: '',
    })

    return {
      ...toRefs(state),
      reset,
    }
  },
})
</script>
