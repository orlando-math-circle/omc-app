<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-text-field
      v-model="text"
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
  </validation-provider>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    value: {
      type: [String, Number],
      required: false,
      default: null,
    },
    rules: {
      type: [String, Object],
      default: '',
    },
    vid: {
      type: String,
      default: undefined,
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
  setup(props, { emit }) {
    const text = computed({
      get() {
        return props.value
      },
      set(value: string) {
        emit('input', value)
      },
    })

    return { text }
  },
})
</script>
