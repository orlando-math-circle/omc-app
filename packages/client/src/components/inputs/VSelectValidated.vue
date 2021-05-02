<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-select
      v-model="data"
      :error-messages="errors"
      :hide-details="hideDetails"
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
    </v-select>
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
      type: [String, Number, Object, Array],
      required: false,
      default: null,
    },
    rules: {
      type: [String, Object],
      required: true,
    },
    vid: {
      type: String,
      default: undefined,
    },
    hideDetails: {
      type: String,
      default: 'auto',
    },
  },
  setup(props, { emit }) {
    const data = computed({
      get() {
        return props.value
      },
      set(value: any) {
        emit('input', value)
      },
    })

    return { data }
  },
})
</script>
