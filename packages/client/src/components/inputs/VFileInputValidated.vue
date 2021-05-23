<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules" :vid="vid">
    <v-file-input
      :error-messages="errors"
      :hide-details="hideDetails"
      v-bind="$attrs"
      v-on="$listeners"
      @change="onChange"
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
    </v-file-input>
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
    value: {
      type: null as any,
      required: true,
    },
    rules: {
      type: [String, Object],
      default: '',
    },
    hideDetails: {
      type: String,
      default: 'auto',
    },
    vid: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(_, { emit }) {
    const onChange = (value: File) => {
      emit('input', value)
    }

    return { onChange }
  },
})
</script>
