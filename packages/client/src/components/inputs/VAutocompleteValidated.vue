<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules" :vid="$attrs.vid">
    <v-autocomplete
      :value="value"
      :error-messages="errors"
      :search-input.sync="search"
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
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'
import { useDebouncedRef } from '~/composables/useDebouncedRef'

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
      type: null as any,
      required: true,
    },
    debounce: {
      type: Boolean,
      default: false,
    },
    wait: {
      type: Number,
      default: 250,
    },
  },
  setup(props, { emit }) {
    const search = props.debounce ? useDebouncedRef('', props.wait) : ref('')

    watch(search, (value) => emit('search', value))

    return { search }
  },
})
</script>
