<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules">
    <v-autocomplete
      :value="value"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
      @input="$emit('input', $event)"
    >
      <template
        v-for="(_, scopedSlotName) in $scopedSlots"
        #[scopedSlotName]="slotData"
      >
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>

      <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName" />
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    rules: {
      type: [String, Object],
      required: true,
    },
  },
})
</script>
