<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
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
  </validation-provider>
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
      default: '',
    },
    hideDetails: {
      type: String,
      default: 'auto',
    },
    vid: {
      type: String,
      default: undefined,
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
