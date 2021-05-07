<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules">
    <v-text-field
      v-model="data"
      :error-messages="errors"
      :hide-details="hideDetails"
      :outlined="outlined"
      v-bind="$attrs"
      v-on="$listeners"
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
    </v-text-field>
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
      type: [String, Number],
      required: false,
      default: null,
    },
    hideDetails: {
      type: String,
      default: 'auto',
    },
    outlined: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const data = useVModel(props)

    return { data }
  },
})
</script>
