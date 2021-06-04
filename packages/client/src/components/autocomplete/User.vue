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
    :clearable="clearable"
    debounce
    :solo="solo"
    :outlined="outlined"
    :multiple="multiple"
    v-bind="$attrs"
    @search="onSearch"
  >
    <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </VAutocompleteValidated>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'
import { useUsers } from '@/stores'

export default defineComponent({
  props: {
    value: {
      type: [Array, Object, Number, String, Boolean],
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
    itemValue: {
      type: String,
      default: 'id',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: true,
    },
    solo: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
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
