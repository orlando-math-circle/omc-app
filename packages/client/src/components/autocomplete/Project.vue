<template>
  <VAutocompleteValidated
    v-model="data"
    :items="projects"
    :label="label"
    :rules="rules"
    no-data-text="No projects found"
    item-text="name"
    item-value="id"
    hide-details="auto"
    clearable
    outlined
    debounce
    @search="onSearch"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'
import { useProjects } from '@/stores'

export default defineComponent({
  props: {
    value: {
      type: [Array, Object, Number, String, Boolean],
      required: false,
      default: null,
    },
    label: {
      type: String,
      default: 'Project',
    },
    debounce: {
      type: Boolean,
      default: true,
    },
    rules: {
      type: [String, Object],
      default: '',
    },
  },
  setup(props) {
    const projectStore = useProjects()

    const data = useVModel(props)
    const projects = computed(() => projectStore.projects)

    const onSearch = async (text: string) => {
      await projectStore.findAll({ contains: text })
    }

    return {
      data,
      projects,
      onSearch,
    }
  },
})
</script>
