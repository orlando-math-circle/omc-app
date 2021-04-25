<template>
  <VAutocompleteValidated
    v-model="data"
    :items="users"
    :label="label"
    :rules="rules"
    no-data-text="No users found"
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
import { useUsers } from '@/stores'

export default defineComponent({
  props: {
    value: {
      type: [Object, Number, String, Boolean],
      required: false,
      default: null,
    },
    label: {
      type: String,
      default: 'User',
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
    const userStore = useUsers()

    const data = useVModel(props)
    const users = computed(() => userStore.users)

    const onSearch = async (text: string) => {
      await userStore.findAll({ contains: text })
    }

    return { data, users, onSearch }
  },
})
</script>
