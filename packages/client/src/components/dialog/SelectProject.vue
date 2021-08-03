<template>
  <v-dialog v-model="dialog" max-width="650">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-tooltip bottom>
          <template #activator="tooltip">
            <v-btn
              v-bind="{ ...attrs, ...tooltip.attrs }"
              large
              icon
              v-on="{ ...on, ...tooltip.on }"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>

          <span>Search Projects</span>
        </v-tooltip>
      </slot>
    </template>

    <v-card :loading="isLoading">
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-toolbar-title>Select Project</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          v-model="search"
          label="Search projects"
          outlined
          autocomplete="off"
          hide-details="auto"
        />

        <v-expand-transition>
          <v-data-table
            :items="projects"
            :headers="headers"
            :search="search"
            :server-items-length="total"
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
import {
  defineComponent,
  useFetch,
  computed,
  reactive,
  watch,
  toRefs,
} from '@nuxtjs/composition-api'
import { DataTableOptions } from '@/types/data-table.interface'
import { useProjects } from '@/stores'
import { useDebouncedRef } from '@/composables'

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const projectStore = useProjects()

    const search = useDebouncedRef('')

    const state = reactive({
      dialog: false,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
      ],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        sort: [] as string[],
      },
    })

    useFetch(async () => {
      if (projectStore.projects.length < state.pagination.limit) {
        await projectStore.findAll({
          limit: state.pagination.limit,
          offset: state.pagination.offset,
        })
      }
    })

    const id = computed({
      get() {
        return props.value
      },
      set(value: number) {
        emit('input', value)
      },
    })

    const onTableSelected = (value: any) => (id.value = value.item.id)

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

      getProjects()
    }

    const getProjects = async () => {
      const all = state.pagination.limit === -1

      await projectStore.findAll({
        contains: search.value || '',
        limit: all ? undefined : state.pagination.limit,
        offset: all ? undefined : state.pagination.offset,
        sort: state.pagination.sort.length ? state.pagination.sort : undefined,
      })
    }

    watch(search, getProjects)

    return {
      ...toRefs(state),
      search,
      id,
      isLoading: computed(() => projectStore.isLoading),
      projects: computed(() => projectStore.projects),
      total: computed(() => projectStore.total),
      onTableSelected,
      onOptionsChange,
    }
  },
})
</script>
