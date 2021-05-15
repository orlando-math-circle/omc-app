<template>
  <VAutocompleteValidated
    :value="value"
    :items="$accessor.projects.projects"
    :loading="$accessor.projects.isLoading"
    :search-input.sync="search"
    item-text="name"
    placeholder="Search for a project"
    hide-details="auto"
    clearable
    outlined
    v-bind="$attrs"
    @input="$emit('input', $event || null)"
  />
</template>

<script lang="ts">
import { defineComponent, useContext, watch } from '@nuxtjs/composition-api'
import { useDebouncedRef } from '~/composables/useDebouncedRef'

export default defineComponent({
  props: {
    value: {
      type: [String, Number, Object],
      default: null,
    },
    debounce: {
      type: [Boolean],
      default: false,
    },
    wait: {
      type: Number,
      default: 250,
    },
  },
  setup(props) {
    const { $accessor } = useContext()
    const search = useDebouncedRef('', props.wait)

    watch(search, () => $accessor.projects.findAll())

    return { search }
  },
})
</script>
