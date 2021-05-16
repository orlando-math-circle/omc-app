<template>
  <v-data-table
    v-model="selections"
    v-bind="$attrs"
    @update:options="onChangeOptions"
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
  </v-data-table>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { DataTableOptions } from '@/types/data-table.interface'
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  watch,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      required: true,
    },
    search: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const selections = computed({
      get() {
        return props.value
      },
      set(value: any) {
        emit('input', value)
      },
    })

    const state = reactive({
      pagination: {
        total: 0,
        limit: 40,
        offset: 0,
        sort: [] as string[],
      },
    })

    const trimmedSearch = computed(() => props.search?.trim())

    const refresh = debounce(
      () =>
        emit('refresh', {
          contains: trimmedSearch.value,
          limit: state.pagination.limit,
          offset: state.pagination.offset,
          sort: state.pagination.sort,
        }),
      500
    )

    watch(() => props.search, refresh)

    const onChangeOptions = (options: DataTableOptions) => {
      state.pagination.limit = options.itemsPerPage
      state.pagination.offset = state.pagination.limit * (options.page - 1)
      state.pagination.sort = []

      if (options.sortBy.length) {
        for (let i = 0; i < options.sortBy.length; i++) {
          state.pagination.sort[i] = `${options.sortBy[i]}:${
            options.sortDesc[i] ? 'DESC' : 'ASC'
          }`
        }
      }

      refresh()
    }

    return { onChangeOptions, selections }
  },
})
</script>
