<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules">
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
    rules: {
      type: [String, Object],
      default: '',
    },
  },
  setup(props) {
    const data = useVModel(props)

    return { data }
  },
})
</script>
