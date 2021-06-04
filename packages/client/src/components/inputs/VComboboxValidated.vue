<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules" :vid="vid">
    <v-combobox
      v-model="data"
      :error-messages="errors"
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
    </v-combobox>
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
    value: {
      type: null as any,
      required: true,
    },
    rules: {
      type: [String, Object],
      default: '',
    },
    vid: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(props) {
    return { data: useVModel(props) }
  },
})
</script>
