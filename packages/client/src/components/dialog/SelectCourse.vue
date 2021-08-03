<template>
  <v-dialog v-model="dialog">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" large icon v-on="on">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </slot>
    </template>

    <v-card :loading="isLoading">
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Search Courses</v-toolbar-title>

        <v-spacer />
      </v-toolbar>

      <v-card-text>
        <v-text-field
          v-model="search"
          label="Search courses"
          outlined
          autocomplete="off"
          hide-details="auto"
        />

        <v-expand-transition>
          <v-data-table
            :items="$store.state.courses.courses"
            :headers="headers"
            :search="search"
            :server-items-length="$store.state.courses.total"
            show-select
            single-select
            @item-selected="onTableSelected"
            @update:options="onOptionsChange"
          />
        </v-expand-transition>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { DataTableOptions } from '@/types/data-table.interface'
import { PropType } from 'vue-demi'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useFetch,
  watch,
} from '@nuxtjs/composition-api'
import { useCourses } from '@/stores'
import { useDebouncedRef } from '@/composables/useDebouncedRef'

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Description', value: 'description' },
  { text: 'Payment Type', value: 'paymentType' },
]

export default defineComponent({
  props: {
    value: {
      type: Number as PropType<number | null>,
      required: true,
    },
    project: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      dialog: false,
      bouncing: false,
      pagination: {
        total: 0,
        limit: 10,
        offset: 10,
        sort: [] as string[],
      },
    })

    const search = useDebouncedRef('')

    const id = computed({
      get() {
        return props.value
      },
      set(value: number | null) {
        emit('input', value)
      },
    })

    const courseStore = useCourses()

    const courses = computed(() => courseStore.courses)
    const isLoading = computed(() => courseStore.isLoading)

    const load = async () => {
      const all = state.pagination.limit === -1

      await courseStore.findAllByProject(props.project, {
        contains: search.value,
        limit: all ? undefined : state.pagination.limit,
        offset: all ? undefined : state.pagination.offset,
        sort: state.pagination.sort.length ? state.pagination.sort : undefined,
      })

      state.bouncing = false
    }

    watch(search, async () => {
      state.bouncing = true
      await load()
    })

    useFetch(async () => await load())

    const onTableSelected = (value: any) => {
      id.value = value.item.id
    }

    const onOptionsChange = (options: DataTableOptions) => {
      state.pagination.limit = options.itemsPerPage
      state.pagination.offset = state.pagination.limit * (options.page - 1)

      if (options.sortBy.length) {
        state.pagination.sort = []

        for (let i = 0; i < options.sortBy.length; i++) {
          state.pagination.sort[i] = `${options.sortBy[i]}:${
            options.sortDesc[i] ? 'DESC' : 'ASC'
          }`
        }
      }

      load()
    }

    return {
      ...toRefs(state),
      search,
      headers,
      id,
      courses,
      isLoading,
      onTableSelected,
      onOptionsChange,
    }
  },
})
</script>
