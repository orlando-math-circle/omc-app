<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules">
    <v-select
      v-model="data"
      :error-messages="errors"
      :hide-details="hideDetails"
      v-bind="$attrs"
      outlined
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
    </v-select>
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
    hideDetails: {
      type: String,
      default: 'auto',
    },
    rules: {
      type: [String, Object],
      required: true,
    },
    value: {
      type: [String, Number, Object, Array],
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
